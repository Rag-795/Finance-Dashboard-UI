/**
 * Button — Reusable button component
 * Variants: primary (lime), secondary (navy), outline, ghost, danger
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    primary: 'bg-lime text-navy hover:bg-lime-dark font-semibold shadow-sm',
    secondary: 'bg-navy text-white hover:bg-navy-light font-semibold shadow-sm',
    outline: 'border-2 border-navy/20 text-navy hover:bg-navy/5 dark:border-light/20 dark:text-light dark:hover:bg-light/5',
    ghost: 'text-navy hover:bg-navy/5 dark:text-light dark:hover:bg-light/5',
    danger: 'bg-expense/10 text-expense hover:bg-expense/20 font-medium',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-full',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3 text-base rounded-xl',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    icon,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
