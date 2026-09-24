/** Mirrors TemplateResponse from the API. */
export interface Template {
    id: string;
    name: string;
    formattedName: string;
    category: string;
    originalCategory?: string | null;
    language: string;
    providerName: string;
    providerTemplateId: string;
    providerStatus: string;
    rejectionReason?: string | null;
    availableForSending: boolean;
    unavailableReason?: string | null;
    bodyPreview: string | null;
    /** Provider structure as a JSON object (empty object when unparseable). */
    structureJson: Record<string, unknown>;
    usageGuide?: Record<string, unknown> | null;
    /** Variable index to sample value, e.g. `{ "1": "Maria" }`. */
    variablesSchema?: Record<string, string> | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateTemplateRequest {
    name: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    /** Defaults to `pt_BR`. */
    language?: string;
    body: string;
    header?: string;
    headerType?: 'text' | 'media' | 'document';
    footer?: string;
    buttons?: TemplateButton[];
    samples?: Record<string, string>;
    variableExamples?: string[];
    /** 2 to 10 cards, each with media, body and up to 2 buttons. */
    carouselCards?: CarouselCard[];
}

export interface CarouselCard {
    mediaUrl: string;
    body: string;
    buttons?: TemplateButton[];
}

export interface TemplateButton {
    type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL' | 'SMART_LINK' | 'COPY_CODE' | 'FLOW' | 'CHARGE';
    text: string;
    url?: string;
    phone?: string;
    extraConfig?: Record<string, unknown>;
    /** FLOW buttons only: id of the Arara form the button opens. */
    flowId?: string;
}

export interface TemplateResponse {
    id: string;
    name: string;
}

export interface TemplateStatus {
    status: string;
    rejectionReason?: string | null;
    category: string;
}

export interface ListTemplatesParams {
    name?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface TemplateAnalyticsParams {
    /** Window such as `7d`, `30d` (API default) or `90d`. */
    period?: string;
}

interface TemplateAnalyticsCounters {
    period: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    /** Percentage formatted with one decimal, e.g. `"97.5"`. */
    deliveryRate: string;
    /** Percentage formatted with one decimal, e.g. `"41.0"`. */
    readRate: string;
}

/** GET /v1/templates/{id}/analytics */
export interface TemplateAnalytics extends TemplateAnalyticsCounters {
    templateId: string;
    templateName: string;
}

/** Item of GET /v1/templates/analytics (one per template name with traffic). */
export interface TemplateAnalyticsSummary extends TemplateAnalyticsCounters {
    templateName: string;
}
