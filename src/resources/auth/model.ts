/** Mirrors UserResponseDTO returned by GET /auth/me. */
export interface CurrentUser {
    name: string;
    email: string;
    role: string | null;
    emailPending: boolean;
}
