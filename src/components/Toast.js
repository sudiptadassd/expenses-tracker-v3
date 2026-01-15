'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 2700); // Start closing animation before duration ends
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for transition
    };

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <AlertCircle className="text-rose-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />
    };

    const styles = {
        success: 'border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-emerald-950/20',
        error: 'border-rose-100 dark:border-rose-900/30 bg-white dark:bg-rose-950/20',
        info: 'border-blue-100 dark:border-blue-900/30 bg-white dark:bg-blue-950/20'
    };

    return (
        <div
            className={`flex items-center gap-3 p-4 pr-12 rounded-2xl border shadow-lg pointer-events-auto transition-all duration-300 transform animate-slide-up-fade
                ${styles[type]} 
                ${isClosing ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100'}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{message}</p>
            <button
                onClick={handleClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--input)] rounded-full transition-colors text-[var(--muted)]"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
