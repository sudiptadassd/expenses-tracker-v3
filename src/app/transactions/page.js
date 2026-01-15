'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import {
    Filter,
    ArrowUpCircle,
    ArrowDownCircle,
    Search,
    BookOpen
} from 'lucide-react';
import TransactionCard from '@/components/TransactionCard';

export default function TransactionsPage() {
    const { transactions, capitals } = useExpenses();
    const [filterType, setFilterType] = useState('ALL');
    const [filterCapital, setFilterCapital] = useState('all');

    const filteredTransactions = transactions.filter(t => {
        const matchesType = filterType === 'ALL' || t.type === filterType;
        const matchesCapital = filterCapital === 'all' || t.capitalId === filterCapital;
        return matchesType && matchesCapital;
    });

    return (
        <div className="space-y-6 page-transition pb-20">
            <header>
                <h1 className="text-2xl font-bold">Ledger History</h1>
                <p className="text-[var(--muted)] text-sm">Full audit trail of all transactions</p>
            </header>

            {/* Filter Tabs */}
            <div className="bg-[var(--input)] rounded-3xl p-1 flex transition-colors duration-300">
                {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${filterType === type
                            ? 'bg-[var(--card)] text-blue-600 shadow-sm'
                            : 'text-[var(--muted)] transition-colors duration-300'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Capital Filter Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setFilterCapital('all')}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterCapital === 'all'
                        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg'
                        : 'bg-[var(--input)] text-neutral-500'
                        }`}
                >
                    All Sources
                </button>
                {capitals.map(cap => (
                    <button
                        key={cap.id}
                        onClick={() => setFilterCapital(cap.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterCapital === cap.id
                            ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg'
                            : 'bg-[var(--input)] text-neutral-500'
                            }`}
                    >
                        {cap.name}
                    </button>
                ))}
            </div>

            {/* Ledger Feed */}
            <div className="space-y-4">
                {filteredTransactions.map(transaction => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
                {filteredTransactions.length === 0 && (
                    <div className="py-20 text-center">
                        <BookOpen size={60} className="mx-auto mb-4 text-neutral-200 dark:text-neutral-800" />
                        <p className="font-medium text-[var(--muted)]">Clear as a whistle</p>
                        <p className="text-[var(--muted)] opacity-70 text-xs mt-1">No transactions match your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
