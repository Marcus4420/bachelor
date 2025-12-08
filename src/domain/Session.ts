export type SessionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface StartSessionRequest {
    externalId: string;
    provider: string;
}

export interface SessionConfig {
    id: string;
    externalId: string;
    provider: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
}
