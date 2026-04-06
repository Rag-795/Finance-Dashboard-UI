/**
 * Card — Reusable card wrapper with optional hover effects
 */

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    style?: React.CSSProperties;
}

const paddingClasses: Record<string, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    style,
}: CardProps) {
    return (
        <div
            className={`
                bg-white dark:bg-dark-card
                rounded-2xl
                border border-gray-soft dark:border-dark-border
                shadow-card
                ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300' : ''}
                ${paddingClasses[padding]}
                ${className}
            `}
            style={style}
        >
            {children}
        </div>
    );
}

