import { WebhookUtils } from '../src/utils/WebhookUtils';

describe('WebhookUtils', () => {
    const envelope = {
        timestamp: '2026-07-10T10:00:00Z',
        organizationId: 'ara_org_123'
    };

    it('should identify revenue recovery events', () => {
        const payload = {
            ...envelope,
            event: 'cart.abandoned',
            data: { phone: '+5511999998888', checkout_url: 'https://example.com/checkout' }
        };
        expect(WebhookUtils.isRevenueRecoveryEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify message status events', () => {
        const payload = {
            ...envelope,
            event: 'message.status_updated',
            data: {
                messageId: 'ara_msg_123',
                status: 'delivered',
                receiver: '+5511999998888',
                sender: '+5511888887777'
            }
        };
        expect(WebhookUtils.isMessageStatusEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should identify inbound message events', () => {
        const payload = {
            ...envelope,
            event: 'message.received',
            data: {
                from: '+5511999998888',
                to: '+5511888887777',
                body: 'Oi',
                type: 'text'
            }
        };
        expect(WebhookUtils.isInboundMessageEvent(payload)).toBe(true);
        expect(WebhookUtils.parseEvent(payload)).toEqual(payload);
    });

    it('should return null for unknown events', () => {
        const payload = { ...envelope, event: 'unknown', data: {} };
        expect(WebhookUtils.parseEvent(payload)).toBeNull();
    });
});
