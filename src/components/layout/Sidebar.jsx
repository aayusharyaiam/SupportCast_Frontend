import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Video,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { signOut } from '../../services/supabase';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Sessions', roles: ['agent', 'admin'] },
  { to: '/dashboard/admin', icon: Shield, label: 'Admin', roles: ['admin'] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const role = localStorage.getItem('role');

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('socketToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        bg-primary-900
        flex flex-col
        transition-all duration-300
        z-40
        ${isSidebarOpen ? 'w-64' : 'w-16'}
      `}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-primary-500/30">
        {isSidebarOpen && (
          <span className="font-bold text-lg text-white tracking-tight">SupportCast</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 border-t border-primary-500/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}