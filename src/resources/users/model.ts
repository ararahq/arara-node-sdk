export interface User {
    name: string;
    email: string;
    phoneNumber?: string;
    needsInitialOnboarding?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    phoneNumber?: string;
}
