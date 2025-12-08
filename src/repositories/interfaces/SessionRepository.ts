import { SessionConfig, SessionStatus } from '../../domain/Session';

export interface SessionRepository {
    create(session: SessionConfig): Promise<void>;
    findByExternalId(externalId: string): Promise<SessionConfig | null>;
    findById(id: string): Promise<SessionConfig | null>;
    updateStatus(id: string, status: SessionStatus): Promise<void>;
}
