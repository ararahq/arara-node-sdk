import { BaseResource } from './BaseResource';
import {
    CampaignRequest,
    CampaignResponse,
    CampaignListResponse,
    CampaignEstimateResponse,
    CampaignDetailResponse,
    SendMessageOptions
} from '../types';

export class Campaigns extends BaseResource {
    /**
     * Create a campaign.
     * POST /v1/campaigns
     */
    async create(payload: CampaignRequest, options?: SendMessageOptions): Promise<CampaignResponse> {
        const headers: Record<string, string> = {};
        if (options?.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }
        const response = await this.client.post<CampaignResponse>('/v1/campaigns', payload, { headers });
        return response.data;
    }

    /**
     * List campaigns.
     * GET /v1/campaigns
     */
    async list(page = 0, size = 20, status?: string): Promise<CampaignListResponse> {
        const response = await this.client.get<CampaignListResponse>('/v1/campaigns', {
            params: { page, size, status }
        });
        return response.data;
    }

    /**
     * Estimate campaign cost.
     * GET /v1/campaigns/estimate
     */
    async estimate(templateName: string, count: number): Promise<CampaignEstimateResponse> {
        const response = await this.client.get<CampaignEstimateResponse>('/v1/campaigns/estimate', {
            params: { templateName, count }
        });
        return response.data;
    }

    /**
     * Get a campaign by id.
     * GET /v1/campaigns/{id}
     */
    async get(id: string): Promise<CampaignDetailResponse> {
        const response = await this.client.get<CampaignDetailResponse>(`/v1/campaigns/${id}`);
        return response.data;
    }

    /**
     * Cancel a campaign.
     * POST /v1/campaigns/{id}/cancel
     */
    async cancel(id: string): Promise<void> {
        await this.client.post(`/v1/campaigns/${id}/cancel`);
    }
}
