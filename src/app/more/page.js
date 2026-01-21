'use client';

import React, { useRef } from 'react';
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
    ChevronLeft,
    CloudBackup,
    ListRestart
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ThemeToggle from '@/components/ThemeToggle';


export default function ProfilePage() {
    const router = useRouter();
    const { settings, setSettings, resetApp, capitals, fund, sources, expenses, transactions, loadDummyData, getTotalBalance, getCapitalBalance, getInitialBalance } = useExpenses();
    const { toast, confirm } = useFeedback();
    const fileInputRef = useRef(null);

    const totalNetValue = getTotalBalance();

    // console.log(Object.entries(settings)); 


    const handleExportJson = async () => {
        const ok = await confirm('Download Backup?', 'Save a JSON file containing all your capitals, expenses, and transactions?');
        if (!ok) return;

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

    const handleExportPdf = async () => {
        const ok = await confirm('Download Report?', 'Generate a PDF report of your financial status?');
        if (!ok) return;

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        
        // Add title with branding
        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); // Blue-700 equivalent
        doc.text('Expense Tracker Report', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray-500
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);
        
        let y = 40;
        
        // Add company/personal branding
        doc.setDrawColor(229, 231, 235); // Gray-200
        doc.line(14, 34, pageWidth - 14, 34); // Horizontal line
        
        // Add summary section
        if (y + 20 > pageHeight) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Financial Summary', 14, y);
        y += 12;
        
        // Add total balance
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(`Total Balance: ${settings.currency}${totalNetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, y);
        y += 15;
        
        // Add capitals section with detailed information
        if (capitals.length > 0) {
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Capitals (Detailed)', 14, y);
            y += 8;
            
            autoTable(doc, {
                startY: y,
                head: [['Name', 'Color', 'Current Balance', 'Initial Balance', 'Created Date']],
                body: capitals.map(capital => [
                    capital.name,
                    capital.color.charAt(0).toUpperCase() + capital.color.slice(1),
                    `${settings.currency}${getCapitalBalance(capital.id).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    `${settings.currency}${getInitialBalance(capital.id).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    capital.createdAt ? new Date(capital.createdAt).toLocaleDateString() : 'N/A'
                ]),
                styles: { 
                    fontSize: 9,
                    cellPadding: 5,
                    textColor: [55, 65, 81],
                    fillColor: [255, 255, 255],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [30, 58, 138], // Blue-700
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold',
                    cellPadding: 6
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                },
                margin: { left: 14, right: 14, top: 10, bottom: 10 },
                theme: 'grid',
                pageBreak: 'auto'
            });
            
            y = doc.lastAutoTable.finalY + 12;
        }
        
        // Add sources section with detailed breakdown
        if (sources.length > 0) {
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Sources (Detailed)', 14, y);
            y += 8;
            
            autoTable(doc, {
                startY: y,
                head: [['Title', 'Amount', 'Breakdown', 'Date']],
                body: sources.map(source => [
                    source.title,
                    `${settings.currency}${source.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    source.breakdown || 'No breakdown',
                    new Date(source.date).toLocaleDateString()
                ]),
                styles: { 
                    fontSize: 8,
                    cellPadding: 4,
                    textColor: [55, 65, 81],
                    fillColor: [255, 255, 255],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [30, 58, 138], // Blue-700
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                    cellPadding: 5
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                },
                margin: { left: 10, right: 10, top: 8, bottom: 8 },
                theme: 'grid',
                pageBreak: 'auto'
            });
            
            y = doc.lastAutoTable.finalY + 12;
        }
        
        // Add fund section
        if (fund.length > 0) {
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Fund Records', 14, y);
            y += 8;
            
            autoTable(doc, {
                startY: y,
                head: [['Name', 'Description', 'Status']],
                body: fund.map(item => [
                    item.name || 'N/A',
                    item.description || 'No description',
                    item.status || 'Active'
                ]),
                styles: { 
                    fontSize: 9,
                    cellPadding: 5,
                    textColor: [55, 65, 81],
                    fillColor: [255, 255, 255],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [30, 58, 138], // Blue-700
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold',
                    cellPadding: 6
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                },
                margin: { left: 14, right: 14, top: 10, bottom: 10 },
                theme: 'grid',
                pageBreak: 'auto'
            });
            
            y = doc.lastAutoTable.finalY + 12;
        }
        
        // Add expenses section with full details
        if (expenses.length > 0) {
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Expenses (Detailed)', 14, y);
            y += 8;
            
            autoTable(doc, {
                startY: y,
                head: [['Title', 'Amount', 'Reason', 'Breakdown', 'Date', 'Before Balance', 'After Balance']],
                body: expenses.map(expense => [
                    expense.title,
                    `${settings.currency}${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    expense.reason || 'No reason provided',
                    expense.breakdown || 'No breakdown',
                    new Date(expense.date).toLocaleDateString(),
                    `${settings.currency}${expense.beforeBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}`,
                    `${settings.currency}${expense.afterBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}`
                ]),
                styles: { 
                    fontSize: 7, // Smaller font for more columns
                    cellPadding: 3,
                    textColor: [55, 65, 81],
                    fillColor: [255, 255, 255],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [30, 58, 138], // Blue-700
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'bold',
                    cellPadding: 4
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                },
                margin: { left: 8, right: 8, top: 6, bottom: 6 },
                theme: 'grid',
                pageBreak: 'auto'
            });
            
            y = doc.lastAutoTable.finalY + 12;
        }
        
        // Add transactions section with comprehensive details
        if (transactions.length > 0) {
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Transactions (Comprehensive)', 14, y);
            y += 8;
            
            autoTable(doc, {
                startY: y,
                head: [['Type', 'Amount', 'Note', 'Breakdown', 'Balance Before', 'Balance After', 'Date', 'Capital']],
                body: transactions.map(transaction => [
                    transaction.type,
                    `${settings.currency}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    transaction.note || 'No note',
                    transaction.breakdown || 'No breakdown',
                    `${settings.currency}${transaction.balanceBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    `${settings.currency}${transaction.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    new Date(transaction.date).toLocaleDateString(),
                    transaction.capitalName || 'Unknown Capital'
                ]),
                styles: { 
                    fontSize: 6, // Very small font for many columns
                    cellPadding: 2,
                    textColor: [55, 65, 81],
                    fillColor: [255, 255, 255],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [30, 58, 138], // Blue-700
                    textColor: [255, 255, 255],
                    fontSize: 7,
                    fontStyle: 'bold',
                    cellPadding: 3
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                },
                margin: { left: 6, right: 6, top: 5, bottom: 5 },
                theme: 'grid',
                pageBreak: 'auto'
            });
            
            y = doc.lastAutoTable.finalY + 12;
        }
        
        // Add settings section
        if (y + 30 > pageHeight) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.text('Settings', 14, y);
        y += 8;
        
        autoTable(doc, {
            startY: y,
            head: [['Key', 'Value']],
            body: [
                ['Currency', settings.currency],
                ['Dark Mode', settings.darkMode ? 'Enabled' : 'Disabled']
            ],
            styles: { 
                fontSize: 9,
                cellPadding: 5,
                textColor: [55, 65, 81],
                fillColor: [255, 255, 255],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [30, 58, 138], // Blue-700
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                cellPadding: 6
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251] // Gray-50
            },
            margin: { left: 14, right: 14, top: 10, bottom: 10 },
            theme: 'grid'
        });
        
        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175); // Gray-400
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
            doc.text('Generated by ExTrack', 14, pageHeight - 10);
        }
        
        doc.save(`expense_tracker_report_${new Date().toISOString().split('T')[0]}.pdf`);

        toast('PDF downloaded successfully!', 'success');
    };

    const handleImportJson = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Basic validation
                if (!data.capitals || !data.expenses || !data.settings) {
                    throw new Error('Invalid file format');
                }

                loadDummyData(data); // reuse existing loader
                toast('Data imported successfully!', 'success');
            } catch (err) {
                toast('Invalid JSON file', 'error');
            }
        };

        reader.readAsText(file);
    };




    const handleInitDummyData = async () => {
        const ok = await confirm('Load Sample Data?', 'This will add dummy data to your notebook. Useful for testing.');
        if (!ok) return;

        const dummyData = generateDummyData();
        loadDummyData(dummyData);
        toast('Sample notebook data loaded!', 'info');
    };

    const handleImportClick = async () => {
        const ok = await confirm('Import Data?', 'This will merge/overwrite your current data with the uploaded file. This cannot be undone. Always backup first.');
        if (ok && fileInputRef.current) {
            fileInputRef.current.click();
        }
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
                                    <ListRestart size={20} />
                                </div>
                                <span className="font-semibold text-sm">Load Sample Data</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-300" />
                        </button>

                        <div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportJson}
                                className="hidden"
                                ref={fileInputRef}
                            />

                            <button
                                onClick={handleImportClick}
                                className="w-full p-4 flex items-center justify-between border-b border-[var(--border)] hover:bg-[var(--input)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                        <CloudBackup size={18} />
                                    </div>
                                    <span className="font-semibold text-sm">Import Data (JSON)</span>
                                </div>
                                <ChevronRight size={16} className="text-neutral-300" />
                            </button>
                        </div>


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
