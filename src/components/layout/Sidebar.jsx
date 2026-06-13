import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Video,
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { signOut } from '../../services/supabase';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Sessions', roles: ['agent', 'admin'] },
  { to: '/dashboard/admin', icon: Shield, label: 'Admin', roles: ['admin'] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const role = localStorage.getItem('role');

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('socketToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40
        flex flex-col
        transition-all duration-300 ease-in-out
        bg-[#0D1220]
        border-r border-white/[0.06]
        ${isSidebarOpen ? 'w-60' : 'w-16'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <Video className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">SupportCast</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5">
        <ul className="space-y-1 px-3">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-150 text-sm font-medium
                  ${isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}