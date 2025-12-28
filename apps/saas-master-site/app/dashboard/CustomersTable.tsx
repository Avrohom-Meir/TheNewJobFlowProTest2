import { useEffect, useState } from 'react';
import { Button } from '@jobflow/shared/ui';

const columns = [
  { key: 'customerId', label: 'ID' },
  { key: 'customerFirstName', label: 'First Name' },
  { key: 'customerLastName', label: 'Last Name' },
  { key: 'companyName', label: 'Company' },
  { key: 'companyNumber', label: 'Company Number' },
  { key: 'firstLineAddress', label: 'Address 1' },
  { key: 'secondLineAddress', label: 'Address 2' },
  { key: 'postCode', label: 'Post Code' },
  { key: 'town', label: 'Town' },
  { key: 'emailAddress', label: 'Email' },
  { key: 'webSiteURL', label: 'Website' },
  { key: 'phoneNr', label: 'Phone' },
  { key: 'mobileNr', label: 'Mobile' },
  { key: 'customerSince', label: 'Since' },
  { key: 'title', label: 'Title' },
  { key: 'notes', label: 'Notes' },
  { key: 'accountsEmailAddress', label: 'Accounts Email' },
  { key: 'invoiceDueDate', label: 'Invoice Due' },
  { key: 'customerSelected', label: 'Selected' },
  { key: 'groupedUnder', label: 'Grouped Under' },
];

export default function CustomersTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('customerId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/customers')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch customers');
        return r.json();
      })
      .then((data) => {
        setCustomers(data.customers || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
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

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="true">Selected</option>
          <option value="false">Not Selected</option>
        </select>
        <Button onClick={() => {/* TODO: open create modal */}}>Add Customer</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-2 py-1 border-b cursor-pointer text-left"
                  onClick={() => setSortKey(col.key)}
                >
                  {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
              <th className="px-2 py-1 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.customerId}>
                {columns.map(col => (
                  <td key={col.key} className="px-2 py-1 border-b">
                    {col.key === 'customerSelected' 
                      ? (c[col.key] ? '✓' : '✗')
                      : c[col.key]}
                  </td>
                ))}
                <td className="px-2 py-1 border-b space-x-2">
                  <Button size="sm" onClick={() => {/* TODO: open edit modal */}}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c.customerId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
