import { BaseResource } from './BaseResource';
import {
    CreateWhatsAppSmartLinkRequest,
    UpdateWhatsAppSmartLinkRequest,
    WhatsAppSmartLinkResponse
} from '../types';

export class SmartLinks extends BaseResource {
    /**
     * Create a WhatsApp smart link.
     * POST /v1/smart-links/whatsapp
     */
    async create(request: CreateWhatsAppSmartLinkRequest): Promise<WhatsAppSmartLinkResponse> {
        const response = await this.client.post<WhatsAppSmartLinkResponse>('/v1/smart-links/whatsapp', request);
        return response.data;
    }

    /**
     * Update a WhatsApp smart link.
     * PUT /v1/smart-links/whatsapp/{id}
     */
    async update(id: string, request: UpdateWhatsAppSmartLinkRequest): Promise<WhatsAppSmartLinkResponse> {
        const response = await this.client.put<WhatsAppSmartLinkResponse>(
            `/v1/smart-links/whatsapp/${id}`,
            request
        );
        return response.data;
    }

    /**
     * List WhatsApp smart links.
     * GET /v1/smart-links/whatsapp
     */
    async list(): Promise<WhatsAppSmartLinkResponse[]> {
        const response = await this.client.get<WhatsAppSmartLinkResponse[]>('/v1/smart-links/whatsapp');
        return response.data;
    }

    /**
     * Get smart link click stats.
     * GET /v1/smart-links/whatsapp/{id}/stats
     */
    async stats(id: string): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>(
            `/v1/smart-links/whatsapp/${id}/stats`
        );
        return response.data;
    }
}
