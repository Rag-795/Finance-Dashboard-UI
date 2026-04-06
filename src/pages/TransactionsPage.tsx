/**
 * TransactionsPage — Searchable, filterable transaction list
 * Role-based: Admin can add/edit/delete; Viewer sees read-only badge.
 * Includes empty state and CSV export.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinanceStore, type Transaction, type TransactionCategory, type TransactionType } from '../store/useFinanceStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Download,
    Filter,
    FileX2,
    Eye,
} from 'lucide-react';
import gsap from 'gsap';

const categories: TransactionCategory[] = ['Food', 'Rent', 'Salary', 'Entertainment', 'Tech', 'Transport', 'Health'];
const types: TransactionType[] = ['income', 'expense'];

export default function TransactionsPage() {
    const {
        transactions,
        filters,
        setFilters,
        userRole,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    } = useFinanceStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food' as TransactionCategory,
        type: 'expense' as TransactionType,
        date: new Date().toISOString().split('T')[0],
    });

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            const matchSearch =
                filters.search === '' ||
                t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.category.toLowerCase().includes(filters.search.toLowerCase());
            const matchCategory = filters.category === 'All' || t.category === filters.category;
            const matchType = filters.type === 'All' || t.type === filters.type;
            return matchSearch && matchCategory && matchType;
        });
    }, [transactions, filters]);

    // Safe GSAP animation for table rows — must be after filteredTransactions declaration
    useEffect(() => {
        if (!tableRef.current) return;

        const rows = tableRef.current.querySelectorAll('.table-row');
        gsap.set(rows, { x: -20, opacity: 0 });
        gsap.to(rows, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.out',
        });
    }, [filteredTransactions]);

    // Open modal for add/edit
    const openAddModal = () => {
        setEditingTransaction(null);
        setFormData({
            description: '',
            amount: '',
            category: 'Food',
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (t: Transaction) => {
        setEditingTransaction(t);
        setFormData({
            description: t.description,
            amount: String(t.amount),
            category: t.category,
            type: t.type,
            date: t.date,
        });
        setIsModalOpen(true);
    };

    // Submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);
        if (!formData.description || isNaN(amount) || amount <= 0) return;

        if (editingTransaction) {
            updateTransaction(editingTransaction.id, {
                ...formData,
                amount,
            });
        } else {
            addTransaction({
                ...formData,
                amount,
            });
        }
        setIsModalOpen(false);
    };

    // Export to CSV
    const handleExportCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const rows = filteredTransactions.map((t) => [
            t.date,
            t.description,
            t.category,
            t.type,
            t.amount.toString(),
        ]);

        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const isAdmin = userRole === 'Admin';

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-navy dark:text-light">All Transactions</h2>
                    <p className="text-sm text-navy/40 dark:text-light/40">
                        {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {!isAdmin && (
                        <Badge variant="info">
                            <Eye size={12} className="mr-1" />
                            Read Only
                        </Badge>
                    )}

                    <Button variant="outline" size="sm" onClick={handleExportCSV} icon={<Download size={16} />}>
                        Export CSV
                    </Button>

                    {isAdmin && (
                        <Button size="sm" onClick={openAddModal} icon={<Plus size={16} />}>
                            Add Transaction
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card padding="sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            placeholder="Search transactions..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            icon={<Search size={16} />}
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* Category filter */}
                        <div className="relative">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ category: e.target.value as any })}
                                className="appearance-none bg-white dark:bg-dark-card border border-gray-soft dark:border-dark-border rounded-xl px-4 py-2.5 pr-8 text-sm text-navy dark:text-light focus:outline-none focus:ring-2 focus:ring-lime/50 cursor-pointer"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/30 dark:text-light/30 pointer-events-none" />
                        </div>

                        {/* Type filter */}
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ type: e.target.value as any })}
                            className="appearance-none bg-white dark:bg-dark-card border border-gray-soft dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-navy dark:text-light focus:outline-none focus:ring-2 focus:ring-lime/50 cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Transactions Table */}
            <div ref={tableRef}>
                <Card padding="sm" className="overflow-hidden">
                    {filteredTransactions.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-navy/5 dark:bg-light/5 flex items-center justify-center mb-4">
                                <FileX2 size={28} className="text-navy/20 dark:text-light/20" />
                            </div>
                            <h3 className="text-base font-semibold text-navy/60 dark:text-light/60 mb-1">
                                No transactions found
                            </h3>
                            <p className="text-sm text-navy/30 dark:text-light/30 max-w-xs">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-soft dark:border-dark-border">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-navy/40 dark:text-light/40 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-navy/40 dark:text-light/40 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-navy/40 dark:text-light/40 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-navy/40 dark:text-light/40 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        {isAdmin && (
                                            <th className="text-right px-4 py-3 text-xs font-semibold text-navy/40 dark:text-light/40 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="table-row border-b border-gray-soft/50 dark:border-dark-border/50 last:border-0 hover:bg-navy/[0.02] dark:hover:bg-light/[0.02] transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-sm text-navy/60 dark:text-light/60 whitespace-nowrap">
                                                {new Date(t.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div>
                                                    <span className="text-sm font-medium text-navy dark:text-light">
                                                        {t.description}
                                                    </span>
                                                    <span className="block text-xs text-navy/40 dark:text-light/40 mt-0.5">
                                                        {t.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                                                    {t.type === 'income' ? 'Income' : 'Expense'}
                                                </Badge>
                                            </td>
                                            <td
                                                className={`px-4 py-3.5 text-right text-sm font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-income' : 'text-expense'
                                                    }`}
                                            >
                                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                            </td>
                                            {isAdmin && (
                                                <td className="px-4 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openEditModal(t)}
                                                            className="p-1.5 rounded-lg text-navy/30 hover:text-info hover:bg-info/10 dark:text-light/30 dark:hover:text-info transition-colors cursor-pointer"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteTransaction(t.id)}
                                                            className="p-1.5 rounded-lg text-navy/30 hover:text-expense hover:bg-expense/10 dark:text-light/30 dark:hover:text-expense transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Add/Edit Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Description"
                        placeholder="e.g., Grocery Shopping"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <Input
                        label="Amount ($)"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />

                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-navy/70 dark:text-light/70">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value as TransactionCategory })
                                }
                                className="bg-white dark:bg-dark-card border border-gray-soft dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-navy dark:text-light focus:outline-none focus:ring-2 focus:ring-lime/50"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-navy/70 dark:text-light/70">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value as TransactionType })
                                }
                                className="bg-white dark:bg-dark-card border border-gray-soft dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-navy dark:text-light focus:outline-none focus:ring-2 focus:ring-lime/50"
                            >
                                {types.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
