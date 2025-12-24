'use client'

import { useState, useEffect } from 'react'
import { Button } from '@jobflow/shared/ui'

interface Tenant {
  id: number
  name: string
  subdomain: string
  status: string
  plan: string
  createdAt: string
  ownerEmail?: string
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
  const [newTenant, setNewTenant] = useState({
    name: '',
    subdomain: '',
    ownerEmail: ''
  })

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    const response = await fetch('/api/tenants')
    const data = await response.json()
    setTenants(data)
  }

  const createTenant = async () => {
    const response = await fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTenant)
    })

    if (response.ok) {
      setShowCreateForm(false)
      setNewTenant({ name: '', subdomain: '', ownerEmail: '' })
      fetchTenants()
    } else {
      alert('Failed to create tenant')
    }
  }

  const viewTenantData = async (tenant: Tenant) => {
    setSelectedTenant(tenant)
    const response = await fetch(`/api/tenants/${tenant.id}/customers`)
    const data = await response.json()
    setTenantData(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">JobFlow SaaS Dashboard</h1>
          <Button onClick={() => setShowCreateForm(true)}>
            Add New Tenant
          </Button>
        </div>

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
              <Button onClick={createTenant}>Create</Button>
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.subdomain}.jobflow.com</p>
                      <p className="text-sm text-gray-600">Status: {tenant.status} | Plan: {tenant.plan}</p>
                      {tenant.ownerEmail && <p className="text-sm text-gray-600">Owner: {tenant.ownerEmail}</p>}
                    </div>
                    <Button onClick={() => viewTenantData(tenant)}>
                      View Data
                    </Button>
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