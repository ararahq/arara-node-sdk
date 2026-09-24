export interface NumberCardDTO {
    id: string;
    name: string;
    alias: string | null;
    description: string | null;
    phoneNumber: string;
    type: string;
    isDefault: boolean;
    status: string;
    qualityScore: string;
    messagingTier: string;
    verifiedAt: string | null;
    lastHealthCheckAt: string | null;
    provider: string;
    createdAt: string | null;
    messagesLast7d: number;
    messagesLast30d: number;
}

export interface NumbersSlotDTO {
    used: number;
    max: number;
    planLabel: string;
    atCap: boolean;
    noEntitlement: boolean;
    monthlyPriceCents: number;
    monthlyTotalCents: number;
}

export interface NumbersResponseDTO {
    numbers: NumberCardDTO[];
    slot: NumbersSlotDTO;
}

export interface UpdateNumberRequest {
    alias?: string;
    isDefault?: boolean;
    name?: string;
    description?: string;
}

export interface RequestNumberRequest {
    reason?: string;
    expectedVolume?: string;
    areaCode?: string;
    displayName?: string;
    profilePictureUrl?: string;
}
