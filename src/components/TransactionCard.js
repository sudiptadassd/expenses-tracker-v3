'use client';

import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowRight,
    Clock
} from 'lucide-react';

const TransactionCard = ({ transaction }) => {
    const { capitals, settings } = useExpenses();
    const isCredit = transaction.type === 'CREDIT';
    const capital = capitals.find(c => c.id === transaction.capitalId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            shortMonth: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                        {isCredit ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm leading-tight">{transaction.note || (isCredit ? 'Source' : 'Expense')}</h4>
                        <p className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-wider">
                            {capital?.name || 'Unknown Capital'} • {transaction.type}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-bold ${isCredit ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isCredit ? '+' : '-'}{settings.currency}{transaction.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 justify-end mt-0.5">
                        <Clock size={10} />
                        {formatDate(transaction.date)}
                    </div>
                </div>
            </div>

            {transaction.breakdown && (
                <div className="mb-3 p-3 bg-[var(--input)] rounded-xl text-xs text-[var(--muted)] leading-relaxed italic border-l-2 border-neutral-200 dark:border-neutral-700">
                    "{transaction.breakdown}"
                </div>
            )}

            {/* Ledger Details (Notebook Style) */}
            <div className="mt-3 pt-3 border-t border-neutral-50 dark:border-neutral-800/50 flex items-center justify-between text-[11px]">
                <div className="flex flex-col">
                    <span className="text-[var(--muted)] opacity-70 mb-0.5 italic">Balance Before</span>
                    <span className="font-semibold text-[var(--muted)]">
                        {settings.currency}{transaction.balanceBefore.toLocaleString()}
                    </span>
                </div>
                <ArrowRight size={14} className="text-neutral-300" />
                <div className="flex flex-col text-right">
                    <span className="text-neutral-400 mb-0.5 italic">Balance After</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                        {settings.currency}{transaction.balanceAfter.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
