'use client'

import { useState, useEffect } from 'react'

import { Button } from '@jobflow/shared/ui'
import { SidebarLayout } from './SidebarLayout'

interface Tenant {
  id: number
  name: string
  subdomain: string
  status: string
  plan: string
  createdAt: string
  ownerEmail?: string
  dbUrl?: string
}

interface TenantData {
  tenant: string
  customers: any[]
}

export default function Dashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [newTenant, setNewTenant] = useState({
    name: '',
    subdomain: '',
    ownerEmail: ''
  })
  const [mounted, setMounted] = useState(false)

  // Check if this is a tenant subdomain or query param
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const queryTenant = urlParams?.get('tenant')
  const baseDomain = 'localhost:3000'
  const isTenantView = mounted && (hostname.endsWith(`.${baseDomain}`) && !hostname.startsWith('app.') && hostname !== baseDomain || !!queryTenant)
  const tenantSubdomain = isTenantView ? (queryTenant || hostname.replace(`.${baseDomain}`, '')) : null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (isTenantView && tenantSubdomain) {
        // Tenant view: fetch tenant data
        fetchTenantData(tenantSubdomain)
      } else {
        // Admin view: fetch all tenants
        fetchTenants()
      }
    }
  }, [mounted, isTenantView, tenantSubdomain])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants')
      if (response.ok) {
        const data = await response.json()
        setTenants(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch tenants:', response.statusText)
        setTenants([])
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
      setTenants([])
    }
  }

  const fetchTenantData = async (subdomain: string) => {
    try {
      // First get tenant info
      const tenantResponse = await fetch(`/api/tenants?subdomain=${subdomain}`)
      if (tenantResponse.ok) {
        const tenant = await tenantResponse.json()
        setSelectedTenant(tenant)
        // Then fetch customers
        const customersResponse = await fetch(`/api/tenants/${tenant.id}/customers`)
        if (customersResponse.ok) {
          const data = await customersResponse.json()
          setTenantData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error)
    }
  }

  const createTenant = async () => {
    setIsCreating(true)
    setMessage('Provisioning tenant database...')
    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenant)
      })

      if (response.ok) {
        setShowCreateForm(false)
        setNewTenant({ name: '', subdomain: '', ownerEmail: '' })
        setMessage('Tenant created successfully!')
        fetchTenants()
      } else {
        const error = await response.json()
        setMessage(`Failed to create tenant: ${error.error}`)
      }
    } catch (error) {
      setMessage('Error creating tenant')
    } finally {
      setIsCreating(false)
    }
  }

  const updateTenantStatus = async (tenantId: number, status: string) => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        setMessage(`Tenant status updated to ${status}`)
        fetchTenants()
      } else {
        setMessage('Failed to update tenant status')
      }
    } catch (error) {
      setMessage('Error updating tenant status')
    }
  }

  const deleteTenant = async (tenantId: number) => {
    if (!confirm('Are you sure you want to delete this tenant and its database? This action cannot be undone.')) return
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setMessage('Tenant deleted successfully')
        fetchTenants()
      } else {
        setMessage('Failed to delete tenant')
      }
    } catch (error) {
      setMessage('Error deleting tenant')
    }
  }

  const viewTenantData = async (tenant: Tenant) => {
    setSelectedTenant(tenant)
    try {
      const response = await fetch(`/api/tenants/${tenant.id}/customers`)
      if (response.ok) {
        const data = await response.json()
        setTenantData(data)
      } else {
        setMessage('Failed to fetch tenant data')
      }
    } catch (error) {
      setMessage('Error fetching tenant data')
    }
  }

  // Only wrap tenant view in sidebar layout
  if (isTenantView) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">JobFlow - {tenantSubdomain}</h1>
          </div>
          {/* Main tenant dashboard content can go here */}
          {tenantData && (
            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Data for {tenantData.tenant}</h2>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Customers ({tenantData.customers.length})</h3>
                {tenantData.customers.length === 0 ? (
                  <p className="text-gray-600">No customers yet</p>
                ) : (
                  <div className="grid gap-2">
                    {tenantData.customers.map((customer: any) => (
                      <div key={customer.id} className="border rounded p-3">
                        <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarLayout>
    )
  }

  // Admin view (default)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{isTenantView ? `JobFlow - ${tenantSubdomain}` : 'JobFlow SaaS Dashboard'}</h1>
          {!isTenantView && <Button onClick={() => setShowCreateForm(true)}>
            Add New Tenant
          </Button>}
        </div>

        {message && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8">
            {message}
          </div>
        )}

        {/* Create Tenant Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Tenant</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Tenant Name"
                value={newTenant.name}
                onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Subdomain"
                value={newTenant.subdomain}
                onChange={(e) => setNewTenant({...newTenant, subdomain: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Owner Email"
                value={newTenant.ownerEmail}
                onChange={(e) => setNewTenant({...newTenant, ownerEmail: e.target.value})}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createTenant} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Tenants List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Tenants</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.subdomain}.jobflow.com</p>
                      <p className="text-sm text-gray-600">Status: <span className={`font-medium ${tenant.status === 'active' ? 'text-green-600' : tenant.status === 'suspended' ? 'text-yellow-600' : 'text-red-600'}`}>{tenant.status}</span> | Plan: {tenant.plan}</p>
                      {tenant.ownerEmail && <p className="text-sm text-gray-600">Owner: {tenant.ownerEmail}</p>}
                      {tenant.dbUrl && <p className="text-sm text-gray-600">DB: {tenant.dbUrl}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button onClick={() => viewTenantData(tenant)} size="sm">
                        View Data
                      </Button>
                      <Button onClick={() => window.open(`${window.location.origin}/dashboard?tenant=${tenant.subdomain}`)} size="sm" variant="outline">
                        Open Database
                      </Button>
                      {tenant.status === 'active' ? (
                        <Button onClick={() => updateTenantStatus(tenant.id, 'suspended')} variant="outline" size="sm">
                          Suspend
                        </Button>
                      ) : (
                        <Button onClick={() => updateTenantStatus(tenant.id, 'active')} variant="outline" size="sm">
                          Activate
                        </Button>
                      )}
                      <Button onClick={() => deleteTenant(tenant.id)} variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tenant Data View */}
        {tenantData && (
          <div className="bg-white rounded-lg shadow-sm mt-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Data for {tenantData.tenant}</h2>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-4">Customers ({tenantData.customers.length})</h3>
              {tenantData.customers.length === 0 ? (
                <p className="text-gray-600">No customers yet</p>
              ) : (
                <div className="grid gap-2">
                  {tenantData.customers.map((customer: any) => (
                    <div key={customer.id} className="border rounded p-3">
                      <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}