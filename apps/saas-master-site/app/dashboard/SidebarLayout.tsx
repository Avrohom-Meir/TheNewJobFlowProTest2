import { ReactNode, useState } from 'react';
import { Button } from '@jobflow/shared/ui';

interface SidebarProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
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
              <a href="#" className="block px-4 py-2 rounded hover:bg-blue-50">Customers</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-blue-50">Jobs</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-blue-50">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
