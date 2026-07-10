import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AraraError } from './errors';

export const DEFAULT_MAX_RETRIES = 3;

const BASE_RETRY_DELAY_MS = 500;
const MAX_RETRY_DELAY_MS = 30000;
const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';
const RATE_LIMIT_STATUS = 429;
const SERVER_ERROR_THRESHOLD = 500;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    retryCount?: number;
}

interface ErrorEnvelopeBody {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
}

function parseErrorEnvelope(data: unknown): ErrorEnvelopeBody {
    if (typeof data !== 'object' || data === null || !('error' in data)) {
        return {};
    }
    const inner = (data as { error: unknown }).error;
    if (typeof inner !== 'object' || inner === null) {
        return {};
    }
    const envelope = inner as Record<string, unknown>;
    return {
        code: typeof envelope.code === 'string' ? envelope.code : undefined,
        message: typeof envelope.message === 'string' ? envelope.message : undefined,
        details:
            typeof envelope.details === 'object' && envelope.details !== null
                ? (envelope.details as Record<string, unknown>)
                : undefined
    };
}

export function parseRetryAfterSeconds(header: unknown): number | undefined {
    if (typeof header !== 'string' || header.trim() === '') {
        return undefined;
    }
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds >= 0) {
        return seconds;
    }
    const dateMs = Date.parse(header);
    if (Number.isNaN(dateMs)) {
        return undefined;
    }
    return Math.max(0, Math.ceil((dateMs - Date.now()) / 1000));
}

export function toAraraError(error: AxiosError): AraraError {
    const response = error.response;
    if (!response) {
        return new AraraError({
            code: NETWORK_ERROR_CODE,
            message: error.message || 'Network error while calling the Arara API'
        });
    }
    const envelope = parseErrorEnvelope(response.data);
    return new AraraError({
        statusCode: response.status,
        code: envelope.code ?? UNKNOWN_ERROR_CODE,
        message: envelope.message ?? error.message ?? `Request failed with status ${response.status}`,
        details: envelope.details,
        retryAfter: parseRetryAfterSeconds(response.headers?.['retry-after'])
    });
}

export function isRetryableError(error: AxiosError): boolean {
    if (!error.response) {
        return true;
    }
    const status = error.response.status;
    return status === RATE_LIMIT_STATUS || status >= SERVER_ERROR_THRESHOLD;
}

export function computeRetryDelayMs(attempt: number, retryAfterSeconds?: number): number {
    if (retryAfterSeconds !== undefined) {
        return Math.min(retryAfterSeconds * 1000, MAX_RETRY_DELAY_MS);
    }
    return Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function setupInterceptors(client: AxiosInstance, maxRetries: number): void {
    client.interceptors.response.use(undefined, async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            throw error;
        }
        const config = error.config as RetryableRequestConfig | undefined;
        if (config && isRetryableError(error)) {
            const attempt = config.retryCount ?? 0;
            if (attempt < maxRetries) {
                config.retryCount = attempt + 1;
                const retryAfterSeconds = parseRetryAfterSeconds(error.response?.headers?.['retry-after']);
                await sleep(computeRetryDelayMs(attempt, retryAfterSeconds));
                return client.request(config);
            }
        }
        throw toAraraError(error);
    });
}
