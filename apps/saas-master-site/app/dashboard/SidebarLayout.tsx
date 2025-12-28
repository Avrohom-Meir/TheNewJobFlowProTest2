"use client";

import { ReactNode, useState } from 'react';
import { Button } from '@jobflow/shared/ui';


import CustomersTable from './CustomersTable';
import TenantSelector from './TenantSelector';

interface SidebarProps {
  children?: ReactNode;
}

export function SidebarLayout({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<'Customers' | 'Jobs' | 'Settings'>('Customers');
  return (
    <div className="flex min-h-screen flex-col">
      <TenantSelector />
      <div className="flex flex-1">
      <aside className={`bg-white shadow-md transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'} flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <span className={`font-bold text-lg transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>JobFlow</span>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? '»' : '«'}
          </Button>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActive('Customers')} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-50 ${active === 'Customers' ? 'bg-blue-100 font-semibold' : ''}`}>Customers</button>
            </li>
            <li>
              <button onClick={() => setActive('Jobs')} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-50 ${active === 'Jobs' ? 'bg-blue-100 font-semibold' : ''}`}>Jobs</button>
            </li>
            <li>
              <button onClick={() => setActive('Settings')} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-50 ${active === 'Settings' ? 'bg-blue-100 font-semibold' : ''}`}>Settings</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">
        {active === 'Customers' ? <CustomersTable /> : children}
      </main>
    </div>
    </div>
  );
}
