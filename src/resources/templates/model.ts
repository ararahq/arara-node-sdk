export interface Template {
    id: string;
    name: string;
    formattedName: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    body: string;
    samples?: string[];
    buttonsConfig?: any[];
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
    extraConfig?: Record<string, any>;
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
