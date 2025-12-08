import { SessionService } from '../services/SessionService';

export class CallbackController {
    constructor(private readonly sessionService: SessionService) { }

    async handleProviderCallback(payload: unknown): Promise<void> {
        await this.sessionService.handleCallback(payload);
    }
}
