/**
 * InsightsPage — Analytics section with calculated insights
 * - Highest Spending Category
 * - Monthly Comparison
 * - Savings Progress (circular bar)
 */

import { useEffect, useRef, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CircularProgress from '../components/ui/CircularProgress';
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Crown,
    ArrowDownRight,
    ArrowUpRight,
    Target,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import gsap from 'gsap';

const CHART_COLORS = ['#bdf75c', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export default function InsightsPage() {
    const { transactions } = useFinanceStore();
    const pageRef = useRef<HTMLDivElement>(null);

    // Safe GSAP animation — only animate the top 3 stat cards, NOT the chart card
    useEffect(() => {
        if (!pageRef.current) return;

        const cards = pageRef.current.querySelectorAll('.insight-stat');
        gsap.set(cards, { y: 30, opacity: 0 });
        gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power3.out',
        });
    }, []);

    // ==========================================
    // Computed insights
    // ==========================================
    const insights = useMemo(() => {
        const currentMonth = '2026-04';
        const prevMonth = '2026-03';

        // Current month expenses by category
        const currentExpenses = transactions.filter(
            (t) => t.date.startsWith(currentMonth) && t.type === 'expense'
        );
        const prevExpenses = transactions.filter(
            (t) => t.date.startsWith(prevMonth) && t.type === 'expense'
        );

        // All expenses by category
        const categoryTotals: Record<string, number> = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            });

        // Highest spending category
        const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        const highestCategory = sortedCategories.length > 0
            ? { name: sortedCategories[0][0], amount: sortedCategories[0][1] }
            : { name: 'N/A', amount: 0 };

        // Monthly comparison
        const currentMonthTotal = currentExpenses.reduce((s, t) => s + t.amount, 0);
        const prevMonthTotal = prevExpenses.reduce((s, t) => s + t.amount, 0);
        const monthlyChange = prevMonthTotal > 0
            ? (((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1)
            : '0';

        // Savings progress (simulated: savings goal is ₹3000)
        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);
        const savings = totalIncome - totalExpenses;
        const savingsGoal = 3000;
        const savingsProgress = Math.min((savings / savingsGoal) * 100, 100);

        // Bar chart data — category spending breakdown
        const barData = sortedCategories.map(([name, value]) => ({ name, value }));

        return {
            highestCategory,
            monthlyChange: Number(monthlyChange),
            currentMonthTotal,
            prevMonthTotal,
            savings,
            savingsGoal,
            savingsProgress,
            barData,
        };
    }, [transactions]);

    // Custom bar chart tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="text-xs font-medium text-navy/50 dark:text-light/50">{payload[0].payload.name}</p>
                    <p className="text-sm font-bold text-navy dark:text-light">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div ref={pageRef} className="space-y-6">
            {/* Top insight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Highest Spending Category */}
                <Card hover className="insight-stat">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                            <Crown size={20} className="text-warning" />
                        </div>
                        <Badge variant="warning">Top Spend</Badge>
                    </div>
                    <p className="text-sm text-navy/50 dark:text-light/50 font-medium">Highest Spending</p>
                    <p className="text-2xl font-bold text-navy dark:text-light mt-1">
                        {insights.highestCategory.name}
                    </p>
                    <p className="text-sm text-navy/40 dark:text-light/40 mt-1">
                        ₹{insights.highestCategory.amount.toLocaleString()} total
                    </p>
                </Card>

                {/* Monthly Comparison */}
                <Card hover className="insight-stat">
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${insights.monthlyChange <= 0 ? 'bg-income/10' : 'bg-expense/10'
                                }`}
                        >
                            {insights.monthlyChange <= 0 ? (
                                <TrendingDown size={20} className="text-income" />
                            ) : (
                                <TrendingUp size={20} className="text-expense" />
                            )}
                        </div>
                        <Badge variant={insights.monthlyChange <= 0 ? 'income' : 'expense'}>
                            {insights.monthlyChange <= 0 ? (
                                <ArrowDownRight size={12} className="mr-1" />
                            ) : (
                                <ArrowUpRight size={12} className="mr-1" />
                            )}
                            {Math.abs(insights.monthlyChange)}%
                        </Badge>
                    </div>
                    <p className="text-sm text-navy/50 dark:text-light/50 font-medium">Monthly Comparison</p>
                    <p className="text-lg font-bold text-navy dark:text-light mt-1">
                        {insights.monthlyChange <= 0
                            ? `You spent ${Math.abs(insights.monthlyChange)}% less`
                            : `You spent ${insights.monthlyChange}% more`}
                    </p>
                    <p className="text-sm text-navy/40 dark:text-light/40 mt-1">
                        than last month (₹{insights.prevMonthTotal.toLocaleString()})
                    </p>
                </Card>

                {/* Savings Progress */}
                <Card hover className="insight-stat">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-lime/15 flex items-center justify-center">
                            <PiggyBank size={20} className="text-lime-dark" />
                        </div>
                        <Badge variant="lime">
                            <Target size={12} className="mr-1" />
                            Goal: ₹{insights.savingsGoal.toLocaleString()}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6 mt-2">
                        <CircularProgress
                            value={insights.savingsProgress}
                            size={100}
                            strokeWidth={8}
                            label="Saved"
                        />
                        <div>
                            <p className="text-2xl font-bold text-navy dark:text-light">
                                ₹{insights.savings.toLocaleString()}
                            </p>
                            <p className="text-sm text-navy/40 dark:text-light/40 mt-0.5">
                                of ₹{insights.savingsGoal.toLocaleString()} goal
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Category Spending Bar Chart — NOT animated by GSAP to prevent dimension error */}
            <Card className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-navy dark:text-light">Category Breakdown</h3>
                        <p className="text-xs text-navy/40 dark:text-light/40 mt-0.5">
                            Total spending per category
                        </p>
                    </div>
                </div>

                <div style={{ width: '100%', height: 288 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={insights.barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `₹${v}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                                {insights.barData.map((_, index) => (
                                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
