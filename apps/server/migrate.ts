
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const migrate = async () => {
    try {
        console.log('Starting SaaS Migration...');

        // 1. Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Table 'users' ready.");

        // 2. Sites Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sites (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                domain TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
        `);
        console.log("Table 'sites' ready.");

        // 3. Events Table (Update)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                site_id TEXT NOT NULL,
                path TEXT NOT NULL,
                referrer TEXT,
                device_type TEXT,
                browser TEXT,
                os TEXT,
                device TEXT,
                country TEXT,
                visitor_hash TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            
            ALTER TABLE events ADD COLUMN IF NOT EXISTS browser TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS os TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS device TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS visitor_hash TEXT;
            
            CREATE INDEX IF NOT EXISTS idx_site_id ON events(site_id);
            CREATE INDEX IF NOT EXISTS idx_created_at ON events(created_at);
            CREATE INDEX IF NOT EXISTS idx_browser ON events(browser);
            CREATE INDEX IF NOT EXISTS idx_os ON events(os);
        `);
        console.log("Table 'events' ready.");

    } catch (err) {
        console.error("Migration Error:", err);
    } finally {
        await pool.end();
    }
};
