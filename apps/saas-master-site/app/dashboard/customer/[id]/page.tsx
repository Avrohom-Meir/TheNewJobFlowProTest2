'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@jobflow/shared/ui';

interface Customer {
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  companyName: string;
  companyNumber: string;
  firstLineAddress: string;
  secondLineAddress: string;
  postCode: string;
  town: string;
  emailAddress: string;
  webSiteURL: string;
  phoneNr: string;
  mobileNr: string;
  customerSince: string;
  title: number;
  notes: string;
  accountsEmailAddress: string;
  invoiceDueDate: number;
  customerSelected: boolean;
  customerBankRef: string;
  groupedUnder: string;
}

interface Job {
  id: number;
  customerId: number;
  jobTypeId: number;
  jobStatusId: number;
  contactDate: string;
  siteAddress: string;
  sitePostCode: string;
  siteCity: string;
  sitePointOfContact: string;
  pointOfContactNr: string;
  buildingTypeId: number;
  isOccupied: boolean;
  officeNotes: string;
  surveyorNotes: string;
  fitterNotes: string;
  isPaid: boolean;
  invoiceNumber: string;
  invoiceSent: boolean;
  workStartedOn: string;
  workCompletedOn: string;
  invoiceToOwenerAndVerwaltung: boolean;
  invoiceAddress: string;
  addedTextOnInvoiceHeader: string;
  invoiceNumberPart: string;
  taxFreeJob: boolean;
  isCreditInvoice: boolean;
  creditInvoiceForJobId: number;
  jobOrderedBy: string;
  tenantNotes: string;
  siteNotes: string;
  siteAccessInstructions: string;
  jobSelected: boolean;
  addUnderAddress: string;
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/customers/${unwrappedParams.id}`);
        if (!res.ok) throw new Error('Failed to fetch customer');
        const data = await res.json();
        setCustomer(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [unwrappedParams.id]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const res = await fetch(`/api/customers/${unwrappedParams.id}/jobs`);
        if (!res.ok) {
          console.error('Jobs fetch failed with status:', res.status);
          setJobs([]);
          return;
        }
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [unwrappedParams.id]);

  const handleChange = (field: keyof Customer, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const res = await fetch(`/api/customers/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed to save customer');
      }
      const updated = await res.json();
      setCustomer(updated);
      setFormData(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error('Save error:', message);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading customer details...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800"><p>{error}</p></div>;
  if (!customer) return <div className="py-8 text-center">Customer not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {formData.customerFirstName} {formData.customerLastName}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>← Back</Button>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.customerFirstName || ''}
                onChange={e => handleChange('customerFirstName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.customerLastName || ''}
                onChange={e => handleChange('customerLastName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Since</label>
              <input
                type="date"
                value={formData.customerSince || ''}
                onChange={e => handleChange('customerSince', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="number"
                value={formData.title || ''}
                onChange={e => handleChange('title', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={e => handleChange('companyName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Number</label>
              <input
                type="text"
                value={formData.companyNumber || ''}
                onChange={e => handleChange('companyNumber', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="text"
                value={formData.webSiteURL || ''}
                onChange={e => handleChange('webSiteURL', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grouped Under</label>
              <input
                type="text"
                value={formData.groupedUnder || ''}
                onChange={e => handleChange('groupedUnder', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Line Address</label>
              <input
                type="text"
                value={formData.firstLineAddress || ''}
                onChange={e => handleChange('firstLineAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Second Line Address</label>
              <input
                type="text"
                value={formData.secondLineAddress || ''}
                onChange={e => handleChange('secondLineAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
              <input
                type="text"
                value={formData.town || ''}
                onChange={e => handleChange('town', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
              <input
                type="text"
                value={formData.postCode || ''}
                onChange={e => handleChange('postCode', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress || ''}
                onChange={e => handleChange('emailAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Email</label>
              <input
                type="email"
                value={formData.accountsEmailAddress || ''}
                onChange={e => handleChange('accountsEmailAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNr || ''}
                onChange={e => handleChange('phoneNr', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={formData.mobileNr || ''}
                onChange={e => handleChange('mobileNr', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Due Date (days)</label>
              <input
                type="number"
                value={formData.invoiceDueDate || ''}
                onChange={e => handleChange('invoiceDueDate', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Reference</label>
              <input
                type="text"
                value={formData.customerBankRef || ''}
                onChange={e => handleChange('customerBankRef', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="selected"
                checked={formData.customerSelected || false}
                onChange={e => handleChange('customerSelected', e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="selected" className="text-sm font-medium text-gray-700">Customer Selected</label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between bg-white border rounded-lg p-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Jobs Section */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Jobs</h2>
            <Button onClick={() => router.push(`/dashboard/job/new?customerId=${customer.customerId}`)}>
              + New Job
            </Button>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No jobs yet for this customer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Job ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Site Address</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Contact Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Paid</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr key={`${job.id}-${idx}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">#{job.id}</td>
                        <td className="px-4 py-3 text-gray-900">{job.siteAddress || '—'}</td>
                        <td className="px-4 py-3 text-gray-900">{job.contactDate || '—'}</td>
                        <td className="px-4 py-3 text-gray-900">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ID: {job.jobStatusId}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{job.isPaid ? '✓ Yes' : '✗ No'}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/job/${job.id}`)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
