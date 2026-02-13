import { AraraWebhookEvent, RevenueRecoveryWebhookEvent, AbacatePayWebhookEvent, MessageStatusWebhookEvent } from '../types';

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
     * Checks if the payload is an AbacatePay event
     */
    static isAbacatePayEvent(payload: any): payload is AbacatePayWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            payload.event === 'billing.paid'
        );
    }

    /**
     * Checks if the payload is a Message Status event
     */
    static isMessageStatusEvent(payload: any): payload is MessageStatusWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            'MessageSid' in payload &&
            'MessageStatus' in payload
        );
    }

    /**
     * Attempts to identify the event type or returns null if unknown
     */
    static parseEvent(payload: any): AraraWebhookEvent | null {
        if (this.isRevenueRecoveryEvent(payload)) return payload;
        if (this.isAbacatePayEvent(payload)) return payload;
        if (this.isMessageStatusEvent(payload)) return payload;
        return null;
    }
}
