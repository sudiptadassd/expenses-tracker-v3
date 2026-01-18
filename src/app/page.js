'use client';

import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { generateDummyData } from '@/utils/dummyData';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PlusCircle,
    History,
    ArrowUpRight,
    ArrowDownRight,
    List,
    User,
    Moon,
    Sun,
    BrushCleaning,
    Info
} from 'lucide-react';
import Link from 'next/link';
import CapitalCard from '@/components/CapitalCard';
import TransactionCard from '@/components/TransactionCard';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
    const {
        capitals,
        getTotalBalance,
        expenses,
        transactions,
        loadDummyData,
        settings,
        setSettings
    } = useExpenses();

    const { toast } = useFeedback();

    const totalBalance = getTotalBalance();
    // const today = new Date().toISOString().split('T')[0];
    const today = new Date().toLocaleDateString('en-CA');


    const todayExpenses = expenses.filter(e =>
        e.date.startsWith(today)
    ).reduce((sum, e) => sum + e.amount, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    const monthlyExpenses = expenses.filter(e =>
        new Date(e.date) >= monthStart
    ).reduce((sum, e) => sum + e.amount, 0);

    const recentTransactions = transactions.slice(0, 9);

    const handleInitDummyData = () => {
        const dummyData = generateDummyData();
        loadDummyData(dummyData);
        toast('Sample notebook data loaded!', 'info');
    };

    return (
        <div className="space-y-6 pb-4 page-transition">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Morack</h1>
                    <p className="text-[var(--muted)] text-lg">Welcome back!</p>
                </div>
                {/* <button
                    onClick={handleInitDummyData}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    title="Load Notebook Data"
                >
                    <History size={20} />
                </button> */}

                {/* Theme Toggle */}
                <ThemeToggle />


            </header>

            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wallet size={120} />
                </div>
                <div className="relative z-10">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold mb-6 flex items-baseline gap-1 !text-white">
                        <span className="text-2xl opacity-80">{settings.currency}</span>
                        {totalBalance.toLocaleString()}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <TrendingDown size={14} className="text-amber-300" />
                                <span>Today's Spent</span>
                            </div>
                            <p className="font-bold">{settings.currency}{todayExpenses.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <TrendingDown size={14} className="text-amber-300" />
                                <span>This Month</span>
                            </div>
                            <p className="font-bold">{settings.currency}{monthlyExpenses.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            {/* <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Capital', icon: Wallet, color: 'bg-emerald-100 text-emerald-600', path: '/capitals' },
                        { label: 'Expense', icon: TrendingDown, color: 'bg-rose-100 text-rose-600', path: '/expenses' },
                        { label: 'Ledger', icon: List, color: 'bg-indigo-100 text-indigo-600', path: '/transactions' },
                        { label: 'Settings', icon: User, color: 'bg-amber-100 text-amber-600', path: '/profile' },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            href={action.path}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center shadow-sm`}>
                                <action.icon size={22} />
                            </div>
                            <span className="text-[11px] font-semibold opacity-70 transition-colors duration-300">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </section> */}

            {/* My Capitals */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">My Capitals</h3>
                    {/* <Link href="/capitals" className="text-blue-500 text-sm font-semibold">See All</Link> */}
                </div>
                {capitals.length > 0 ? (
                    <div className="space-y-3">
                        {capitals.map(capital => (
                            <CapitalCard key={capital.id} capital={capital} variant="compact" />
                        ))}
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--card)] to-[var(--input)] border border-[var(--border)] p-6 text-center group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[var(--background)] rounded-2xl flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform duration-300 ring-4 ring-[var(--card)]">
                                <Wallet className="text-blue-500" size={32} />
                            </div>
                            <h3 className="font-bold text-lg">No capitals found</h3>
                            <p className="text-[var(--muted)] text-xs max-w-[220px] leading-relaxed">
                                Start your financial journey by adding your first source of funds.
                            </p>
                            <Link
                                href="/capitals"
                                className="mt-2 px-6 py-2.5 bg-[var(--input)] hover:bg-neutral-200 text-[var(--muted)] hover:text-neutral-900 bg-[var(--card)] rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
                            >
                                <PlusCircle size={16} />
                                Create Capital
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Recent Transactions */}
            <section className="pb-8 mt-5">
                <div className="flex justify-between items-center mb-4 mt-9">
                    <h3 className="font-bold text-lg">Recent Ledger</h3>
                    <Link href="/transactions" className="text-blue-500 text-sm font-semibold">View All</Link>
                </div>
                <div className="space-y-3">
                    {recentTransactions.map(transaction => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                    {recentTransactions.length === 0 && (
                        <p className="text-center text-neutral-500 text-sm py-4">No transactions found</p>
                    )}
                </div>
            </section>
        </div>
    );
}
