import { BaseResource } from './BaseResource';
import { SendMessageRequest, MessageResponse } from '../types';

export class Messages extends BaseResource {
    /**
     * Send a WhatsApp template message.
     * POST /v1/messages
     */
    async send(payload: SendMessageRequest): Promise<MessageResponse> {
        const response = await this.client.post<MessageResponse>('/v1/messages', payload);
        return response.data;
    }
}
