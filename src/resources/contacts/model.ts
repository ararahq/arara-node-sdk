export interface ContactRequest {
    name: string;
    phone: string;
    email?: string;
    attributes?: Record<string, unknown>;
}

export interface ContactPatchRequest {
    name?: string;
    email?: string;
    tags?: string[];
}

export interface ContactResponse {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    attributes: Record<string, unknown> | null;
    tags: string[];
    createdAt: string;
    lifecycle: string;
    source: string;
    outboundCount: number;
    inboundCount: number;
    firstSeenAt: string | null;
    lastOutboundAt: string | null;
    lastInboundAt: string | null;
    lastMessageAt: string | null;
    optOutAt: string | null;
    lastTemplateName: string | null;
}

export interface ContactsListResponse {
    contacts: ContactResponse[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}

export interface ContactsBatchError {
    index: number;
    phone: string | null;
    reason: string;
}

export interface ContactsBatchResponse {
    importId: string;
    created: number;
    updated: number;
    skipped: number;
    errors: ContactsBatchError[];
}

export interface ContactsStatsResponse {
    total: number;
    newCount: number;
    engaged: number;
    silent: number;
    dormant: number;
    optedOut: number;
}

export interface ContactsReactivationCandidate {
    phone: string;
    name: string;
    lastMessageAt: string | null;
    lastTemplateName: string | null;
}

export interface ContactsReactivationResponse {
    total: number;
    candidates: ContactsReactivationCandidate[];
}

export interface ContactMessageItem {
    id: string;
    direction: string;
    status: string;
    templateName: string | null;
    body: string | null;
    createdAt: string;
}

export interface ContactMessagesResponse {
    phone: string;
    total: number;
    messages: ContactMessageItem[];
}
