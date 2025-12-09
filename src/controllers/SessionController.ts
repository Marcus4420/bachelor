import { StartSessionRequest } from '../domain/Session';
import { SessionService } from '../services/SessionService';

export interface StartSessionResponse {
    sessionId: string;
    redirectUrl: string;
}

export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    async startSession(req: StartSessionRequest): Promise<StartSessionResponse> {
        if (!req.externalId) {
            throw new Error('externalId is required');
        }
        const result = await this.sessionService.startSession(req.externalId);
        return {
            sessionId: result.sessionId,
            redirectUrl: result.redirectUrl,
        };
    }
}
