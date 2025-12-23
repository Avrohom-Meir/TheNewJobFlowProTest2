interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    status: 'Provisioning' | 'Active' | 'Suspended';
    createdAt: Date;
    plan: string;
    currentSchemaVersion: number;
}
interface User {
    id: string;
    email: string;
    role: 'OwnerAdmin' | 'TenantAdmin' | 'Sales' | 'Worker' | 'Finance';
}

export type { Tenant, User };
