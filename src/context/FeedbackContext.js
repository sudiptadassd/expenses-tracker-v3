'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

const FeedbackContext = createContext();

/* ✅ Simple ID generator (Date-based) */
const generateId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmState, setConfirmState] = useState(null);

    const toast = useCallback((message, type = 'info', duration = 3000) => {
        const id = generateId();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const confirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            setConfirmState({
                title,
                message,
                onConfirm: () => {
                    setConfirmState(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <FeedbackContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Confirmation Modal */}
            {confirmState && (
                <ConfirmModal
                    isOpen={!!confirmState}
                    title={confirmState.title}
                    message={confirmState.message}
                    onConfirm={confirmState.onConfirm}
                    onCancel={confirmState.onCancel}
                />
            )}

            {/* Toasts Container */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
                {toasts.map(t => (
                    <Toast
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                    />
                ))}
            </div>
        </FeedbackContext.Provider>
    );
};
