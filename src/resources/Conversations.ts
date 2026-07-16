import { BaseResource } from './BaseResource';
import { ConversationReplyRequest } from '../types';

export class Conversations extends BaseResource {
    /**
     * List conversations.
     * GET /v1/conversations
     */
    async list(
        status?: string,
        leadStatus?: string,
        page = 0,
        size = 20
    ): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>('/v1/conversations', {
            params: { status, leadStatus, page, size }
        });
        return response.data;
    }

    /**
     * Get lead status stats.
     * GET /v1/conversations/lead-stats
     */
    async leadStats(): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>('/v1/conversations/lead-stats');
        return response.data;
    }

    /**
     * List messages in a conversation.
     * GET /v1/conversations/{conversationId}/messages
     */
    async messages(conversationId: string, page = 0, size = 50): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>(
            `/v1/conversations/${conversationId}/messages`,
            { params: { page, size } }
        );
        return response.data;
    }

    /**
     * Reply within an open conversation window.
     * POST /v1/conversations/reply
     */
    async reply(request: ConversationReplyRequest): Promise<Record<string, unknown>> {
        const response = await this.client.post<Record<string, unknown>>('/v1/conversations/reply', request);
        return response.data;
    }

    /**
     * Update a conversation status.
     * PATCH /v1/conversations/{conversationId}/status
     */
    async updateStatus(conversationId: string, status: string): Promise<Record<string, unknown>> {
        const response = await this.client.patch<Record<string, unknown>>(
            `/v1/conversations/${conversationId}/status`,
            { status }
        );
        return response.data;
    }

    /**
     * Check the 24h window status for phones.
     * POST /v1/conversations/window-status
     */
    async windowStatus(phones: string[]): Promise<Record<string, unknown>> {
        const response = await this.client.post<Record<string, unknown>>('/v1/conversations/window-status', {
            phones
        });
        return response.data;
    }
}
