
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://stat18ion:password@72.61.239.209:5434/stat18ion',
});

const migrate = async () => {
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
        // We need to ensure visitor_hash exists and site_id is linked (soft link or FK)
        // For MVP, if events exist with valid UUID site_ids from previous generic tests, we leave them.
        // We will alter table to add visitor_hash if missing.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                site_id TEXT NOT NULL,
                path TEXT NOT NULL,
                referrer TEXT,
                device_type TEXT,
                country TEXT,
                visitor_hash TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            
            ALTER TABLE events ADD COLUMN IF NOT EXISTS visitor_hash TEXT;
            
            CREATE INDEX IF NOT EXISTS idx_site_id ON events(site_id);
            CREATE INDEX IF NOT EXISTS idx_created_at ON events(created_at);
        `);
        console.log("Table 'events' ready.");

    } catch (err) {
        console.error("Migration Error:", err);
    } finally {
        await pool.end();
    }
};

migrate();
