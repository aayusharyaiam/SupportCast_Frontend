import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../ui/Toast';
import { useUiStore } from '../../store/uiStore';
import { Menu } from 'lucide-react';

export default function AppShell({ children }) {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-screen bg-bg-base">
      <Sidebar />

      <div
        className={`
          flex-1 flex flex-col
          transition-all duration-300
          ${isSidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <header className="h-16 bg-bg-surface border-b border-bg-elevated flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}