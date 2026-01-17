'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { Search, Filter, TrendingDown, Trash2, ChevronLeft } from 'lucide-react';
import ExpenseCard from '@/components/ExpenseCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export default function ExpensesPage() {
    const router = useRouter();
    const { expenses, capitals, deleteExpense, settings } = useExpenses();
    const [filterCapital, setFilterCapital] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExpenses = expenses.filter(e => {
        const matchesCapital = filterCapital === 'all' || e.capitalId === filterCapital;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCapital && matchesSearch;
    });

    const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

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
                        <h1 className="text-2xl font-bold">Expenses</h1>
                        <p className="text-[var(--muted)] text-sm">All debits across all capitals</p>
                    </div>
                </div>
                <ThemeToggle />
            </header>

            {/* Summary Mini Card */}
            <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[var(--muted)] text-xs font-semibold mb-1 uppercase tracking-wider">Total Filtered</p>
                        <h2 className="text-2xl font-bold">
                            {settings.currency}{totalFiltered.toLocaleString()}
                        </h2>
                    </div>
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--foreground)] transition-colors duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setFilterCapital('all')}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterCapital === 'all'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-[var(--input)] text-neutral-500 transition-colors duration-300'
                            }`}
                    >
                        All Capitals
                    </button>
                    {capitals.map(cap => (
                        <button
                            key={cap.id}
                            onClick={() => setFilterCapital(cap.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterCapital === cap.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-[var(--input)] text-neutral-500 transition-colors duration-300'
                                }`}
                        >
                            {cap.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Expense List */}
            <div className="space-y-3">
                {filteredExpenses.map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                ))}
                {filteredExpenses.length === 0 && (
                    <div className="py-20 text-center text-neutral-400">
                        <TrendingDown size={48} className="mx-auto mb-4 opacity-10" />
                        <p>No expenses found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
