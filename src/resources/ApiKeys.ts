import { BaseResource } from './BaseResource';
import { ApiKey, GeneratedApiKey } from '../types';

export class ApiKeys extends BaseResource {
    /**
     * List all API keys.
     * GET /api-keys
     */
    async list(): Promise<ApiKey[]> {
        const response = await this.client.get<ApiKey[]>('/api-keys');
        return response.data;
    }

    /**
     * Create a new API key.
     * POST /api-keys
     */
    async create(mode: 'LIVE' | 'TEST' = 'LIVE'): Promise<GeneratedApiKey> {
        const response = await this.client.post<GeneratedApiKey>('/api-keys', null, {
            params: { mode }
        });
        return response.data;
    }
}
