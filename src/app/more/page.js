'use client';

import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { useRouter } from 'next/navigation';
import { generateDummyData } from '@/utils/dummyData';
import {
    Settings,
    Download,
    Trash2,
    Moon,
    Sun,
    DollarSign,
    Github,
    Info,
    ChevronRight,
    User as UserIcon,
    Mail,
    Calendar,
    ShieldCheck,
    History,
    FileDown,
    FileBracesCorner,
    ChevronLeft
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ThemeToggle from '@/components/ThemeToggle';


export default function ProfilePage() {
    const router = useRouter();
    const { settings, setSettings, resetApp, capitals, sources, expenses, transactions, loadDummyData, getTotalBalance, getCapitalBalance } = useExpenses();
    const { toast, confirm } = useFeedback();

    const totalNetValue = getTotalBalance();

    // console.log(Object.entries(settings)); 


    const handleExportJson = () => {
        const data = {
            capitals,
            sources,
            expenses,
            transactions,
            settings,
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('JSON downloaded successfully!', 'success');
    };

    const handleExportPdf = () => {
        const doc = new jsPDF();
        let y = 15;

        doc.setFontSize(16);
        doc.text('Expense Tracker Report', 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, y);
        y += 10;

        const addTable = (title, data) => {
            if (!Array.isArray(data) || data.length === 0) return;

            doc.setFontSize(12);
            doc.text(title, 14, y);
            y += 4;

            autoTable(doc, {
                startY: y,
                head: [Object.keys(data[0])],
                body: data.map(row => Object.values(row)),
                styles: { fontSize: 8 },
                theme: 'grid'
            });

            y = doc.lastAutoTable.finalY + 8;
        };

        addTable('Capitals', capitals);
        addTable('Sources', sources);
        addTable('Expenses', expenses);
        addTable('Transactions', transactions);

        // Settings table
        doc.setFontSize(12);
        doc.text('Settings', 14, y);
        y += 4;

        autoTable(doc, {
            startY: y,
            head: [['Key', 'Value']],
            body: Object.entries(settings),
            styles: { fontSize: 9 },
            theme: 'grid'
        });

        doc.save(`expense_tracker_${new Date().toISOString().split('T')[0]}.pdf`);

        toast('PDF downloaded successfully!', 'success');
    };



    const handleInitDummyData = () => {
        const dummyData = generateDummyData();
        loadDummyData(dummyData);
        toast('Sample notebook data loaded!', 'info');
    };

    const currencies = [
        { label: 'USD ($)', value: '$' },
        { label: 'INR (₹)', value: '₹' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
        { label: 'BDT (৳)', value: '৳' },
    ];

    return (
        <div className="space-y-4 page-transition pb-20">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">More Option</h1>
                        <p className="text-[var(--muted)] text-sm">Profile and Settings</p>
                    </div>
                </div>
                <ThemeToggle />
            </header>

            {/* Premium Profile Card */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] p-2 rounded-[25px] shadow-sm flex flex-col items-center text-center transition-all duration-300">
                <div className="relative mb-3">
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                        <UserIcon size={48} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-4 border-[var(--card)] rounded-full flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">User</h2>

                <div className="space-y-2 mb-1">
                    <div className="flex items-center justify-center gap-2 text-[var(--muted)] text-sm">
                        <Mail size={14} />
                        <span>user@example.com</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[var(--muted)] text-sm">
                        <Calendar size={14} />
                        <span>Joined January 2024</span>
                    </div>
                </div>

                {/* <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        TIER: PREMIUM USER
                    </span>
                </div> */}
            </div>

            {/* Asset Portfolio Section */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-[25px] overflow-hidden transition-all duration-300">
                <div className="p-6 pb-3 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Asset Portfolio</h3>
                    <span className="bg-[var(--input)] text-[var(--muted)] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Live Balances
                    </span>
                </div>

                <div className="divide-y divide-[var(--border)]">
                    {capitals.map(capital => {
                        const balance = getCapitalBalance(capital.id);
                        const colorMap = {
                            blue: 'bg-blue-500',
                            emerald: 'bg-emerald-500',
                            rose: 'bg-rose-500',
                            amber: 'bg-amber-500',
                            indigo: 'bg-indigo-500',
                            violet: 'bg-violet-500',
                        };
                        return (
                            <div key={capital.id} className="p-3 px-6 flex justify-between items-center group hover:bg-[var(--input)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${colorMap[capital.color] || colorMap.blue}`} />
                                    <span className="font-semibold text-sm">{capital.name}</span>
                                </div>
                                <span className="font-bold text-sm">
                                    <span className="text-xs opacity-50 mr-0.5">{settings.currency}</span>
                                    {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="p-5 pt-2 border-t border-[var(--border)] flex justify-between items-center">
                    <span className="text-[var(--muted)] font-bold text-sm">Total Net Value</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-xl">
                        <span className="text-sm mr-1">{settings.currency}</span>
                        {totalNetValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Preference Settings Sections */}
            <div className="space-y-4">
                {/* Appearance & Currency */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 opacity-70">Preference</h3>
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden transition-colors duration-300">
                        {/* Theme Toggle */}
                        <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg flex items-center justify-center">
                                    {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                                </div>
                                <span className="font-semibold text-sm">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.darkMode ? 'bg-blue-600' : 'bg-neutral-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* Currency Selector */}
                        <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
                                    <DollarSign size={18} />
                                </div>
                                <span className="font-semibold text-sm">Default Currency</span>
                            </div>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className=" font-bold text-blue-600 outline-none text-sm "
                            >
                                {currencies.map(c => (
                                    <option key={c.value} value={c.value} className='text-black' >{c.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                {/* Storage & Backup Section */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 opacity-70">Storage & Backup</h3>
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden transition-colors duration-300">
                        <button
                            onClick={handleExportPdf}
                            className="w-full p-4 flex items-center justify-between border-b border-[var(--border)] hover:bg-[var(--input)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                    {/* <Download size={18} /> */}
                                    <FileDown size={18} />
                                </div>
                                <span className="font-semibold text-sm">Download Data (PDF)</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-300" />
                        </button>
                        <button
                            onClick={handleExportJson}
                            className="w-full p-4 flex items-center justify-between border-b border-[var(--border)] hover:bg-[var(--input)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                    <FileBracesCorner size={18} />
                                </div>
                                <span className="font-semibold text-sm">Download Data (JSON)</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-300" />
                        </button>
                        <button
                            onClick={handleInitDummyData}
                            className="w-full p-4 flex items-center justify-between border-b border-[var(--border)] hover:bg-[var(--input)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                    <History size={20} />
                                </div>
                                <span className="font-semibold text-sm">Load Sample Data</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-300" />
                        </button>

                        <button
                            onClick={async () => {
                                const ok = await confirm('Reset Everything?', 'This will wipe all your data permanently. This cannot be undone.');
                                if (ok) {
                                    resetApp();
                                    toast('Application reset successful', 'success');
                                }
                            }}
                            className="w-full p-4 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg flex items-center justify-center">
                                    <Trash2 size={18} />
                                </div>
                                <span className="font-semibold text-sm text-rose-600">Reset All Data</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-300" />
                        </button>
                    </div>
                </section>

                {/* App Info */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 opacity-70">About App</h3>
                    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-4 space-y-4 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--input)] text-neutral-600 dark:text-neutral-400 rounded-lg flex items-center justify-center">
                                <Info size={18} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm leading-tight">V1.0.0 Notebook Edition</p>
                                <p className="text-[10px] text-[var(--muted)]">Stable Build 2026.01.15</p>
                            </div>
                        </div>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                            Built with notebook-style logic. Auto-calculates before/after balances and maintains a complete transaction ledger for multiple capitals.
                        </p>
                    </div>
                </section>
            </div>

            <div className="pt-4 text-center">
                <p className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase">Made with ❤️ for efficiency</p>
            </div>
        </div>
    );
}
