/**
 * Topbar — Sticky top navigation bar
 * Contains: Hamburger (mobile), page title, search, role switcher, dark mode toggle.
 */

// useLocation added back
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFinanceStore } from '../../store/useFinanceStore';
import {
    Menu,
    Sun,
    Moon,
    Shield,
    Eye,
    Wallet,
} from 'lucide-react';

export default function Topbar() {
    const location = useLocation();
    const { darkMode, toggleDarkMode, userRole, toggleRole, toggleSidebar, hasSeenRoleTooltip, dismissRoleTooltip, resetRoleTooltip } = useFinanceStore();

    useEffect(() => {
        if (location.pathname === '/dashboard') {
            resetRoleTooltip();
        } else {
            dismissRoleTooltip();
        }
    }, [location.pathname, resetRoleTooltip, dismissRoleTooltip]);

    const isDashboard = location.pathname === '/dashboard';

    return (
        <header
            className={`
        sticky top-4 z-20
        h-14 flex items-center justify-between
        px-4 lg:px-6
        bg-white/90 dark:bg-dark-card/90
        backdrop-blur-xl
        border border-gray-soft dark:border-dark-border
        shadow-sm rounded-full
        transition-all duration-300
      `}
        >
            {/* Left side: hamburger + title */}
            <div className="flex items-center gap-4">
                {/* Mobile hamburger */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-xl text-navy/60 hover:bg-navy/5 dark:text-light/60 dark:hover:bg-light/5 transition-colors cursor-pointer"
                >
                    <Menu size={22} />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-lime flex items-center justify-center flex-shrink-0">
                        <Wallet size={18} className="text-navy sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-lg font-bold text-navy dark:text-light tracking-tight hidden sm:block">
                        Zorvyn
                    </span>
                </div>
            </div>

            {/* Right side: controls */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Role Switcher */}
                <div className="relative">
                    <button
                        onClick={toggleRole}
                        className={`
            flex items-center gap-2
            px-3 py-2 rounded-xl
            text-xs sm:text-sm font-semibold
            transition-all duration-200 cursor-pointer
            ${userRole === 'Admin'
                                ? 'bg-lime/15 text-navy dark:text-lime'
                                : 'bg-info/10 text-info'
                            }
          `}
                        title={`Switch to ${userRole === 'Admin' ? 'Viewer' : 'Admin'}`}
                    >
                        {userRole === 'Admin' ? <Shield size={16} /> : <Eye size={16} />}
                        <span className="hidden sm:inline">{userRole}</span>
                    </button>

                    {!hasSeenRoleTooltip && isDashboard && (
                        <div className="absolute top-12 right-0 w-64 p-3 bg-navy dark:bg-light rounded-xl shadow-xl shadow-navy/20 dark:shadow-black/20 animate-slide-up z-50">
                            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-navy dark:bg-light rotate-45" />
                            <div className="relative z-10 flex flex-col gap-2">
                                <p className="text-xs text-light dark:text-navy font-medium leading-relaxed">
                                    Click here to toggle between <strong className="text-lime dark:text-navy font-bold">Admin</strong> and <strong className="text-info dark:text-navy font-bold">Viewer</strong> mode to see role-based features.
                                </p>
                                <button
                                    onClick={dismissRoleTooltip}
                                    className="self-end text-xs text-lime dark:text-navy/70 font-semibold hover:opacity-80 transition-opacity mt-1 cursor-pointer"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-xl text-navy/60 hover:bg-navy/5 dark:text-light/60 dark:hover:bg-light/5 transition-colors cursor-pointer"
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
