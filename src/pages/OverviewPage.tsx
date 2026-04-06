/**
 * OverviewPage — Main dashboard view
 * Summary Cards + AreaChart (Balance Trends) + PieChart (Spending by Category)
 * Uses CSS animations instead of GSAP for reliability.
 */

import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

// Chart colors matching brand palette
const CHART_COLORS = ['#bdf75c', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export default function OverviewPage() {
    const { transactions } = useFinanceStore();

    // ==========================================
    // Computed data from transactions
    // ==========================================
    const stats = useMemo(() => {
        const currentMonth = '2026-04';
        const prevMonth = '2026-03';

        const currentTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));
        const prevTransactions = transactions.filter((t) => t.date.startsWith(prevMonth));

        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyIncome = currentTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = currentTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const prevMonthlyExpenses = prevTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseChange = prevMonthlyExpenses > 0
            ? (((monthlyExpenses - prevMonthlyExpenses) / prevMonthlyExpenses) * 100).toFixed(1)
            : '0';

        return {
            totalBalance: totalIncome - totalExpenses,
            monthlyIncome,
            monthlyExpenses,
            expenseChangePercent: Number(expenseChange),
        };
    }, [transactions]);

    // Build area chart data — running balance over time
    const areaChartData = useMemo(() => {
        const sorted = [...transactions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let running = 0;
        return sorted.map((t) => {
            running += t.type === 'income' ? t.amount : -t.amount;
            return {
                date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance: running,
            };
        });
    }, [transactions]);

    // Build pie chart data — spending by category
    const pieChartData = useMemo(() => {
        const categoryMap: Record<string, number> = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // Custom tooltip for area chart
    const CustomAreaTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="text-xs font-medium text-navy/50 dark:text-light/50">{label}</p>
                    <p className="text-sm font-bold text-navy dark:text-light">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for pie chart
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="text-xs font-medium text-navy/50 dark:text-light/50">{payload[0].name}</p>
                    <p className="text-sm font-bold text-navy dark:text-light">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Summary card data
    const summaryCards = [
        {
            title: 'Total Balance',
            value: `₹${stats.totalBalance.toLocaleString()}`,
            icon: Wallet,
            iconBg: 'bg-lime/15',
            iconColor: 'text-lime-dark',
            badge: null,
        },
        {
            title: 'Monthly Income',
            value: `₹${stats.monthlyIncome.toLocaleString()}`,
            icon: TrendingUp,
            iconBg: 'bg-income/10',
            iconColor: 'text-income',
            badge: { label: '+₹' + stats.monthlyIncome.toLocaleString(), variant: 'income' as const },
        },
        {
            title: 'Monthly Expenses',
            value: `₹${stats.monthlyExpenses.toLocaleString()}`,
            icon: TrendingDown,
            iconBg: 'bg-expense/10',
            iconColor: 'text-expense',
            badge: {
                label: `${stats.expenseChangePercent > 0 ? '+' : ''}${stats.expenseChangePercent}%`,
                variant: stats.expenseChangePercent > 0 ? 'expense' as const : 'income' as const,
            },
        },
    ];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {summaryCards.map((card, index) => (
                    <Card
                        key={card.title}
                        hover
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' } as React.CSSProperties}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                                <card.icon size={20} className={card.iconColor} />
                            </div>
                            {card.badge && (
                                <Badge variant={card.badge.variant}>
                                    {card.badge.variant === 'income' ? (
                                        <ArrowUpRight size={12} className="mr-1" />
                                    ) : (
                                        <ArrowDownRight size={12} className="mr-1" />
                                    )}
                                    {card.badge.label}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-navy/50 dark:text-light/50 font-medium">{card.title}</p>
                        <p className="text-2xl font-bold text-navy dark:text-light mt-1">{card.value}</p>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                {/* Area Chart — Balance Trends (wider) */}
                <Card
                    className="lg:col-span-3 animate-slide-up"
                    style={{ animationDelay: '300ms', animationFillMode: 'both' } as React.CSSProperties}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-navy dark:text-light">Balance Trends</h3>
                            <p className="text-xs text-navy/40 dark:text-light/40 mt-0.5">
                                Running balance over time
                            </p>
                        </div>
                        <Badge variant="lime">Live</Badge>
                    </div>

                    <div style={{ width: '100%', height: 288 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={areaChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#bdf75c" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#bdf75c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                                />
                                <Tooltip content={<CustomAreaTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#bdf75c"
                                    strokeWidth={2.5}
                                    fill="url(#balanceGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Pie Chart — Spending by Category */}
                <Card
                    className="lg:col-span-2 animate-slide-up"
                    style={{ animationDelay: '450ms', animationFillMode: 'both' } as React.CSSProperties}
                >
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-navy dark:text-light">Spending by Category</h3>
                        <p className="text-xs text-navy/40 dark:text-light/40 mt-0.5">
                            Expense distribution
                        </p>
                    </div>

                    <div style={{ width: '100%', height: 288 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieChartData.map((_, index) => (
                                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value: string) => (
                                        <span className="text-xs text-navy/60 dark:text-light/60">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
