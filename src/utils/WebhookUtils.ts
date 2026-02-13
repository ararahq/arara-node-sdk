import { AraraWebhookEvent, RevenueRecoveryWebhookEvent, MessageStatusWebhookEvent, InboundMessageWebhookEvent } from '../types';

export class WebhookUtils {
    /**
     * Checks if the payload is a Revenue Recovery event (e.g. Abandoned Cart)
     */
    static isRevenueRecoveryEvent(payload: any): payload is RevenueRecoveryWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            ['cart.abandoned', 'payment.failed', 'pix.created', 'boleto.due'].includes(payload.event)
        );
    }

    /**
     * Checks if the payload is a Message Status event
     */
    static isMessageStatusEvent(payload: any): payload is MessageStatusWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            payload.event === 'message.status_updated'
        );
    }

    /**
     * Checks if the payload is an Inbound Message event
     */
    static isInboundMessageEvent(payload: any): payload is InboundMessageWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            payload.event === 'message.received'
        );
    }

    /**
     * Attempts to identify the event type or returns null if unknown
     */
    static parseEvent(payload: any): AraraWebhookEvent | null {
        if (this.isRevenueRecoveryEvent(payload)) return payload;
        if (this.isMessageStatusEvent(payload)) return payload;
        if (this.isInboundMessageEvent(payload)) return payload;
        return null;
    }
}
