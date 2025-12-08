export interface AuditEventRecord {
    sessionId: string;
    type: string;
    payloadHash: string;
}

export interface EvidenceRepository {
    appendEvent(event: AuditEventRecord): Promise<void>;
    findEventsBySessionId(sessionId: string): Promise<
        {
            id: string;
            type: string;
            occurredAt: Date;
            payloadHash: string;
        }[]
    >;
}
