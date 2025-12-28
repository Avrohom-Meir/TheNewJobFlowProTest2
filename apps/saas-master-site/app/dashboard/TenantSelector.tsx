'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Tenant {
  id: number;
  name: string;
}

export default function TenantSelector() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const router = useRouter();
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch('/api/tenants');
        if (res.ok) {
          const data = await res.json();
          setTenants(Array.isArray(data) ? data : data.tenants || []);
          
          // Get stored tenant ID from cookie
          const tenantIdFromCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('tenantId='))
            ?.split('=')[1];
          
          if (tenantIdFromCookie) {
            setSelectedTenantId(tenantIdFromCookie);
          }
        }
      } catch (err) {
        console.error('Failed to fetch tenants:', err);
      }
    };

    fetchTenants();
  }, []);

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tenantId = e.target.value;
    setSelectedTenantId(tenantId);
    
    // Store tenant ID in cookie for middleware to use
    document.cookie = `tenantId=${tenantId}; path=/; max-age=86400`;
    
    // Reload page to apply new tenant context
    router.refresh();
  };

  const handleMigrateTenant = async () => {
    if (!selectedTenantId) return;
    try {
      setIsMigrating(true);
      const res = await fetch(`/api/tenants/${selectedTenantId}/migrate`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Tenant migrated successfully! JobT table added.');
        router.refresh();
      } else {
        alert('Migration failed');
      }
    } catch (err) {
      console.error('Migration error:', err);
      alert('Migration error');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrateJobs = async () => {
    if (!selectedTenantId) return;
    try {
      setIsMigrating(true);
      const res = await fetch(`/api/tenants/${selectedTenantId}/migrate-jobs`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Job columns added successfully!');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Migration failed: ${data.details || data.error}`);
      }
    } catch (err) {
      console.error('Migration error:', err);
      alert('Migration error');
    } finally {
      setIsMigrating(false);
    }
  };

  if (tenants.length === 0) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="container mx-auto flex items-center gap-4">
        <label htmlFor="tenant-select" className="text-sm font-medium text-gray-700">
          Tenant:
        </label>
        <select
          id="tenant-select"
          value={selectedTenantId}
          onChange={handleTenantChange}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">Select a tenant...</option>
          {tenants.map(tenant => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
        {selectedTenantId && (
          <>
            <span className="text-xs text-green-600 font-medium">
              ✓ Tenant {selectedTenantId} selected
            </span>
            <button
              onClick={handleMigrateTenant}
              disabled={isMigrating}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-xs font-medium transition"
            >
              {isMigrating ? 'Migrating...' : 'Migrate Tenant'}
            </button>
            <button
              onClick={handleMigrateJobs}
              disabled={isMigrating}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-xs font-medium transition"
            >
              {isMigrating ? 'Adding...' : 'Add Job Columns'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
