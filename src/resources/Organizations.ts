import { BaseResource } from './BaseResource';
import { OrganizationWebhook, UpdateWebhookRequest, WebhookUpdateResponse } from '../types';

export class Organizations extends BaseResource {
    /**
     * Get organization webhook configuration.
     * GET /organizations/me/webhook
     */
    async getWebhook(): Promise<OrganizationWebhook> {
        const response = await this.client.get<OrganizationWebhook>('/organizations/me/webhook');
        return response.data;
    }

    /**
     * Update organization webhook configuration.
     * PATCH /organizations/me/webhook
     */
    async updateWebhook(data: UpdateWebhookRequest): Promise<WebhookUpdateResponse> {
        const response = await this.client.patch<WebhookUpdateResponse>('/organizations/me/webhook', data);
        return response.data;
    }
}
