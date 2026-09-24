import { AraraWebhookEvent, RevenueRecoveryWebhookEvent, MessageStatusWebhookEvent, InboundMessageWebhookEvent } from '../types';

const REVENUE_RECOVERY_EVENTS = new Set<string>([
    'cart.abandoned',
    'payment.failed',
    'pix.created',
    'boleto.due'
]);
const MESSAGE_STATUS_EVENT = 'message.status_updated';
const INBOUND_MESSAGE_EVENT = 'message.received';

interface WebhookPayload {
    event: string;
}

export class WebhookUtils {
    /**
     * Checks if the payload is a Revenue Recovery event (e.g. Abandoned Cart)
     */
    static isRevenueRecoveryEvent(payload: WebhookPayload): payload is RevenueRecoveryWebhookEvent {
        return REVENUE_RECOVERY_EVENTS.has(payload.event);
    }

    /**
     * Checks if the payload is a Message Status event
     */
    static isMessageStatusEvent(payload: WebhookPayload): payload is MessageStatusWebhookEvent {
        return payload.event === MESSAGE_STATUS_EVENT;
    }

    /**
     * Checks if the payload is an Inbound Message event
     */
    static isInboundMessageEvent(payload: WebhookPayload): payload is InboundMessageWebhookEvent {
        return payload.event === INBOUND_MESSAGE_EVENT;
    }

    /**
     * Attempts to identify the event type or returns null if unknown
     */
    static parseEvent(payload: WebhookPayload): AraraWebhookEvent | null {
        if (this.isRevenueRecoveryEvent(payload)) return payload;
        if (this.isMessageStatusEvent(payload)) return payload;
        if (this.isInboundMessageEvent(payload)) return payload;
        return null;
    }
}
