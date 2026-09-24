export interface CreateWhatsAppSmartLinkRequest {
    name: string;
    phoneNumber: string;
    defaultText?: string;
    qrCodeColor?: string;
}

export interface UpdateWhatsAppSmartLinkRequest {
    name?: string;
    defaultText?: string;
    qrCodeColor?: string;
}

export interface WhatsAppSmartLinkResponse {
    id: string;
    name: string;
    phoneNumber: string;
    defaultText: string | null;
    qrCodeColor: string;
    code: string;
    shortUrl: string;
    createdAt: string | null;
    clicks: number;
}
