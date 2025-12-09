
import { ProviderAdapter } from './ProviderAdapter';
import { StubNordicAdapter } from './implementations/StubNordicProviderAdapter';
import { StubEuroProviderAdapter } from './implementations/StubEuroProviderAdapter';

export function getProviderAdapter(providerName: string): ProviderAdapter {
    switch (providerName) {
        case 'stubNordic':
            return new StubNordicAdapter();
        case 'stubEuro':
            return new StubEuroProviderAdapter();
        default:
            throw new Error(`Unknown provider: ${providerName}`);
    }
}