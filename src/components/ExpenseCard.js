'use client';

import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { ArrowRight, Trash2, Clock } from 'lucide-react';

const ExpenseCard = ({ expense }) => {
    const { capitals, deleteExpense, settings } = useExpenses();
    const { confirm, toast } = useFeedback();
    const capital = capitals.find(c => c.id === expense.capitalId);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
    };

    return (
        <div className="bg-[var(--card)] border border-[var(--card-border)] p-4 rounded-2xl shadow-sm group transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold">{expense.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-[var(--input)] px-2 py-0.5 rounded-full font-bold text-[var(--muted)]">
                            {capital?.name || 'Deleted'}
                        </span>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(expense.date)}
                            {/* {expense.date} */}
                        </span>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-rose-500 leading-none mb-1">
                        -{settings.currency}{expense.amount.toLocaleString()}
                    </p>
                    {/* <button
                        onClick={async () => {
                            const ok = await confirm('Delete Expense?', 'This will permanently remove this expense and recover the capital balance.');
                            if (ok) {
                                deleteExpense(expense.id);
                                toast('Expense deleted', 'success');
                            }
                        }}
                        className="p-1.5 text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={14} />
                    </button> */}
                </div>
            </div>

            {expense.reason && (
                <div className="mt-3 p-3 bg-[var(--input)] rounded-xl text-xs text-[var(--muted)] leading-relaxed italic border-l-2 border-neutral-200 dark:border-neutral-700">
                    "{expense.reason}"
                </div>
            )}

            {/* Notebook Logic: Balance Tracking */}
            <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px]">
                <div className="flex flex-col">
                    <span className="text-neutral-400 italic">Before</span>
                    <span className="font-medium text-neutral-600 dark:text-neutral-500">
                        {settings.currency}{expense.beforeBalance.toLocaleString()}
                    </span>
                </div>
                <ArrowRight size={12} className="text-neutral-200" />
                <div className="flex flex-col text-right">
                    <span className="text-neutral-400 italic">After</span>
                    <span className="font-bold text-blue-500">
                        {settings.currency}{expense.afterBalance.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;
