import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { setupInterceptors } from '../src/http';
import { Messages } from '../src/resources/messages';
import { Campaigns } from '../src/resources/campaigns';

function serverError(config: InternalAxiosRequestConfig): AxiosError {
    const response = { data: {}, status: 503, statusText: '503', headers: { 'retry-after': '0' }, config } as AxiosResponse;
    return new AxiosError('Service Unavailable', 'ERR_BAD_RESPONSE', config, {}, response);
}

function flakyClient(failures: number, seenKeys: unknown[]) {
    let attempts = 0;
    const client = axios.create({
        adapter: (requestConfig) => {
            attempts += 1;
            seenKeys.push(requestConfig.headers?.['Idempotency-Key']);
            if (attempts <= failures) {
                return Promise.reject(serverError(requestConfig as InternalAxiosRequestConfig));
            }
            return Promise.resolve({ data: { id: 'ok' }, status: 202, statusText: 'Accepted', headers: {}, config: requestConfig } as AxiosResponse);
        }
    });
    setupInterceptors(client, 3);
    return client;
}

describe('idempotent retries', () => {
    it('should replay the same generated key on every retry of messages.send', async () => {
        const seenKeys: unknown[] = [];
        const messages = new Messages(flakyClient(2, seenKeys));

        await messages.send({ receiver: '+5588999999999', body: 'oi' });

        expect(seenKeys).toHaveLength(3);
        expect(typeof seenKeys[0]).toBe('string');
        expect(new Set(seenKeys).size).toBe(1);
    });

    it('should replay the caller key on every retry of campaigns.create', async () => {
        const seenKeys: unknown[] = [];
        const campaigns = new Campaigns(flakyClient(1, seenKeys));

        await campaigns.create({ name: 'c' } as never, { idempotencyKey: 'caller-key' });

        expect(seenKeys).toEqual(['caller-key', 'caller-key']);
    });

    it('should not retry a POST without an idempotency key', async () => {
        const seenKeys: unknown[] = [];
        const client = flakyClient(5, seenKeys);

        await expect(client.post('/v1/templates', {})).rejects.toMatchObject({ name: 'AraraError', statusCode: 503 });
        expect(seenKeys).toHaveLength(1);
    });

    it('should keep retrying GET requests', async () => {
        const seenKeys: unknown[] = [];
        const client = flakyClient(2, seenKeys);

        await client.get('/v1/templates');

        expect(seenKeys).toHaveLength(3);
    });
});
