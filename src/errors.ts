export interface AraraErrorParams {
    statusCode?: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryAfter?: number;
}

/**
 * Typed error thrown by the SDK for every failed request.
 * Parses the Arara API error envelope: { "error": { "code", "message", "details" } }.
 * retryAfter is in seconds, present when the API returns a Retry-After header.
 */
export class AraraError extends Error {
    readonly statusCode?: number;
    readonly code: string;
    readonly details?: Record<string, unknown>;
    readonly retryAfter?: number;

    constructor(params: AraraErrorParams) {
        super(params.message);
        this.name = 'AraraError';
        this.statusCode = params.statusCode;
        this.code = params.code;
        this.details = params.details;
        this.retryAfter = params.retryAfter;
        Object.setPrototypeOf(this, AraraError.prototype);
    }
}
