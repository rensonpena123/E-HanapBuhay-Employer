import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import Logo from './logo.jsx';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileSearch, 
  Shield, 
  LineChart, 
  Settings,
  UserCircle 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); 

  const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Vacancy Management', path: '/jobVacancy', icon: Briefcase },
  { name: 'Application Management', path: '/applicationManagement', icon: FileSearch },
  { name: 'Reports and Insights', path: '/reports', icon: LineChart },
  { name: 'Compliance', path: '/compliance', icon: Shield }
];

  return (
    <aside className="w-[260px] h-screen bg-brand-dark flex flex-col shrink-0">
      
    {/* Logo Section */} 
      <div className="h-20 flex items-center justify-center border-b-2 border-brand-yellow/80">
        <Logo variant="sidebar" />
      </div>
    
      {/* Navigation Links */}
      <nav className="flex-1 py-6 flex flex-col gap-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                isActive 
                  ? 'bg-[#2b3a55] border-l-10 border-brand-yellow text-brand-yellow' 
                  : 'border-l-10 border-transparent text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-brand-yellow' : 'text-white'} />
              <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-light'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
};

export default Sidebar;