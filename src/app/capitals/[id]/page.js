'use client';

import React, { useEffect, useState } from 'react';
import {
    X,
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    Plus,
    History,
    Info
} from 'lucide-react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import TransactionCard from '@/components/TransactionCard';

export default function CapitalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const {
        capitals,
        sources,
        expenses,
        transactions,
        getCapitalBalance,
        addSource,
        addExpense,
        settings
    } = useExpenses();
    const { toast } = useFeedback();

    const [capital, setCapital] = useState(null);
    const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    // Form states
    const [sourceTitle, setSourceTitle] = useState('');
    const [sourceBreakdown, setSourceBreakdown] = useState('');
    const [sourceAmount, setSourceAmount] = useState('');
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    useEffect(() => {
        const found = capitals.find(c => c.id === id);
        if (found) setCapital(found);
    }, [id, capitals]);

    if (!capital) return null;

    const balance = getCapitalBalance(id);
    const capitalSources = sources.filter(s => s.capitalId === id);
    const capitalExpenses = expenses.filter(e => e.capitalId === id);
    const capitalTransactions = transactions.filter(t => t.capitalId === id);

    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', button: 'bg-blue-600 shadow-blue-500/30', ring: 'focus:ring-blue-500', btnHover: 'hover:bg-blue-700', muted: 'text-blue-700 dark:text-blue-400', banner: 'bg-blue-50 dark:bg-blue-900/10' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600', button: 'bg-emerald-600 shadow-emerald-500/30', ring: 'focus:ring-emerald-500', btnHover: 'hover:bg-emerald-700', muted: 'text-emerald-700 dark:text-emerald-400', banner: 'bg-emerald-50 dark:bg-emerald-900/10' },
        rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600', button: 'bg-rose-600 shadow-rose-500/30', ring: 'focus:ring-rose-500', btnHover: 'hover:bg-rose-700', muted: 'text-rose-700 dark:text-rose-400', banner: 'bg-rose-50 dark:bg-rose-900/10' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600', button: 'bg-amber-600 shadow-amber-500/30', ring: 'focus:ring-amber-500', btnHover: 'hover:bg-amber-700', muted: 'text-amber-700 dark:text-amber-400', banner: 'bg-amber-50 dark:bg-amber-900/10' },
        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600', button: 'bg-indigo-600 shadow-indigo-500/30', ring: 'focus:ring-indigo-500', btnHover: 'hover:bg-indigo-700', muted: 'text-indigo-700 dark:text-indigo-400', banner: 'bg-indigo-50 dark:bg-indigo-900/10' },
        violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600', button: 'bg-violet-600 shadow-violet-500/30', ring: 'focus:ring-violet-500', btnHover: 'hover:bg-violet-700', muted: 'text-violet-700 dark:text-violet-400', banner: 'bg-violet-50 dark:bg-violet-900/10' },
    };

    const colors = capital ? (colorMap[capital.color] || colorMap.blue) : colorMap.blue;

    const handleAddSource = (e) => {
        e.preventDefault();
        addSource(id, sourceTitle, sourceBreakdown, sourceAmount);
        setSourceTitle('');
        setSourceBreakdown('');
        setSourceAmount('');
        setIsSourceModalOpen(false);
        toast('Capital added successfully!', 'success');
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (Number(expenseAmount) > balance) {
            toast('Insufficient balance in this capital!', 'error');
            return;
        }
        addExpense(id, expenseTitle, '', expenseAmount);
        setExpenseTitle('');
        setExpenseAmount('');
        setIsExpenseModalOpen(false);
        toast('Expense recorded', 'success');
    };

    return (
        <div className="space-y-6 pb-20 page-transition">
            {/* Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">{capital.name} Details</h1>
            </header>

            {/* Balance Summary Card */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] p-6 rounded-3xl shadow-sm text-center transition-colors duration-300">
                <p className="text-[var(--muted)] text-sm mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold mb-6">
                    <span className="text-xl mr-1">{settings.currency}</span>
                    {balance.toLocaleString()}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setIsSourceModalOpen(true)}
                        className={`flex items-center justify-center gap-2 ${colors.bg} ${colors.text} py-3 rounded-2xl font-bold text-sm`}
                    >
                        <Plus size={18} /> Add Source
                    </button>
                    <button
                        onClick={() => setIsExpenseModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 py-3 rounded-2xl font-bold text-sm"
                    >
                        <TrendingDown size={18} /> Add Expense
                    </button>
                </div>
            </div>

            {/* Ledger History */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <History size={18} className="text-neutral-400" />
                        Ledger History
                    </h3>
                </div>
                <div className="space-y-3">
                    {capitalTransactions.map(transaction => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                    {capitalTransactions.length === 0 && (
                        <div className="py-12 text-center text-neutral-400">
                            <History size={40} className="mx-auto mb-2 opacity-10" />
                            <p className="text-sm">No transactions yet for this capital.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Add Source Modal */}
            <Modal isOpen={isSourceModalOpen} onClose={() => setIsSourceModalOpen(false)} title="Add Capital Source">
                <form onSubmit={handleAddSource} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Opening Balance, Bonus"
                            className={`w-full bg-[var(--input)] border-none rounded-2xl p-4 ${colors.ring} outline-none text-[var(--foreground)]`}
                            value={sourceTitle}
                            onChange={(e) => setSourceTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Breakdown / Details</label>
                        <textarea
                            placeholder="e.g., 500x2 bills, From savings account..."
                            rows={2}
                            className={`w-full bg-[var(--input)] border-none rounded-2xl p-4 ${colors.ring} outline-none text-[var(--foreground)] resize-none`}
                            value={sourceBreakdown}
                            onChange={(e) => setSourceBreakdown(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--muted)]">{settings.currency}</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className={`w-full bg-[var(--input)] border-none rounded-2xl p-4 pl-10 font-bold ${colors.ring} outline-none text-[var(--foreground)]`}
                                value={sourceAmount}
                                onChange={(e) => setSourceAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className={`w-full ${colors.button} text-white font-bold py-4 rounded-2xl shadow-lg`}>
                        Confirm Credit
                    </button>
                </form>
            </Modal>

            {/* Add Expense Modal */}
            <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="New Expense">
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className={`${colors.banner} p-4 rounded-2xl flex items-center justify-between`}>
                        <div className={`flex items-center gap-2 ${colors.text}`}>
                            <Info size={16} />
                            <span className="text-xs font-semibold">Current Balance</span>
                        </div>
                        <span className={`font-bold ${colors.muted}`}>{settings.currency}{balance.toLocaleString()}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Expense Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Bus Fare, Lunch, Medicine"
                            className={`w-full bg-[var(--input)] border-none rounded-2xl p-4 ${colors.ring} outline-none text-[var(--foreground)]`}
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--muted)]">{settings.currency}</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-[var(--input)] border-none rounded-2xl p-4 pl-10 font-bold focus:ring-2 focus:ring-rose-500 outline-none text-[var(--foreground)]"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Auto Calculation Preview */}
                    {expenseAmount && (
                        <div className="p-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-xs">
                            <span className="text-[var(--muted)]">Post-balance will be:</span>
                            <span className="font-bold">
                                {settings.currency}{(balance - Number(expenseAmount)).toLocaleString()}
                            </span>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/30">
                        Confirm Debit
                    </button>
                </form>
            </Modal>
        </div>
    );
}
