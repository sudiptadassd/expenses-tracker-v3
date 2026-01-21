'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { BookOpen, ChevronLeft } from 'lucide-react';
import TransactionCard from '@/components/TransactionCard';
import CapitalFilterDropdown from '@/components/CapitalFilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import ThemeToggle from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
    const router = useRouter();
    const { transactions, capitals } = useExpenses();
    const [filterType, setFilterType] = useState('ALL');
    const [filterCapital, setFilterCapital] = useState('all');
    const [sortBy, setSortBy] = useState('NEWEST');


    // const filteredTransactions = transactions.filter(t => {
    //     const matchesType = filterType === 'ALL' || t.type === filterType;
    //     const matchesCapital = filterCapital === 'all' || t.capitalId === filterCapital;
    //     return matchesType && matchesCapital;
    // });

    const filteredTransactions = transactions.filter(t => {
        const matchesType = filterType === 'ALL' || t.type === filterType;
        const matchesCapital = filterCapital === 'all' || t.capitalId === filterCapital;
        return matchesType && matchesCapital;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'OLDEST':
                return new Date(a.date) - new Date(b.date);
            case 'AMOUNT_HIGH':
                return b.amount - a.amount;
            case 'AMOUNT_LOW':
                return a.amount - b.amount;
            default: // NEWEST
                return new Date(b.date) - new Date(a.date);
        }
    });



    return (
        <div className="space-y-6 page-transition pb-20">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Ledger History</h1>
                        <p className="text-[var(--muted)] text-sm">Trail of all transactions</p>
                    </div>
                </div>
                <ThemeToggle />
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
            {/* Filters & Sort Row */}
            <div className="flex items-center justify-between pb-2 ">
                <CapitalFilterDropdown
                    capitals={capitals}
                    selectedCapital={filterCapital}
                    onSelect={setFilterCapital}
                />
                <SortDropdown
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                />
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
