import { Link, useLocation } from 'react-router-dom';
import { FiBox, FiUsers, FiSettings, FiGrid, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminSidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: <FiGrid />, path: '/admin' },
    { title: 'Products', icon: <FiBox />, path: '/admin/products' },
    { title: 'Quotes', icon: <FiMessageSquare />, path: '/admin/quotes' },
    { title: 'Customers', icon: <FiUsers />, path: '/admin/customers' },
    { title: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? '260px' : '0px' }}
      className="bg-bosco-gray dark:bg-bosco-card text-white overflow-hidden flex flex-col h-full z-20 border-r border-gray-800"
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-700/50 min-w-[260px]">
        <span className="text-xl font-bold text-white">Bosco <span className="text-bosco-red">Admin</span></span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 min-w-[260px]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.title} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-bosco-red text-white shadow-lg shadow-bosco-red/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}