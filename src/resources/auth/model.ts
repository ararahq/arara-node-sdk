/** Owner of the API key, as returned by GET /auth/me. Fields beyond these may be present. */
export interface CurrentUser {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string | null;
    [key: string]: unknown;
}
