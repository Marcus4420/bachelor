import { SessionConfig } from '../domain/Session';

export interface ProviderAdapter {
    id: string;
    createSession(sessionConfig: SessionConfig): Promise<{ redirectUrl: string }>;
    handleCallback(payload: unknown): Promise<{
        sessionId: string;
        status: string;
        providerPayloadHash: string;
    }>;
}
