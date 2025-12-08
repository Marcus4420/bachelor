import { SessionConfig } from '../domain/Session';

export interface ProviderAdapter {
    id: string;
    createSession(sessionConfig: SessionConfig): Promise<{ redirectUrl: string }>;
    handleCallback(payload: unknown): Promise<{
        sessionExternalId: string;
        status: string;
        providerPayloadHash: string;
    }>;
}
