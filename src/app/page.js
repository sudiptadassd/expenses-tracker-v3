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
    User
} from 'lucide-react';
import Link from 'next/link';
import CapitalCard from '@/components/CapitalCard';
import TransactionCard from '@/components/TransactionCard';

export default function Dashboard() {
    const {
        capitals,
        getTotalBalance,
        expenses,
        transactions,
        loadDummyData,
        settings
    } = useExpenses();
    const { toast } = useFeedback();

    const totalBalance = getTotalBalance();
    const today = new Date().toISOString().split('T')[0];

    const todayExpenses = expenses.filter(e =>
        e.date.startsWith(today)
    ).reduce((sum, e) => sum + e.amount, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    const monthlyExpenses = expenses.filter(e =>
        new Date(e.date) >= monthStart
    ).reduce((sum, e) => sum + e.amount, 0);

    const recentTransactions = transactions.slice(0, 5);

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
                    <h1 className="text-2xl font-bold">My Wallet</h1>
                    <p className="text-[var(--muted)] text-sm">Welcome back!</p>
                </div>
                <button
                    onClick={handleInitDummyData}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    title="Load Notebook Data"
                >
                    <History size={20} />
                </button>
            </header>

            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wallet size={120} />
                </div>
                <div className="relative z-10">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold mb-6 flex items-baseline gap-1">
                        <span className="text-2xl opacity-80">{settings.currency}</span>
                        {totalBalance.toLocaleString()}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <ArrowUpRight size={14} className="text-emerald-400" />
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
            <section>
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
            </section>

            {/* My Capitals */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">My Capitals</h3>
                    <Link href="/capitals" className="text-blue-500 text-sm font-semibold">See All</Link>
                </div>
                {capitals.length > 0 ? (
                    <div className="space-y-3">
                        {capitals.map(capital => (
                            <CapitalCard key={capital.id} capital={capital} variant="compact" />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[var(--input)] border border-dashed border-[var(--border)] rounded-3xl p-8 text-center transition-colors duration-300">
                        <p className="text-neutral-500 text-sm mb-4">No capitals yet</p>
                        <button
                            onClick={handleInitDummyData}
                            className="text-blue-500 font-bold flex items-center gap-2 mx-auto"
                        >
                            <PlusCircle size={20} />
                            Load Sample Data
                        </button>
                    </div>
                )}
            </section>

            {/* Recent Transactions */}
            <section className="pb-8">
                <div className="flex justify-between items-center mb-4">
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
