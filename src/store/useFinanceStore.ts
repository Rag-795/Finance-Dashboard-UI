/**
 * Zustand Store — useFinanceStore
 * Central state management for the Finance Dashboard.
 * Contains: transactions, user role, filters, dark mode, sidebar state.
 */

import { create } from 'zustand';

// ==========================================
// Types
// ==========================================
export type TransactionCategory = 'Food' | 'Rent' | 'Salary' | 'Entertainment' | 'Tech' | 'Transport' | 'Health';
export type TransactionType = 'income' | 'expense';
export type UserRole = 'Admin' | 'Viewer';

export interface Transaction {
    id: string;
    date: string;           // ISO date string
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
}

export interface Filters {
    search: string;
    category: TransactionCategory | 'All';
    type: TransactionType | 'All';
}

interface FinanceState {
    // Data
    transactions: Transaction[];
    // Auth / Role
    userRole: UserRole;
    isAuthenticated: boolean;
    userName: string;
    userEmail: string;
    // UI State
    darkMode: boolean;
    sidebarOpen: boolean;
    filters: Filters;
    hasSeenRoleTooltip: boolean;
    // Actions
    toggleRole: () => void;
    dismissRoleTooltip: () => void;
    resetRoleTooltip: () => void;
    setRole: (role: UserRole) => void;
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setFilters: (filters: Partial<Filters>) => void;
    resetFilters: () => void;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    login: (name: string, email: string) => void;
    logout: () => void;
}

// ==========================================
// Mock Data — 18 realistic transactions
// ==========================================
const mockTransactions: Transaction[] = [
    { id: '1', date: '2026-04-01', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: '2', date: '2026-04-02', description: 'Apartment Rent', amount: 1500, category: 'Rent', type: 'expense' },
    { id: '3', date: '2026-04-03', description: 'Grocery Shopping', amount: 85, category: 'Food', type: 'expense' },
    { id: '4', date: '2026-04-04', description: 'Netflix Subscription', amount: 15, category: 'Entertainment', type: 'expense' },
    { id: '5', date: '2026-04-05', description: 'Freelance Project', amount: 1200, category: 'Salary', type: 'income' },
    { id: '6', date: '2026-04-06', description: 'MacBook Pro Payment', amount: 250, category: 'Tech', type: 'expense' },
    { id: '7', date: '2026-04-07', description: 'Uber Rides', amount: 45, category: 'Transport', type: 'expense' },
    { id: '8', date: '2026-04-08', description: 'Restaurant Dinner', amount: 65, category: 'Food', type: 'expense' },
    { id: '9', date: '2026-04-09', description: 'Gym Membership', amount: 50, category: 'Health', type: 'expense' },
    { id: '10', date: '2026-04-10', description: 'Stock Dividend', amount: 320, category: 'Salary', type: 'income' },
    { id: '11', date: '2026-03-01', description: 'March Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: '12', date: '2026-03-03', description: 'Rent Payment', amount: 1500, category: 'Rent', type: 'expense' },
    { id: '13', date: '2026-03-05', description: 'Weekly Groceries', amount: 110, category: 'Food', type: 'expense' },
    { id: '14', date: '2026-03-08', description: 'Concert Tickets', amount: 120, category: 'Entertainment', type: 'expense' },
    { id: '15', date: '2026-03-12', description: 'New Keyboard', amount: 180, category: 'Tech', type: 'expense' },
    { id: '16', date: '2026-03-15', description: 'Side Gig Income', amount: 800, category: 'Salary', type: 'income' },
    { id: '17', date: '2026-03-20', description: 'Doctor Visit', amount: 200, category: 'Health', type: 'expense' },
    { id: '18', date: '2026-03-25', description: 'Bus Pass', amount: 75, category: 'Transport', type: 'expense' },
];

// ==========================================
// Default filter state
// ==========================================
const defaultFilters: Filters = {
    search: '',
    category: 'All',
    type: 'All',
};

// ==========================================
// Store
// ==========================================
export const useFinanceStore = create<FinanceState>((set) => ({
    // Initial state
    transactions: mockTransactions,
    userRole: 'Admin',
    isAuthenticated: localStorage.getItem('zorvyn_auth') === 'true',
    userName: localStorage.getItem('zorvyn_user') || '',
    userEmail: localStorage.getItem('zorvyn_email') || '',
    darkMode: localStorage.getItem('zorvyn_dark') ? localStorage.getItem('zorvyn_dark') === 'true' : true,
    sidebarOpen: true,
    filters: defaultFilters,
    hasSeenRoleTooltip: false,

    // Role management
    toggleRole: () => set((state) => {
        localStorage.setItem('zorvyn_role_tooltip', 'true');
        return {
            userRole: state.userRole === 'Admin' ? 'Viewer' : 'Admin',
            hasSeenRoleTooltip: true,
        };
    }),
    dismissRoleTooltip: () => {
        set({ hasSeenRoleTooltip: true });
    },
    resetRoleTooltip: () => set({ hasSeenRoleTooltip: false }),
    setRole: (role) => set({ userRole: role }),

    // Theme
    toggleDarkMode: () => set((state) => {
        const next = !state.darkMode;
        localStorage.setItem('zorvyn_dark', String(next));
        // Toggle dark class on <html> element
        if (next) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return { darkMode: next };
    }),

    // Sidebar
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Filters
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
    })),
    resetFilters: () => set({ filters: defaultFilters }),

    // CRUD Transactions
    addTransaction: (transaction) => set((state) => ({
        transactions: [
            { ...transaction, id: String(Date.now()) },
            ...state.transactions,
        ],
    })),

    updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
        ),
    })),

    deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
    })),

    // Auth
    login: (name, email) => {
        localStorage.setItem('zorvyn_auth', 'true');
        localStorage.setItem('zorvyn_user', name);
        localStorage.setItem('zorvyn_email', email);
        set({ isAuthenticated: true, userName: name, userEmail: email });
    },

    logout: () => {
        localStorage.removeItem('zorvyn_auth');
        localStorage.removeItem('zorvyn_user');
        localStorage.removeItem('zorvyn_email');
        set({ isAuthenticated: false, userName: '', userEmail: '' });
    },
}));
