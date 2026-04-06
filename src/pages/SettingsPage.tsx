/**
 * SettingsPage — Placeholder settings page
 */

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useFinanceStore } from '../store/useFinanceStore';
import { Shield, Eye, Moon, Sun, User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
    const { userRole, toggleRole, darkMode, toggleDarkMode, userName, userEmail } = useFinanceStore();

    const settingItems = [
        {
            icon: User,
            title: 'Profile',
            description: `Logged in as ${userName || 'User'} (${userEmail || 'N/A'})`,
            action: null,
        },
        {
            icon: userRole === 'Admin' ? Shield : Eye,
            title: 'User Role',
            description: `Current role: ${userRole}`,
            action: (
                <button
                    onClick={toggleRole}
                    className={`
            px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer
            transition-all duration-200
            ${userRole === 'Admin'
                            ? 'bg-lime/15 text-navy dark:text-lime hover:bg-lime/25'
                            : 'bg-info/10 text-info hover:bg-info/20'
                        }
          `}
                >
                    Switch to {userRole === 'Admin' ? 'Viewer' : 'Admin'}
                </button>
            ),
        },
        {
            icon: darkMode ? Moon : Sun,
            title: 'Appearance',
            description: `Currently using ${darkMode ? 'dark' : 'light'} theme`,
            action: (
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-navy/5 text-navy dark:bg-light/10 dark:text-light hover:bg-navy/10 dark:hover:bg-light/15 transition-all duration-200 cursor-pointer"
                >
                    Switch to {darkMode ? 'Light' : 'Dark'}
                </button>
            ),
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Manage your notification preferences',
            action: <Badge variant="neutral">Coming Soon</Badge>,
        },
        {
            icon: Palette,
            title: 'Customization',
            description: 'Customize your dashboard layout',
            action: <Badge variant="neutral">Coming Soon</Badge>,
        },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-lg font-bold text-navy dark:text-light">Settings</h2>
                <p className="text-sm text-navy/40 dark:text-light/40">
                    Manage your account and preferences
                </p>
            </div>

            <div className="space-y-3">
                {settingItems.map((item) => (
                    <Card key={item.title} padding="sm">
                        <div className="flex items-center gap-4 px-2 py-1">
                            <div className="w-10 h-10 rounded-xl bg-navy/5 dark:bg-light/5 flex items-center justify-center flex-shrink-0">
                                <item.icon size={20} className="text-navy/50 dark:text-light/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-navy dark:text-light">{item.title}</p>
                                <p className="text-xs text-navy/40 dark:text-light/40 truncate">{item.description}</p>
                            </div>
                            {item.action && <div className="flex-shrink-0">{item.action}</div>}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
