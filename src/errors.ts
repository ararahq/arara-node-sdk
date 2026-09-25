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

/**
 * Thrown on 401, and on 403 without an error code (the API key was rejected:
 * invalid, expired, IP outside the allowlist, missing permission or path outside the key allowlist).
 */
export class AuthenticationError extends AraraError {
    constructor(params: AraraErrorParams) {
        super(params);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Thrown on 403 PLAN_FEATURE_LOCKED: the organization plan does not include the feature.
 */
export class PlanFeatureLockedError extends AraraError {
    readonly feature?: string;
    readonly currentPlan?: string;
    readonly upgradeTo?: string;

    constructor(params: AraraErrorParams) {
        super(params);
        this.name = 'PlanFeatureLockedError';
        this.feature = stringOrUndefined(params.details?.feature);
        this.currentPlan = stringOrUndefined(params.details?.currentPlan);
        this.upgradeTo = stringOrUndefined(params.details?.upgradeTo);
        Object.setPrototypeOf(this, PlanFeatureLockedError.prototype);
    }
}

function stringOrUndefined(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
}
