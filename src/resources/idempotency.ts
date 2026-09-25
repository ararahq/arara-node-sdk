import { randomUUID } from 'crypto';

export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';

/**
 * Returns the caller key or a fresh UUID v4. The key is set on the request config
 * once, so every retry of the same call replays the same key.
 */
export function idempotencyHeaders(callerKey?: string): Record<string, string> {
    const key = callerKey && callerKey.trim() !== '' ? callerKey : randomUUID();
    return { [IDEMPOTENCY_KEY_HEADER]: key };
}
