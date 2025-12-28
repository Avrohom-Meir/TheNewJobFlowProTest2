'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@jobflow/shared/ui';

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

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unwrappedParams = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    const fetchJob = async () => {
      // For new job, don't fetch; initialize with customerId from query
      if (unwrappedParams.id === 'new') {
        const cid = searchParams.get('customerId');
        const initial: Partial<Job> = {};
        if (cid) initial.customerId = parseInt(cid);
        setFormData(initial);
        setJob(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/jobs/${unwrappedParams.id}`);
        if (!res.ok) throw new Error('Failed to fetch job');
        const data = await res.json();
        setJob(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [unwrappedParams.id, searchParams]);

  const handleChange = (field: keyof Job, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const isNew = unwrappedParams.id === 'new';
      const url = isNew ? '/api/jobs' : `/api/jobs/${unwrappedParams.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed to save job');
      }
      const updated = await res.json();
      console.log('Job saved, id:', updated.id);
      setJob(updated);
      setFormData(updated);
      if (isNew && updated.id) {
        router.replace(`/dashboard/job/${updated.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error('Save error:', message);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const isNew = unwrappedParams.id === 'new';
  if (isLoading) return <div className="py-8 text-center">Loading job details...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800"><p>{error}</p></div>;
  if (!job && !isNew) return <div className="py-8 text-center">Job not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{isNew ? 'New Job' : `Job #${formData.id}`}</h1>
        <Button variant="outline" onClick={() => router.back()}>← Back</Button>
      </div>

      <div className="space-y-6">
        {/* Site Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Site Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Address</label>
              <input
                type="text"
                value={formData.siteAddress || ''}
                onChange={e => handleChange('siteAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
              <input
                type="text"
                value={formData.sitePostCode || ''}
                onChange={e => handleChange('sitePostCode', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.siteCity || ''}
                onChange={e => handleChange('siteCity', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Point of Contact</label>
              <input
                type="text"
                value={formData.sitePointOfContact || ''}
                onChange={e => handleChange('sitePointOfContact', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={formData.pointOfContactNr || ''}
                onChange={e => handleChange('pointOfContactNr', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Is Occupied</label>
              <input
                type="checkbox"
                checked={formData.isOccupied || false}
                onChange={e => handleChange('isOccupied', e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Date</label>
              <input
                type="date"
                value={formData.contactDate || ''}
                onChange={e => handleChange('contactDate', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Started On</label>
              <input
                type="date"
                value={formData.workStartedOn || ''}
                onChange={e => handleChange('workStartedOn', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Completed On</label>
              <input
                type="date"
                value={formData.workCompletedOn || ''}
                onChange={e => handleChange('workCompletedOn', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type ID (FK)</label>
              <input
                type="number"
                value={formData.jobTypeId || ''}
                onChange={e => handleChange('jobTypeId', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Status ID (FK)</label>
              <input
                type="number"
                value={formData.jobStatusId || ''}
                onChange={e => handleChange('jobStatusId', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building Type ID (FK)</label>
              <input
                type="number"
                value={formData.buildingTypeId || ''}
                onChange={e => handleChange('buildingTypeId', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Ordered By</label>
              <input
                type="text"
                value={formData.jobOrderedBy || ''}
                onChange={e => handleChange('jobOrderedBy', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Under Address</label>
              <input
                type="text"
                value={formData.addUnderAddress || ''}
                onChange={e => handleChange('addUnderAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Notes</label>
              <textarea
                value={formData.officeNotes || ''}
                onChange={e => handleChange('officeNotes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surveyor Notes</label>
              <textarea
                value={formData.surveyorNotes || ''}
                onChange={e => handleChange('surveyorNotes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitter Notes</label>
              <textarea
                value={formData.fitterNotes || ''}
                onChange={e => handleChange('fitterNotes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Notes</label>
              <textarea
                value={formData.tenantNotes || ''}
                onChange={e => handleChange('tenantNotes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Notes</label>
              <textarea
                value={formData.siteNotes || ''}
                onChange={e => handleChange('siteNotes', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Access Instructions</label>
              <textarea
                value={formData.siteAccessInstructions || ''}
                onChange={e => handleChange('siteAccessInstructions', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Invoice Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={formData.invoiceNumber || ''}
                onChange={e => handleChange('invoiceNumber', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number Part</label>
              <input
                type="text"
                value={formData.invoiceNumberPart || ''}
                onChange={e => handleChange('invoiceNumberPart', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Address</label>
              <input
                type="text"
                value={formData.invoiceAddress || ''}
                onChange={e => handleChange('invoiceAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Added Text on Invoice Header</label>
              <input
                type="text"
                value={formData.addedTextOnInvoiceHeader || ''}
                onChange={e => handleChange('addedTextOnInvoiceHeader', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPaid || false}
                  onChange={e => handleChange('isPaid', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Is Paid</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.invoiceSent || false}
                  onChange={e => handleChange('invoiceSent', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Invoice Sent</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.taxFreeJob || false}
                  onChange={e => handleChange('taxFreeJob', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Tax Free Job</span>
              </label>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isCreditInvoice || false}
                  onChange={e => handleChange('isCreditInvoice', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Is Credit Invoice</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.invoiceToOwenerAndVerwaltung || false}
                  onChange={e => handleChange('invoiceToOwenerAndVerwaltung', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Invoice to Owner & Verwaltung</span>
              </label>
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Additional</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.jobSelected || false}
                onChange={e => handleChange('jobSelected', e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Job Selected</span>
            </label>
          </div>
          {formData.creditInvoiceForJobId && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Invoice For Job ID</label>
              <input
                type="number"
                value={formData.creditInvoiceForJobId || ''}
                onChange={e => handleChange('creditInvoiceForJobId', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between bg-white border rounded-lg p-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
