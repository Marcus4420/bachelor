import { ProviderAdapter } from '../ProviderAdapter';
import { SessionConfig } from '../../domain/Session';

export class StubEuroProviderAdapter implements ProviderAdapter {
    id = 'euro-stub';

    async createSession(sessionConfig: SessionConfig) {
        return { redirectUrl: `https://stub-provider/redirect/${sessionConfig.id}` };
    }

    async handleCallback(payload: any) {
        // Simulate callback handling
        return {
            sessionId: payload.sessionId ?? 'unknown',
            status: payload.status ?? 'COMPLETED',
            providerPayloadHash: 'stubhash',
        };
    }
}


