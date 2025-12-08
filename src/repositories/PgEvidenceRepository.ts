import { Pool } from 'pg';
import { EvidenceRepository, AuditEventRecord } from './interfaces/EvidenceRepository';

export class PgEvidenceRepository implements EvidenceRepository {
    constructor(private readonly pool: Pool) { }

    async appendEvent(event: AuditEventRecord): Promise<void> {
        await this.pool.query(
            `INSERT INTO audit_events (session_id, type, payload_hash, occurred_at)
			 VALUES ($1, $2, $3, now())`,
            [event.sessionId, event.type, event.payloadHash],
        );
    }

    async findEventsBySessionId(sessionId: string) {
        const res = await this.pool.query(
            `SELECT id, type, occurred_at, payload_hash
			 FROM audit_events
			 WHERE session_id = $1
			 ORDER BY occurred_at ASC`,
            [sessionId],
        );
        return res.rows.map((row) => ({
            id: row.id,
            type: row.type,
            occurredAt: row.occurred_at,
            payloadHash: row.payload_hash,
        }));
    }
}
