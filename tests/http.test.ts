import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AraraError } from '../src/errors';
import {
    computeRetryDelayMs,
    isRetryableError,
    parseRetryAfterSeconds,
    setupInterceptors,
    toAraraError
} from '../src/http';

function buildAxiosError(
    config: InternalAxiosRequestConfig,
    status: number,
    data: unknown,
    headers: Record<string, string> = {}
): AxiosError {
    const response = {
        data,
        status,
        statusText: String(status),
        headers,
        config
    } as AxiosResponse;
    return new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_RESPONSE', config, {}, response);
}

describe('toAraraError', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    it('should parse the nested error envelope', () => {
        const error = buildAxiosError(config, 402, {
            error: { code: 'INSUFFICIENT_FUNDS', message: 'Sem créditos', details: { balance: 0 } }
        });

        const result = toAraraError(error);

        expect(result).toBeInstanceOf(AraraError);
        expect(result.statusCode).toBe(402);
        expect(result.code).toBe('INSUFFICIENT_FUNDS');
        expect(result.message).toBe('Sem créditos');
        expect(result.details).toEqual({ balance: 0 });
    });

    it('should expose retryAfter in seconds when the header is present', () => {
        const error = buildAxiosError(config, 429, { error: { code: 'RATE_LIMITED', message: 'Calma' } }, {
            'retry-after': '7'
        });

        const result = toAraraError(error);

        expect(result.statusCode).toBe(429);
        expect(result.retryAfter).toBe(7);
    });

    it('should fall back to UNKNOWN_ERROR when the body has no envelope', () => {
        const error = buildAxiosError(config, 500, 'Internal Server Error');

        const result = toAraraError(error);

        expect(result.statusCode).toBe(500);
        expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should map network failures without response to NETWORK_ERROR', () => {
        const error = new AxiosError('connect ECONNREFUSED', 'ECONNREFUSED', config);

        const result = toAraraError(error);

        expect(result.statusCode).toBeUndefined();
        expect(result.code).toBe('NETWORK_ERROR');
    });
});

describe('parseRetryAfterSeconds', () => {
    it('should parse numeric seconds', () => {
        expect(parseRetryAfterSeconds('12')).toBe(12);
    });

    it('should parse HTTP dates into seconds from now', () => {
        const future = new Date(Date.now() + 10000).toUTCString();
        const parsed = parseRetryAfterSeconds(future);
        expect(parsed).toBeGreaterThanOrEqual(9);
        expect(parsed).toBeLessThanOrEqual(11);
    });

    it('should return undefined for garbage input', () => {
        expect(parseRetryAfterSeconds('soon')).toBeUndefined();
        expect(parseRetryAfterSeconds(undefined)).toBeUndefined();
    });
});

describe('isRetryableError', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    it('should retry network errors, 5xx and 429', () => {
        expect(isRetryableError(new AxiosError('timeout', 'ECONNABORTED', config))).toBe(true);
        expect(isRetryableError(buildAxiosError(config, 503, {}))).toBe(true);
        expect(isRetryableError(buildAxiosError(config, 429, {}))).toBe(true);
    });

    it('should not retry 4xx client errors', () => {
        expect(isRetryableError(buildAxiosError(config, 400, {}))).toBe(false);
        expect(isRetryableError(buildAxiosError(config, 404, {}))).toBe(false);
    });
});

describe('computeRetryDelayMs', () => {
    it('should back off exponentially', () => {
        expect(computeRetryDelayMs(0)).toBe(500);
        expect(computeRetryDelayMs(1)).toBe(1000);
        expect(computeRetryDelayMs(2)).toBe(2000);
    });

    it('should honor Retry-After over the exponential delay', () => {
        expect(computeRetryDelayMs(0, 3)).toBe(3000);
    });

    it('should cap the delay', () => {
        expect(computeRetryDelayMs(20)).toBe(30000);
        expect(computeRetryDelayMs(0, 999)).toBe(30000);
    });
});

describe('setupInterceptors retry flow', () => {
    it('should retry retryable failures and eventually succeed', async () => {
        let attempts = 0;
        const client = axios.create({
            adapter: (requestConfig) => {
                attempts += 1;
                if (attempts < 3) {
                    return Promise.reject(
                        buildAxiosError(requestConfig as InternalAxiosRequestConfig, 503, {}, { 'retry-after': '0' })
                    );
                }
                return Promise.resolve({
                    data: { ok: true },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: requestConfig
                } as AxiosResponse);
            }
        });
        setupInterceptors(client, 3);

        const response = await client.get('/v1/messages');

        expect(attempts).toBe(3);
        expect(response.data).toEqual({ ok: true });
    });

    it('should throw AraraError after exhausting retries', async () => {
        let attempts = 0;
        const client = axios.create({
            adapter: (requestConfig) => {
                attempts += 1;
                return Promise.reject(
                    buildAxiosError(
                        requestConfig as InternalAxiosRequestConfig,
                        429,
                        { error: { code: 'RATE_LIMITED', message: 'Calma' } },
                        { 'retry-after': '0' }
                    )
                );
            }
        });
        setupInterceptors(client, 2);

        await expect(client.get('/v1/messages')).rejects.toMatchObject({
            name: 'AraraError',
            statusCode: 429,
            code: 'RATE_LIMITED'
        });
        expect(attempts).toBe(3);
    });

    it('should not retry non-retryable errors', async () => {
        let attempts = 0;
        const client = axios.create({
            adapter: (requestConfig) => {
                attempts += 1;
                return Promise.reject(
                    buildAxiosError(requestConfig as InternalAxiosRequestConfig, 400, {
                        error: { code: 'INVALID_PAYLOAD', message: 'Payload inválido' }
                    })
                );
            }
        });
        setupInterceptors(client, 3);

        await expect(client.get('/v1/messages')).rejects.toMatchObject({
            name: 'AraraError',
            statusCode: 400,
            code: 'INVALID_PAYLOAD'
        });
        expect(attempts).toBe(1);
    });
});
