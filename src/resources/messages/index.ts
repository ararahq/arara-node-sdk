import { BaseResource } from '../base-resource';
import { SendMessageRequest, SendMessageOptions, MessageResponse } from './model';

export class Messages extends BaseResource {
    /**
     * Send a WhatsApp template message.
     * POST /v1/messages
     */
    async send(payload: SendMessageRequest, options?: SendMessageOptions): Promise<MessageResponse> {
        const { variables, templateVariables, ...rest } = payload;
        const resolvedVariables = templateVariables ?? variables;
        const body: Omit<SendMessageRequest, 'variables'> = {
            ...rest,
            ...(resolvedVariables !== undefined ? { templateVariables: resolvedVariables } : {})
        };
        const requestConfig = options?.idempotencyKey
            ? { headers: { 'Idempotency-Key': options.idempotencyKey } }
            : undefined;
        const response = await this.client.post<MessageResponse>('/v1/messages', body, requestConfig);
        return response.data;
    }
}
