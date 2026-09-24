export interface Template {
    id: string;
    name: string;
    formattedName: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    bodyPreview?: string | null;
    structureJson?: string | null;
    availableForSending?: boolean;
    samples?: string[];
    buttonsConfig?: unknown[];
    providerStatus: string;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateTemplateRequest {
    name: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    body: string;
    header?: string;
    headerType?: 'text' | 'media' | 'document';
    footer?: string;
    buttons?: TemplateButton[];
    samples?: Record<string, string>;
    variableExamples?: string[];
}

export interface TemplateButton {
    type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL' | 'SMART_LINK' | 'COPY_CODE';
    text: string;
    url?: string;
    phone?: string;
    extraConfig?: Record<string, unknown>;
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
