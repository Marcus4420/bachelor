import { SessionConfig } from './Session';

export interface AuditEvent {
    id: string;
    type: string;
    occurredAt: Date;
    payloadHash: string;
}

export interface EvidenceBundle {
    session: SessionConfig;
    events: AuditEvent[];
    integrity: string;
}
