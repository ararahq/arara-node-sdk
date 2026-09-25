export interface SendMessageRequest {
    /** Accepts `whatsapp:+5511...`, `+5511...` or digits only. */
    receiver: string;
    sender?: string;
    type?: string;
    templateName?: string;
    templateVariables?: string[];
    /** Alias of templateVariables. */
    variables?: string[];
    body?: string;
    interactive?: Record<string, unknown>;
    location?: Record<string, unknown>;
    reaction?: Record<string, unknown>;
    charge?: Record<string, unknown>;
    replyTo?: string;
    smartLinkParam?: string;
    smartLinkUrl?: string;
    mode?: string;
    /** @deprecated Removed by the API on 2027-01-01. */
    media_url?: string;
    scheduled_at?: string;
}

export interface SendMessageOptions {
    /**
     * Sent as the Idempotency-Key header. When omitted the SDK generates a UUID v4
     * per call and reuses it on every retry of that call.
     */
    idempotencyKey?: string;
}

export interface MessageResponse {
    /** Message id; null when the API could not assign one (e.g. rejected before persistence). */
    id: string | null;
    status: string;
    mode: string;
    sender: string;
    receiver: string;
    body?: string | null;
    cost?: number | null;
    reason?: string | null;
}

export interface BatchMessageItem {
    receiver: string;
    templateVariables?: string[];
    /** Alias of templateVariables. */
    variables?: string[];
    smartLinkParam?: string;
    smartLinkUrl?: string;
    mediaUrl?: string;
}

export interface BatchMessageItemResponse {
    id: string | null;
    receiver: string;
    status: string;
    cost: number | null;
}

export interface BatchMessageRequest {
    templateName: string;
    /** At most 1000 items per batch. */
    messages: BatchMessageItem[];
}

export interface BatchMessageResponse {
    batchId: string;
    templateName: string;
    total: number;
    accepted: number;
    totalCost: number;
    messages: BatchMessageItemResponse[];
}
