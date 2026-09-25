export interface OptOutRequest {
    /** E.164 with the leading plus, e.g. `+5511999998888`. */
    phone: string;
    /** Truncated by the API to 80 characters. */
    reason?: string;
}

export interface OptOutItem {
    phone: string;
    channel: string;
    reason: string | null;
    createdAt: string | null;
}

export interface OptOutList {
    items: OptOutItem[];
    total: number;
}

export interface OptOutCheck {
    phone: string;
    channel: string;
    optedOut: boolean;
}
