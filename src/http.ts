import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AraraError, AraraErrorParams, AuthenticationError, PlanFeatureLockedError } from './errors';

export const DEFAULT_MAX_RETRIES = 3;

const BASE_RETRY_DELAY_MS = 500;
const MAX_RETRY_DELAY_MS = 30000;
const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';
const RATE_LIMIT_STATUS = 429;
const SERVER_ERROR_THRESHOLD = 500;
const UNAUTHORIZED_STATUS = 401;
const FORBIDDEN_STATUS = 403;
const PLAN_FEATURE_LOCKED_CODE = 'PLAN_FEATURE_LOCKED';
const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
const SAFE_METHODS = new Set(['get', 'head', 'options', 'put', 'delete']);

interface ErrorEnvelopeBody {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isErrorEnvelope(data: unknown): data is { error: ErrorEnvelopeBody } {
    return isRecord(data) && isRecord(data.error);
}

function parseErrorEnvelope(data: unknown): ErrorEnvelopeBody {
    if (!isErrorEnvelope(data)) {
        return {};
    }

    const error = data.error;
    return {
        code: error.code?.length ? error.code : undefined,
        message: error.message,
        details: error.details
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
    return buildTypedError({
        statusCode: response.status,
        code: envelope.code ?? UNKNOWN_ERROR_CODE,
        message: envelope.message ?? error.message ?? `Request failed with status ${response.status}`,
        details: envelope.details,
        retryAfter: parseRetryAfterSeconds(response.headers?.['retry-after'])
    }, envelope.code);
}

function buildTypedError(params: AraraErrorParams, envelopeCode: string | undefined): AraraError {
    if (params.statusCode === FORBIDDEN_STATUS && envelopeCode === PLAN_FEATURE_LOCKED_CODE) {
        return new PlanFeatureLockedError(params);
    }
    const isKeyRejection = params.statusCode === FORBIDDEN_STATUS && envelopeCode === undefined;
    if (params.statusCode === UNAUTHORIZED_STATUS || isKeyRejection) {
        return new AuthenticationError(params);
    }
    return new AraraError(params);
}

function hasIdempotencyKey(headers: unknown): boolean {
    if (!isRecord(headers)) {
        return false;
    }
    const getter = (headers as { get?: unknown }).get;
    const value = typeof getter === 'function'
        ? (getter as (name: string) => unknown).call(headers, IDEMPOTENCY_KEY_HEADER)
        : headers[IDEMPOTENCY_KEY_HEADER];
    return typeof value === 'string' && value.trim() !== '';
}

/**
 * A request may be replayed only when repeating it cannot duplicate side effects:
 * idempotent HTTP methods, or a POST/PATCH carrying an Idempotency-Key.
 */
export function isReplayableRequest(config: InternalAxiosRequestConfig): boolean {
    const method = (config.method ?? 'get').toLowerCase();
    return SAFE_METHODS.has(method) || hasIdempotencyKey(config.headers);
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
        const config = error.config;
        if (config && isRetryableError(error) && isReplayableRequest(config)) {
            // @ts-expect-error retryCount is an internal property managed by the SDK.
            const attempt = config.retryCount ?? 0;
            if (attempt < maxRetries) {
                // @ts-expect-error retryCount is an internal property managed by the SDK.
                config.retryCount = attempt + 1;
                const retryAfterSeconds = parseRetryAfterSeconds(error.response?.headers?.['retry-after']);
                await sleep(computeRetryDelayMs(attempt, retryAfterSeconds));
                return client.request(config);
            }
        }
        throw toAraraError(error);
    });
}
