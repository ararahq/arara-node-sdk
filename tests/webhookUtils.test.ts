import { WebhookUtils } from '../src/utils/WebhookUtils';

describe('WebhookUtils', () => {
    it('should identify revenue recovery events', () => {
        const payload = { event: 'cart.abandoned', phone: '123', checkout_url: 'https://example.com/checkout' };
        expect(WebhookUtils.isRevenueRecoveryEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify abacate pay events', () => {
        const payload = {
            event: 'billing.paid',
            data: {
                id: '1',
                billing: {
                    id: 'bill_123',
                    amount: 1000,
                    status: 'paid'
                }
            }
        };
        expect(WebhookUtils.isAbacatePayEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify message status events', () => {
        const payload = { MessageSid: '123', MessageStatus: 'sent', From: '1', To: '2', MessageId: 'msg_123', Timestamp: '2024-03-20T10:00:00Z' };
        expect(WebhookUtils.isMessageStatusEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should return null for unknown events', () => {
        const payload = { event: 'unknown' };
        expect(WebhookUtils.parseEvent(payload)).toBeNull();
    });
});
