export interface AraraWebhookEnvelope<T> {
    event: string;
    data: T;
    timestamp: string;
    organizationId: string;
}

export interface RevenueRecoveryData {
    name?: string;
    phone: string;
    total?: number;
    checkout_url?: string;
    minutes_without_payment?: number;
    pix_qr_code?: string;
}

export interface MessageStatusData {
    messageId: string;
    status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed' | 'canceled';
    receiver: string;
    sender: string;
    errorDetails?: any;
}

export interface InboundMessageData {
    from: string;
    to: string;
    body: string;
    type: 'text' | 'media';
    media_url?: string;
    sender_name?: string;
}

export type RevenueRecoveryWebhookEvent = AraraWebhookEnvelope<RevenueRecoveryData>;
export type MessageStatusWebhookEvent = AraraWebhookEnvelope<MessageStatusData>;
export type InboundMessageWebhookEvent = AraraWebhookEnvelope<InboundMessageData>;
export type AbacatePayWebhookEvent = AraraWebhookEnvelope<any>;
export type AraraWebhookEvent =
    | RevenueRecoveryWebhookEvent
    | MessageStatusWebhookEvent
    | InboundMessageWebhookEvent
    | AbacatePayWebhookEvent;
