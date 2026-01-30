import { AraraWebhookEvent, RevenueRecoveryWebhookEvent, AbacatePayWebhookEvent, MessageStatusWebhookEvent } from '../types';

export class WebhookUtils {
    /**
     * Verifica se o payload é um evento de Recuperação de Receita (ex: Carrinho Abandonado)
     */
    static isRevenueRecoveryEvent(payload: any): payload is RevenueRecoveryWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            ['cart.abandoned', 'payment.failed', 'pix.created', 'boleto.due'].includes(payload.event)
        );
    }

    /**
     * Verifica se o payload é um evento do AbacatePay
     */
    static isAbacatePayEvent(payload: any): payload is AbacatePayWebhookEvent {
        return (
            payload &&
            typeof payload === 'object' &&
            payload.event === 'billing.paid'
        );
    }

    /**
     * Verifica se o payload é um evento de Status de Mensagem
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
     * Tenta identificar o tipo do evento ou retorna null se desconhecido
     */
    static parseEvent(payload: any): AraraWebhookEvent | null {
        if (this.isRevenueRecoveryEvent(payload)) return payload;
        if (this.isAbacatePayEvent(payload)) return payload;
        if (this.isMessageStatusEvent(payload)) return payload;
        return null;
    }
}
