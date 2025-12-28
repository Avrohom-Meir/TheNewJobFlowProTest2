'use client';

import { useState, useEffect } from 'react';
import { Button } from '@jobflow/shared/ui';

interface Customer {
  customerId?: number;
  customerFirstName?: string;
  customerLastName?: string;
  companyName?: string;
  companyNumber?: string;
  firstLineAddress?: string;
  secondLineAddress?: string;
  postCode?: string;
  town?: string;
  emailAddress?: string;
  webSiteURL?: string;
  phoneNr?: string;
  mobileNr?: string;
  customerSince?: string;
  title?: number;
  notes?: string;
  accountsEmailAddress?: string;
  invoiceDueDate?: number;
  customerSelected?: boolean;
  customerBankRef?: string;
  groupedUnder?: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
}

export default function CustomerModal({ isOpen, onClose, customer, onSave }: CustomerModalProps) {
  const [formData, setFormData] = useState<Customer>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData({});
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? (value ? parseInt(value) : undefined)
          : value || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = customer?.customerId ? 'PUT' : 'POST';
      const url = customer?.customerId 
        ? `/api/customers/${customer.customerId}` 
        : '/api/customers';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save customer');
      }

      const data = await response.json();
      onSave(data.customer);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {customer?.customerId ? 'Edit Customer' : 'Add New Customer'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="customerFirstName"
                value={formData.customerFirstName || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="customerLastName"
                value={formData.customerLastName || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="number"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Title ID from HelperT"
              />
            </div>

            {/* Company Information */}
            <div className="col-span-2 mt-4">
              <h3 className="font-semibold text-lg mb-2">Company Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Number</label>
              <input
                type="text"
                name="companyNumber"
                value={formData.companyNumber || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Address Information */}
            <div className="col-span-2 mt-4">
              <h3 className="font-semibold text-lg mb-2">Address</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">First Line Address</label>
              <input
                type="text"
                name="firstLineAddress"
                value={formData.firstLineAddress || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Second Line Address</label>
              <input
                type="text"
                name="secondLineAddress"
                value={formData.secondLineAddress || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Post Code</label>
              <input
                type="text"
                name="postCode"
                value={formData.postCode || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Town</label>
              <input
                type="text"
                name="town"
                value={formData.town || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Contact Information */}
            <div className="col-span-2 mt-4">
              <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Accounts Email</label>
              <input
                type="email"
                name="accountsEmailAddress"
                value={formData.accountsEmailAddress || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNr"
                value={formData.phoneNr || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobileNr"
                value={formData.mobileNr || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="url"
                name="webSiteURL"
                value={formData.webSiteURL || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Additional Information */}
            <div className="col-span-2 mt-4">
              <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Since</label>
              <input
                type="date"
                name="customerSince"
                value={formData.customerSince || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Invoice Due Date (days)</label>
              <input
                type="number"
                name="invoiceDueDate"
                value={formData.invoiceDueDate || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Bank Ref</label>
              <input
                type="text"
                name="customerBankRef"
                value={formData.customerBankRef || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grouped Under</label>
              <input
                type="text"
                name="groupedUnder"
                value={formData.groupedUnder || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="customerSelected"
                checked={formData.customerSelected || false}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Customer Selected</label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
