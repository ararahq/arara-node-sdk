import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Messages Resource', () => {
    let sdk: NodeSDK;
    let mockPost: jest.Mock;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };
    const mockResponse = {
        data: { id: 'ara_msg_1', status: 'queued', mode: 'live', sender: '123', receiver: '5588' }
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
            undefined
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
            undefined
        );
    });

    it('should not add templateVariables when none are provided', async () => {
        await sdk.messages.send({ receiver: '5588', body: 'Oi' });

        expect(mockPost).toHaveBeenCalledWith('/v1/messages', { receiver: '5588', body: 'Oi' }, undefined);
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
});
