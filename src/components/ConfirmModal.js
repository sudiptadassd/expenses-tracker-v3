'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, HelpCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    // Use portal to ensure it's on top
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xs bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl animate-scale-in transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
                        <HelpCircle size={28} />
                    </div>

                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm bg-[var(--input)] text-[var(--foreground)] hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
