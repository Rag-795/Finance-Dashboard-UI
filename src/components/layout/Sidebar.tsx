/**
 * Sidebar — Fixed left navigation panel
 * Nav items: Dashboard, Transactions, Insights, Settings
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../../store/useFinanceStore';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Lightbulb,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/dashboard/transactions', icon: ArrowLeftRight },
    { label: 'Insights', path: '/dashboard/insights', icon: Lightbulb },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sidebarOpen, toggleSidebar, userName, userEmail, logout } = useFinanceStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
          fixed top-1/2 -translate-y-1/2 left-4 h-auto max-h-[80vh] z-50
          bg-white dark:bg-dark-card
          border border-gray-soft dark:border-dark-border rounded-2xl
          shadow-sidebar
          flex flex-col
          transition-all duration-300 ease-out
          ${sidebarOpen ? 'w-[16rem]' : 'w-20'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)] lg:translate-x-0'}
        `}
            >


                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            item.path === '/dashboard'
                                ? location.pathname === '/dashboard'
                                : location.pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    // Close sidebar on mobile after navigation
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={`
                  w-full flex items-center gap-3
                  px-3 py-2.5 rounded-xl
                  text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${isActive
                                        ? 'bg-lime/15 text-navy dark:text-lime'
                                        : 'text-navy/60 dark:text-light/50 hover:bg-navy/5 dark:hover:bg-light/5 hover:text-navy dark:hover:text-light'
                                    }
                `}
                            >
                                <item.icon size={20} className={isActive ? 'text-lime-dark dark:text-lime' : ''} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Collapse toggle (desktop only) */}
                <div className="hidden lg:flex justify-end px-3 py-2">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 dark:text-light/40 dark:hover:text-light dark:hover:bg-light/5 transition-colors cursor-pointer"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                {/* User profile section */}
                <div className="border-t border-gray-soft dark:border-dark-border px-3 py-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-navy/10 dark:bg-light/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-navy dark:text-light">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-navy dark:text-light truncate">
                                    {userName || 'User'}
                                </p>
                                <p className="text-xs text-navy/40 dark:text-light/40 truncate">
                                    {userEmail || 'user@email.com'}
                                </p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg text-navy/30 hover:text-expense hover:bg-expense/10 dark:text-light/30 dark:hover:text-expense transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
