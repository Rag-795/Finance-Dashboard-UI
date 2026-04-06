/**
 * Modal — Overlay dialog for forms and confirmations
 * Uses React portal pattern with backdrop click to close.
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-navy/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in" />

            {/* Modal content */}
            <div
                className={`
          relative ${maxWidth} w-full
          bg-white dark:bg-dark-card
          rounded-2xl
          border border-gray-soft dark:border-dark-border
          shadow-2xl
          animate-slide-up
          overflow-hidden
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-soft dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-navy dark:text-light">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 dark:text-light/40 dark:hover:text-light dark:hover:bg-light/5 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
