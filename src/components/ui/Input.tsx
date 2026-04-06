/**
 * Input — Styled form input with optional label and icon
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

export default function Input({
    label,
    icon,
    error,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasIcon = Boolean(icon);

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-navy/70 dark:text-light/70"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {hasIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50 dark:text-light/50 pointer-events-none flex items-center justify-center">
                        {icon}
                    </span>
                )}
                <input
                    id={inputId}
                    className={`
            w-full h-11 px-4
            ${hasIcon ? 'pl-10' : ''}
            bg-white dark:bg-dark-card
            border border-gray-soft dark:border-dark-border
            rounded-xl
            text-sm leading-none text-navy dark:text-light
            placeholder:text-navy/30 dark:placeholder:text-light/30
            focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime
            transition-all duration-200
            ${error ? 'border-expense ring-1 ring-expense/30' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-expense font-medium">{error}</span>
            )}
        </div>
    );
}
