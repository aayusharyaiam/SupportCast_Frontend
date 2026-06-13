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
        {isSidebarOpen ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center animate-float-slow">
              <Video className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">SupportCast</span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mx-auto">
            <Video className="w-3.5 h-3.5 text-blue-400" />
          </div>
        )}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all transform hover:rotate-180 duration-300"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5">
        <ul className="space-y-1.5 px-3">
          {filteredNavItems.map((item) => (
            <li key={item.to} className="relative group">
              <NavLink
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl relative
                  transition-all duration-200 text-sm font-medium
                  ${isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} style={{ width: 18, height: 18 }} />
                    {isSidebarOpen && <span className="animate-fade-in">{item.label}</span>}
                    {isActive && !isSidebarOpen && (
                      <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 status-ripple" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle when collapsed footer */}
      {!isSidebarOpen && (
        <div className="flex justify-center py-4 border-t border-white/[0.06]">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all text-sm font-medium group"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" style={{ width: 18, height: 18 }} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}