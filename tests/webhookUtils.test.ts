import { WebhookUtils } from '../src/utils/WebhookUtils';

describe('WebhookUtils', () => {
    it('should identify revenue recovery events', () => {
        const payload = { event: 'cart.abandoned', phone: '123' };
        expect(WebhookUtils.isRevenueRecoveryEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify abacate pay events', () => {
        const payload = { event: 'billing.paid', data: { id: '1' } };
        expect(WebhookUtils.isAbacatePayEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify message status events', () => {
        const payload = { MessageSid: '123', MessageStatus: 'sent', From: '1', To: '2' };
        expect(WebhookUtils.isMessageStatusEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should return null for unknown events', () => {
        const payload = { event: 'unknown' };
        expect(WebhookUtils.parseEvent(payload)).toBeNull();
    });
});
