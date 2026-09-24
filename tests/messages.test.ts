import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('Messages Resource', () => {
    let sdk: NodeSDK;
    let mockPost: jest.Mock;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };
    const mockResponse = {
        data: {
            id: 'ara_msg_1',
            status: 'QUEUED',
            mode: 'LIVE',
            sender: '5511900000000',
            receiver: '5588',
            body: null,
            cost: 0.35,
            reason: null
        }
    };

    beforeEach(() => {
        mockPost = jest.fn().mockResolvedValue(mockResponse);
        mockedAxios.create.mockReturnValue({
            post: mockPost,
            get: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as never);
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should map variables alias to templateVariables', async () => {
        const result = await sdk.messages.send({
            receiver: '5588',
            templateName: 'hello',
            variables: ['World']
        });

        expect(mockPost).toHaveBeenCalledWith(
            '/v1/messages',
            { receiver: '5588', templateName: 'hello', templateVariables: ['World'] },
            { headers: { 'Idempotency-Key': expect.stringMatching(UUID_V4) } }
        );
        expect(result).toEqual(mockResponse.data);
    });

    it('should prefer templateVariables when both are provided', async () => {
        await sdk.messages.send({
            receiver: '5588',
            templateName: 'hello',
            templateVariables: ['Wins'],
            variables: ['Loses']
        });

        expect(mockPost).toHaveBeenCalledWith(
            '/v1/messages',
            { receiver: '5588', templateName: 'hello', templateVariables: ['Wins'] },
            { headers: { 'Idempotency-Key': expect.stringMatching(UUID_V4) } }
        );
    });

    it('should not add templateVariables when none are provided', async () => {
        await sdk.messages.send({ receiver: '5588', body: 'Oi' });

        expect(mockPost).toHaveBeenCalledWith('/v1/messages', { receiver: '5588', body: 'Oi' }, {
            headers: { 'Idempotency-Key': expect.stringMatching(UUID_V4) }
        });
    });

    it('should send Idempotency-Key header when idempotencyKey option is provided', async () => {
        await sdk.messages.send(
            { receiver: '5588', templateName: 'hello', templateVariables: ['World'] },
            { idempotencyKey: 'key-123' }
        );

        expect(mockPost).toHaveBeenCalledWith(
            '/v1/messages',
            { receiver: '5588', templateName: 'hello', templateVariables: ['World'] },
            { headers: { 'Idempotency-Key': 'key-123' } }
        );
    });

    it('should generate a different idempotency key per call', async () => {
        await sdk.messages.send({ receiver: '5588', body: 'a' });
        await sdk.messages.send({ receiver: '5588', body: 'b' });

        const first = mockPost.mock.calls[0][2].headers['Idempotency-Key'];
        const second = mockPost.mock.calls[1][2].headers['Idempotency-Key'];
        expect(first).not.toEqual(second);
    });

    it('should send a batch with an idempotency key', async () => {
        const payload = { templateName: 'hello', messages: [{ receiver: '5588', variables: ['A'] }] };

        const batchBody = {
            batchId: 'batch_9',
            templateName: 'hello',
            total: 2,
            accepted: 1,
            totalCost: 0.35,
            messages: [
                { id: 'ara_msg_9', receiver: '5588', status: 'QUEUED', cost: 0.35 },
                { id: null, receiver: '0', status: 'FAILED', cost: null }
            ]
        };
        mockPost.mockResolvedValueOnce({ data: batchBody });

        const result = await sdk.messages.sendBatch(payload, { idempotencyKey: 'batch-1' });

        expect(result.messages[1].id).toBeNull();
        expect(result.messages[1].cost).toBeNull();

        expect(mockPost).toHaveBeenCalledWith('/v1/messages/batch', payload, {
            headers: { 'Idempotency-Key': 'batch-1' }
        });
    });

    it('should reject a batch above 1000 messages without calling the API', async () => {
        const messages = Array.from({ length: 1001 }, () => ({ receiver: '5588' }));

        await expect(sdk.messages.sendBatch({ templateName: 'hello', messages })).rejects.toThrow(RangeError);
        expect(mockPost).not.toHaveBeenCalled();
    });

    it('should get a message by id', async () => {
        const mockGet = jest.fn().mockResolvedValue(mockResponse);
        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as never);
        sdk = new NodeSDK(config);

        const result = await sdk.messages.get('ara_msg_1');

        expect(mockGet).toHaveBeenCalledWith('/v1/messages/ara_msg_1');
        expect(result).toEqual(mockResponse.data);
    });
});
