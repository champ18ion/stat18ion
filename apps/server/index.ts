import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-me';

// Middleware
app.use(express.json());

// 1. PUBLIC INGESTION ZONE: Echoes back any origin
// This satisfies browsers when credentials: 'include' is used by various frameworks
const ingestionCors = cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Echo back the requesting origin as the allowed origin
        callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200
});

app.options('/api/event', ingestionCors);
app.post('/api/event', ingestionCors, (req, res, next) => {
    next();
});

// 2. PRIVATE DASHBOARD ZONE: Restricted to your domain
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean);

// If the list is empty or contains '*', we will allow any origin by mirroring it
// (Required for credentials: true)
const dashboardCorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowAll = allowedOrigins.length === 0 || allowedOrigins.includes('*');
        if (!origin || allowAll || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Dashboard CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(dashboardCorsOptions));

// Database Connection
if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in environment variables.');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const siteSchema = z.object({
    name: z.string().min(1),
    domain: z.string().optional(),
});

const eventSchema = z.object({
    siteId: z.string(),
    path: z.string(),
    referrer: z.string().optional().default(''),
    ua: z.string().optional().default(''),
    ts: z.number(),
});

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = registerSchema.parse(req.body);
        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, hash]
        );
        const userId = result.rows[0].id;
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, userId });
    } catch (err: any) {
        if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        res.status(400).json({ error: 'Invalid input' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        // DEBUG: See what is actually arriving
        // console.log('Login Payload:', req.body); 

        const { email, password } = registerSchema.parse(req.body);
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, userId: user.id });
    } catch (err: any) {
        // DEBUG: Log the exact error to your terminal
        console.error('Login Failed:', err);

        // If it is a Zod validation error, it will show you exactly which field failed
        if (err.issues) {
             console.log('Validation Issues:', JSON.stringify(err.issues, null, 2));
        }

        res.status(400).json({ error: 'Invalid input' });
    }
});

// --- SITE ROUTES ---

app.post('/api/sites', authenticate, async (req: any, res) => {
    try {
        const { name, domain } = siteSchema.parse(req.body);
        const result = await pool.query(
            'INSERT INTO sites (user_id, name, domain) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, name, domain]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create site' });
    }
});

app.get('/api/sites', authenticate, async (req: any, res) => {
    try {
        const result = await pool.query('SELECT * FROM sites WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

// --- INGESTION ---

app.post('/api/event', async (req, res) => {
    try {
        const data = eventSchema.parse(req.body);

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const country = (req.headers['x-vercel-ip-country'] as string) || 'Unknown';
        const deviceType = data.ua.toLowerCase().includes('mobile') ? 'mobile' : 'desktop';

        // Hash IP + UA for privacy-friendly unique visitor tracking (daily salt ideally, but simple hash for now)
        const visitorHash = Buffer.from(`${ip}-${data.ua}-${new Date().toISOString().slice(0, 10)}`).toString('base64');

        const query = `
      INSERT INTO events (site_id, path, referrer, device_type, country, visitor_hash, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7 / 1000.0))
    `;
        const values = [data.siteId, data.path, data.referrer, deviceType, country, visitorHash, data.ts];

        pool.query(query, values).catch(err => console.error('DB Insert Error:', err));

        res.status(200).json({ status: 'ok' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid payload' });
    }
});

// --- STATS ---

app.get('/api/stats/:siteId', authenticate, async (req: any, res) => {
    const { siteId } = req.params;

    // Verify ownership
    const siteCheck = await pool.query('SELECT id FROM sites WHERE id = $1 AND user_id = $2', [siteId, req.userId]);
    if (siteCheck.rows.length === 0) return res.status(403).json({ error: 'Access denied' });

    try {
        const totalViews = await pool.query('SELECT COUNT(*) as count FROM events WHERE site_id = $1', [siteId]);
        const uniqueVisitors = await pool.query('SELECT COUNT(DISTINCT visitor_hash) as count FROM events WHERE site_id = $1', [siteId]);
        const topPages = await pool.query('SELECT path, COUNT(*) as count FROM events WHERE site_id = $1 GROUP BY path ORDER BY count DESC LIMIT 5', [siteId]);
        const topReferrers = await pool.query('SELECT referrer, COUNT(*) as count FROM events WHERE site_id = $1 GROUP BY referrer ORDER BY count DESC LIMIT 5', [siteId]);
        const topCountries = await pool.query('SELECT country, COUNT(*) as count FROM events WHERE site_id = $1 GROUP BY country ORDER BY count DESC LIMIT 5', [siteId]);

        // Daily views (last 7 days)
        const dailyViews = await pool.query(`
       SELECT to_char(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count 
       FROM events 
       WHERE site_id = $1 AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY date 
       ORDER BY date ASC
    `, [siteId]);

        res.json({
            total_views: totalViews.rows[0].count,
            unique_visitors: uniqueVisitors.rows[0].count,
            top_pages: topPages.rows,
            top_referrers: topReferrers.rows,
            top_countries: topCountries.rows,
            daily_views: dailyViews.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
