import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUiStore } from '../../store/uiStore';
import { Menu } from 'lucide-react';

export default function AppShell({ children }) {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-screen bg-bg-base relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute top-[-10%] left-[20%] floating-orb orb-blue opacity-30 animate-float-slow" />
      <div className="absolute bottom-[10%] right-[-10%] floating-orb orb-indigo opacity-30 animate-float-slow-reverse" />

      <Sidebar />

      <div
        className={`
          flex-1 flex flex-col relative z-10 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-16 lg:ml-60' : 'ml-16'}
        `}
      >
        <header className="h-16 bg-[#0D1220]/40 backdrop-blur-md border-b border-white/[0.06] flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
