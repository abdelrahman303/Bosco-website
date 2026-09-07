import { Outlet } from 'react-router-dom';

import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from '../components/Sidebar';
import AdminFooter from '../components/AdminFooter';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0a0a0a] text-bosco-gray dark:text-gray-200 transition-colors">
      
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Admin Header */}
        <header className="h-16 bg-white dark:bg-bosco-card border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-bosco-red">
            <FiMenu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Admin Panel</span>
            <div className="w-8 h-8 rounded-full bg-bosco-red text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-bosco-dark p-6">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}