import { Pool } from 'pg';
import { SessionConfig, SessionStatus } from '../domain/Session';
import { SessionRepository } from './interfaces/SessionRepository';

export class PgSessionRepository implements SessionRepository {
    constructor(private readonly pool: Pool) { }

    async create(session: SessionConfig): Promise<void> {
        await this.pool.query(
            `INSERT INTO sessions (id, external_id, provider, status, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                session.id,
                session.externalId,
                session.provider,
                session.status,
                session.createdAt,
                session.updatedAt,
            ],
        );
    }

    async findByExternalId(externalId: string): Promise<SessionConfig | null> {
        const res = await this.pool.query(
            `SELECT id, external_id, provider, status, created_at, updated_at
			 FROM sessions WHERE external_id = $1`,
            [externalId],
        );
        if (res.rowCount === 0) return null;
        const row = res.rows[0];
        return {
            id: row.id,
            externalId: row.external_id,
            provider: row.provider,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    async findById(id: string): Promise<SessionConfig | null> {
        const res = await this.pool.query(
            `SELECT id, external_id, provider, status, created_at, updated_at
			 FROM sessions WHERE id = $1`,
            [id],
        );
        if (res.rowCount === 0) return null;
        const row = res.rows[0];
        return {
            id: row.id,
            externalId: row.external_id,
            provider: row.provider,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    async updateStatus(id: string, status: SessionStatus): Promise<void> {
        await this.pool.query(
            `UPDATE sessions SET status = $1, updated_at = now() WHERE id = $2`,
            [status, id],
        );
    }
}
