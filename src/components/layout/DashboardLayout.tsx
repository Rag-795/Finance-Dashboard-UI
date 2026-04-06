/**
 * DashboardLayout — Wrapper combining Sidebar + Topbar + content area.
 * Uses React Router's <Outlet> for nested page rendering.
 * Redirects to login if not authenticated.
 */

import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useFinanceStore } from '../../store/useFinanceStore';

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/transactions': 'Transactions',
    '/dashboard/insights': 'Insights',
    '/dashboard/settings': 'Settings',
};

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || 'Dashboard';
    const { isAuthenticated, sidebarOpen, darkMode } = useFinanceStore();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Sync dark mode class on <html> whenever darkMode state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg transition-colors duration-300">
            <Sidebar />

            {/* Main content area — offset by sidebar width on desktop via CSS var */}
            <div
                className="dashboard-main transition-all duration-300 min-h-screen flex flex-col"
                style={{ '--sidebar-width': sidebarOpen ? '17rem' : '6rem' } as React.CSSProperties}
            >
                <div className="pt-4 px-4 lg:px-8 max-w-[1200px] w-full mx-auto">
                    <Topbar />
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8 max-w-[1200px] w-full mx-auto">
                    {/* Header Text */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-navy dark:text-light">
                            {pageTitle === 'Dashboard' ? 'Welcome back!' : pageTitle}
                        </h1>
                        {pageTitle === 'Dashboard' && (
                            <p className="text-sm text-navy/50 dark:text-light/50 mt-1">
                                Here's your financial overview for today.
                            </p>
                        )}
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
