import { ProviderAdapter } from '../ProviderAdapter';
import { SessionConfig } from '../../domain/Session';

export class StubNordicProviderAdapter implements ProviderAdapter {
    id = 'nordic-stub';

    async createSession(sessionConfig: SessionConfig) {
        return { redirectUrl: `https://stub-provider/redirect/${sessionConfig.id}` };
    }

    async handleCallback(payload: any) {
        // Simulate callback handling
        return {
            sessionExternalId: payload.sessionExternalId ?? 'unknown',
            status: payload.status ?? 'COMPLETED',
            providerPayloadHash: 'stubhash',
        };
    }
}
