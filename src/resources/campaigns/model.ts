export interface CampaignContactRequest {
    to: string;
    variables?: string[];
}

export interface CampaignAbConfig {
    variantBTemplateName: string;
    metric?: string;
    samplePct?: number;
    splitPct?: number;
    decisionWindowMinutes?: number;
    autopilot?: boolean;
}

export interface CampaignRequest {
    name: string;
    templateName: string;
    sender?: string;
    contacts: CampaignContactRequest[];
    abTest?: CampaignAbConfig;
    /** ISO-8601. Omitted or null dispatches now; set creates the campaign as SCHEDULED. */
    scheduledAt?: string | null;
}

export interface CampaignResponse {
    id: string;
    name: string;
    status: string;
    totalMessages: number;
    totalCost: number;
    scheduledAt?: string | null;
}

export interface CampaignListItem {
    id: string;
    name: string;
    status: string;
    templateName: string;
    totalMessages: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    totalCost: number;
    createdAt: string | null;
}

export interface CampaignListResponse {
    content: CampaignListItem[];
    totalPages: number;
    totalElements: number;
}

export interface CampaignDetailResponse {
    id: string;
    name: string;
    status: string;
    templateName: string;
    templateBody: string | null;
    totalMessages: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    clickedCount: number;
    convertedCount: number;
    convertedValue: number;
    replyCount: number;
    holdoutCount: number;
    blockedCount: number;
    refundCount: number;
    refundValue: number;
    totalCost: number;
    scheduledAt: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string | null;
}

export interface CampaignEstimateResponse {
    templateCategory: string;
    recipientCount: number;
    templateCost: number;
    araraFee: number;
    unitPrice: number;
    totalCost: number;
}
