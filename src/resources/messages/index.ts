import { BaseResource } from '../base-resource';
import { idempotencyHeaders } from '../idempotency';
import {
    SendMessageRequest,
    SendMessageOptions,
    MessageResponse,
    BatchMessageRequest,
    BatchMessageResponse
} from './model';

export const MAX_BATCH_SIZE = 1000;

export class Messages extends BaseResource {
    /**
     * Send a WhatsApp message. Always carries an Idempotency-Key (caller or generated),
     * so automatic retries never duplicate the send.
     * POST /v1/messages
     */
    async send(payload: SendMessageRequest, options?: SendMessageOptions): Promise<MessageResponse> {
        const { variables, templateVariables, ...rest } = payload;
        const resolvedVariables = templateVariables ?? variables;
        const body: Omit<SendMessageRequest, 'variables'> = {
            ...rest,
            ...(resolvedVariables !== undefined ? { templateVariables: resolvedVariables } : {})
        };
        const response = await this.client.post<MessageResponse>('/v1/messages', body, {
            headers: idempotencyHeaders(options?.idempotencyKey)
        });
        return response.data;
    }

    /**
     * Send one template to up to 1000 receivers.
     * POST /v1/messages/batch
     */
    async sendBatch(payload: BatchMessageRequest, options?: SendMessageOptions): Promise<BatchMessageResponse> {
        if (payload.messages.length > MAX_BATCH_SIZE) {
            throw new RangeError(`A batch accepts at most ${MAX_BATCH_SIZE} messages, got ${payload.messages.length}.`);
        }
        const response = await this.client.post<BatchMessageResponse>('/v1/messages/batch', payload, {
            headers: idempotencyHeaders(options?.idempotencyKey)
        });
        return response.data;
    }

    /**
     * Get a message by its id (the `id` returned by send).
     * GET /v1/messages/{id}
     */
    async get(id: string): Promise<MessageResponse> {
        const response = await this.client.get<MessageResponse>(`/v1/messages/${encodeURIComponent(id)}`);
        return response.data;
    }
}
