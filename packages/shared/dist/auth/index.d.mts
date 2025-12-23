interface AuthUser {
    id: string;
    email: string;
    tenantId?: string;
    role: string;
}
declare function isAuthenticated(): boolean;

export { type AuthUser, isAuthenticated };
