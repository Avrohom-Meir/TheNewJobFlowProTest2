import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@jobflow/shared/ui';
import CustomerModal from './CustomerModal';

const columns = [
  { key: 'customerId', label: 'ID' },
  { key: 'customerFirstName', label: 'First Name' },
  { key: 'customerLastName', label: 'Last Name' },
  { key: 'companyName', label: 'Company' },
  { key: 'emailAddress', label: 'Email' },
  { key: 'phoneNr', label: 'Phone' },
  { key: 'town', label: 'Town' },
];

export default function CustomersTable() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('customerId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = () => {
    setLoading(true);
    setError(null);
    fetch('/api/customers')
      .then((r) => {
        if (!r.ok) {
          // If it's a 400 (tenant not found), that's expected on initial load
          if (r.status === 400) {
            setCustomers([]);
            return { customers: [] };
          }
          throw new Error('Failed to fetch customers');
        }
        return r.json();
      })
      .then((data) => {
        setCustomers(data.customers || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setCustomers([]);
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers
    .filter((c: any) =>
      Object.values(c).some((v) => v && v.toString().toLowerCase().includes(search.toLowerCase()))
    )
    .filter((c: any) => (filter ? c.customerSelected === (filter === 'true') : true))
    .sort((a: any, b: any) => {
      if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete customer');
      setCustomers(customers.filter((c: any) => c.customerId !== id));
    } catch (err) {
      alert('Failed to delete customer');
      console.error(err);
    }
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleSave = (customer: any) => {
    // Refresh the customers list after save
    fetchCustomers();
  };

  if (loading) return <div className="text-center py-8">Loading customers...</div>;

  return (
    <div className="space-y-4">
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSave={handleSave}
      />
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="border rounded px-3 py-2 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="true">Selected</option>
            <option value="false">Not Selected</option>
          </select>
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">+ Add Customer</Button>
      </div>

      {customers.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No customers yet</p>
          <Button onClick={handleAdd}>Create First Customer</Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (sortKey === col.key) {
                          setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortKey(col.key);
                          setSortDir('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        {sortKey === col.key && (
                          <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => (
                  <tr key={c.customerId} className="border-b hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-gray-900">
                        {col.key === 'customerSelected' 
                          ? (c[col.key] ? '✓' : '✗')
                          : c[col.key] || '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/customer/${c.customerId}`)}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(c.customerId)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
