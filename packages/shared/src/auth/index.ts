export interface AuthUser {
  id: string
  email: string
  tenantId?: string
  role: string
}

export function isAuthenticated(): boolean {
  // Placeholder
  return false
}