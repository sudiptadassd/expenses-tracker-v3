import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Trash2, Wallet, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CapitalCard = ({ capital, variant = 'detailed' }) => {
    const { getCapitalBalance, getInitialBalance, deleteCapital, settings } = useExpenses();
    const { confirm, toast } = useFeedback();

    const balance = getCapitalBalance(capital.id);
    const initial = getInitialBalance(capital.id);
    const percentage = initial > 0 ? Math.max(0, Math.min(100, (balance / initial) * 100)) : 0;

    const colorMap = {
        blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500', iconText: 'text-blue-600', bar: 'bg-blue-500', border: 'group-hover:text-blue-500' },
        emerald: { bg: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-500', iconText: 'text-emerald-600', bar: 'bg-emerald-500', border: 'group-hover:text-emerald-500' },
        rose: { bg: 'bg-rose-500', lightBg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-500', iconText: 'text-rose-600', bar: 'bg-rose-500', border: 'group-hover:text-rose-500' },
        amber: { bg: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500', iconText: 'text-amber-600', bar: 'bg-amber-500', border: 'group-hover:text-amber-500' },
        indigo: { bg: 'bg-indigo-500', lightBg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-500', iconText: 'text-indigo-600', bar: 'bg-indigo-500', border: 'group-hover:text-indigo-500' },
        violet: { bg: 'bg-violet-500', lightBg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-500', iconText: 'text-violet-600', bar: 'bg-violet-500', border: 'group-hover:text-violet-500' },
    };

    const colors = colorMap[capital.color] || colorMap.blue;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = await confirm('Delete Capital?', `Are you sure you want to delete "${capital.name}"? This will remove all associated transactions.`);
        if (ok) {
            deleteCapital(capital.id);
            toast('Capital deleted successfully', 'success');
        }
    };

    if (variant === 'compact') {
        return (
            <Link href={`/capitals/${capital.id}`} className="block group">
                <div className="bg-[var(--card)] border border-[var(--card-border)] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="bg-[var(--card)] rounded-2xl  transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center text-white`}>
                                <Wallet size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">{capital.name}</h4>
                                <p className="text-[var(--muted)] text-xs">Available Capital</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="font-bold text-lg">
                                    <span className="text-xs opacity-60 mr-0.5">{settings.currency}</span>
                                    {balance.toLocaleString()}
                                </p>
                            </div>
                            <ChevronRight size={18} className={`text-neutral-300 ${colors.border} transition-colors`} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[var(--input)] rounded-full mb-3 mt-4  overflow-hidden">
                        <div
                            className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    {/* Footer Stats */}
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] m-2">
                        <span>INITIAL: {settings.currency}{initial.toLocaleString()}</span>
                        <span className={colors.text}>{Math.round(percentage)}% LEFT</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/capitals/${capital.id}`} className="block group">
            <div className="bg-[var(--card)] border border-[var(--card-border)] p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {/* Header: Icon & Delete */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex justify-between items-center gap-4">
                        <div className={`w-12 h-12 ${colors.bg} rounded-[19px] flex items-center justify-center text-white shadow-lg`}>
                            <Wallet size={27} />
                        </div>
                        <h3 className="text-2xl font-bold">{capital.name}</h3>
                    </div>
                    {/* Content: Name */}
                    <button
                        onClick={handleDelete}
                        className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Balance Row */}
                <div className="flex justify-between items-end mb-3">
                    <span className="text-[var(--muted)] font-medium">Balance</span>
                    <p className="text-2xl font-bold">
                        <span className="text-sm mr-0.5 opacity-70">{settings.currency}</span>
                        {balance.toLocaleString()}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[var(--input)] rounded-full mb-4 overflow-hidden">
                    <div
                        className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Footer Stats */}
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    <span>INITIAL: {settings.currency}{initial.toLocaleString()}</span>
                    <span className={colors.text}>{Math.round(percentage)}% LEFT</span>
                </div>
            </div>
        </Link>
    );
};

export default CapitalCard;
