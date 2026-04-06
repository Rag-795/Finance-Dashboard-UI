/**
 * Badge — Small label for statuses, categories, and types
 */

import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'income' | 'expense' | 'info' | 'warning' | 'neutral' | 'lime';
    className?: string;
}

const variantClasses: Record<string, string> = {
    income: 'bg-income/10 text-income',
    expense: 'bg-expense/10 text-expense',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
    neutral: 'bg-navy/5 text-navy/70 dark:bg-light/10 dark:text-light/70',
    lime: 'bg-lime/20 text-navy dark:text-lime',
};

export default function Badge({
    children,
    variant = 'neutral',
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-1
        text-xs font-semibold rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
