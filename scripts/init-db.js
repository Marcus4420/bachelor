const { Client } = require('pg');

const sql = [
    "CREATE TABLE IF NOT EXISTS sessions (id uuid PRIMARY KEY, external_id text NOT NULL UNIQUE, provider text NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL)",
    "CREATE TABLE IF NOT EXISTS audit_events (id serial PRIMARY KEY, session_id uuid NOT NULL REFERENCES sessions(id), type text NOT NULL, payload_hash text NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now())",
];

const client = new Client({
    host: process.env.DB_HOST || 'eid-service-db.c70ucgc8q7ua.eu-central-1.rds.amazonaws.com',
    database: process.env.DB_NAME || 'eid',
    user: process.env.DB_USER || 'eid_user',
    password: process.env.DB_PASSWORD || 'eid_password',
    ssl: { rejectUnauthorized: false },
});

(async () => {
    await client.connect();
    for (const stmt of sql) {
        await client.query(stmt);
    }
    console.log('db init done');
    await client.end();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
