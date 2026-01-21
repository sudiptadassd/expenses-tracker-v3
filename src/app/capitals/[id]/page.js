'use client';

import React, { useEffect, useState } from 'react';
import {
    ChevronLeft,
    Plus,
    Pencil,
    Trash2,
    X,
    MoreVertical,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

export default function CapitalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const {
        capitals,
        sources,
        getCapitalBalance,
        addSource,
        updateSource,
        deleteSource,
        updateCapital,
        deleteCapital,
        settings
    } = useExpenses();
    const { toast } = useFeedback();

    const [capital, setCapital] = useState(null);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newCurrencyType, setNewCurrencyType] = useState('');
    const [isEditFundModalOpen, setIsEditFundModalOpen] = useState(false);
    const [isDeleteFundModalOpen, setIsDeleteFundModalOpen] = useState(false);
    const [selectedFund, setSelectedFund] = useState(null);
    const [editCurrencyTypes, setEditCurrencyTypes] = useState([]);

    // Collapsible state for each fund item
    const [expandedItems, setExpandedItems] = useState({});

    // Add Funds form states
    const [currencyTypes, setCurrencyTypes] = useState([
        { id: 'bigNotes', label: 'Big Notes (e.g., 100, 200, 500)', checked: false, steps: 100, description: '', amount: '' },
        { id: 'smallNotes', label: 'Small Notes (e.g., 10, 20, 50)', checked: false, steps: 10, description: '', amount: '' },
        { id: 'coins', label: 'Coins (e.g., 1, 2, 5)', checked: false, steps: 1, description: '', amount: '' },
        { id: 'Others', label: 'Others', checked: false, steps: 1, description: '', amount: '' },
    ]);

    // Edit form states
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('blue');

    useEffect(() => {
        const found = capitals.find(c => c.id === id);
        if (found) {
            setCapital(found);
            setEditName(found.name);
            setEditColor(found.color);
        }
    }, [id, capitals]);

    if (!capital) return null;

    const balance = getCapitalBalance(id);
    const capitalSources = sources.filter(s => s.capitalId === id);

    // Parse breakdown from latest source to get fund details
    const getFundsBreakdown = () => {
        if (capitalSources.length === 0) return [];

        const allFunds = [];
        capitalSources.forEach(source => {
            if (source.breakdown) {
                const parts = source.breakdown.split(', ');
                parts.forEach(part => {
                    const match = part.match(/(.+?):\s*(.+?)\s*-\s*[^\d]*([\d.]+)/);
                    if (match) {
                        const [, type, desc, amt] = match;
                        const typeKey = type.trim();

                        // Find existing entry for this type
                        const existing = allFunds.find(f => f.type === typeKey);
                        if (existing) {
                            existing.total += Number(amt);
                            existing.items.push({ description: desc.trim(), amount: Number(amt) });
                        } else {
                            allFunds.push({
                                type: typeKey,
                                total: Number(amt),
                                items: [{ description: desc.trim(), amount: Number(amt) }]
                            });
                        }
                    }
                });
            }
        });
        return allFunds;
    };

    const fundsBreakdown = getFundsBreakdown();
    const lastUpdate = capitalSources.length > 0
        ? new Date(capitalSources[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A';

    const themes = [
        { id: 'blue', color: 'bg-blue-500' },
        { id: 'emerald', color: 'bg-emerald-500' },
        { id: 'rose', color: 'bg-rose-500' },
        { id: 'amber', color: 'bg-amber-500' },
        { id: 'indigo', color: 'bg-indigo-500' },
        { id: 'violet', color: 'bg-violet-500' },
        { id: 'purple', color: 'bg-purple-500' },
        { id: 'pink', color: 'bg-pink-500' },
        { id: 'cyan', color: 'bg-cyan-500' },
        { id: 'teal', color: 'bg-teal-500' },
        { id: 'lime', color: 'bg-lime-500' },
        { id: 'orange', color: 'bg-orange-500' },
    ];

    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', button: 'bg-blue-600 shadow-blue-500/30', ring: 'focus:ring-blue-500', btnHover: 'hover:bg-blue-700', muted: 'text-blue-700 dark:text-blue-400', banner: 'bg-blue-50 dark:bg-blue-900/10' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600', button: 'bg-emerald-600 shadow-emerald-500/30', ring: 'focus:ring-emerald-500', btnHover: 'hover:bg-emerald-700', muted: 'text-emerald-700 dark:text-emerald-400', banner: 'bg-emerald-50 dark:bg-emerald-900/10' },
        rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600', button: 'bg-rose-600 shadow-rose-500/30', ring: 'focus:ring-rose-500', btnHover: 'hover:bg-rose-700', muted: 'text-rose-700 dark:text-rose-400', banner: 'bg-rose-50 dark:bg-rose-900/10' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600', button: 'bg-amber-600 shadow-amber-500/30', ring: 'focus:ring-amber-500', btnHover: 'hover:bg-amber-700', muted: 'text-amber-700 dark:text-amber-400', banner: 'bg-amber-50 dark:bg-amber-900/10' },
        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600', button: 'bg-indigo-600 shadow-indigo-500/30', ring: 'focus:ring-indigo-500', btnHover: 'hover:bg-indigo-700', muted: 'text-indigo-700 dark:text-indigo-400', banner: 'bg-indigo-50 dark:bg-indigo-900/10' },
        violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600', button: 'bg-violet-600 shadow-violet-500/30', ring: 'focus:ring-violet-500', btnHover: 'hover:bg-violet-700', muted: 'text-violet-700 dark:text-violet-400', banner: 'bg-violet-50 dark:bg-violet-900/10' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', button: 'bg-purple-600 shadow-purple-500/30', ring: 'focus:ring-purple-500', btnHover: 'hover:bg-purple-700', muted: 'text-purple-700 dark:text-purple-400', banner: 'bg-purple-50 dark:bg-purple-900/10' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600', button: 'bg-pink-600 shadow-pink-500/30', ring: 'focus:ring-pink-500', btnHover: 'hover:bg-pink-700', muted: 'text-pink-700 dark:text-pink-400', banner: 'bg-pink-50 dark:bg-pink-900/10' },
        cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600', button: 'bg-cyan-600 shadow-cyan-500/30', ring: 'focus:ring-cyan-500', btnHover: 'hover:bg-cyan-700', muted: 'text-cyan-700 dark:text-cyan-400', banner: 'bg-cyan-50 dark:bg-cyan-900/10' },
        teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600', button: 'bg-teal-600 shadow-teal-500/30', ring: 'focus:ring-teal-500', btnHover: 'hover:bg-teal-700', muted: 'text-teal-700 dark:text-teal-400', banner: 'bg-teal-50 dark:bg-teal-900/10' },
        lime: { bg: 'bg-lime-50 dark:bg-lime-900/20', text: 'text-lime-600', button: 'bg-lime-600 shadow-lime-500/30', ring: 'focus:ring-lime-500', btnHover: 'hover:bg-lime-700', muted: 'text-lime-700 dark:text-lime-400', banner: 'bg-lime-50 dark:bg-lime-900/10' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', button: 'bg-orange-600 shadow-orange-500/30', ring: 'focus:ring-orange-500', btnHover: 'hover:bg-orange-700', muted: 'text-orange-700 dark:text-orange-400', banner: 'bg-orange-50 dark:bg-orange-900/10' },
    };

    const colors = capital ? (colorMap[capital.color] || colorMap.blue) : colorMap.blue;

    const handleCurrencyTypeToggle = (id) => {
        setCurrencyTypes(currencyTypes.map(ct =>
            ct.id === id ? { ...ct, checked: !ct.checked } : ct
        ));
    };

    const handleCurrencyFieldChange = (id, field, value) => {
        setCurrencyTypes(currencyTypes.map(ct =>
            ct.id === id ? { ...ct, [field]: value } : ct
        ));
    };

    const calculateTotalToAdd = () => {
        return currencyTypes
            .filter(ct => ct.checked)
            .reduce((sum, ct) => sum + (Number(ct.amount) || 0), 0);
    };

    const handleAddCustomType = () => {
        if (!newCurrencyType.trim()) {
            toast('Please enter a currency type name', 'error');
            return;
        }

        const customId = `custom_${Date.now()}`;
        setCurrencyTypes([...currencyTypes, {
            id: customId,
            label: newCurrencyType.trim(),
            checked: false,
            steps: 1,
            description: '',
            amount: '',
            isCustom: true
        }]);
        setNewCurrencyType('');
        toast('Custom type added!', 'success');
    };

    const handleRemoveCustomType = (id) => {
        setCurrencyTypes(currencyTypes.filter(ct => ct.id !== id));
    };

    const handleEditFund = (source) => {
        setSelectedFund(source);

        // Parse breakdown to populate edit form
        if (source.breakdown) {
            const parts = source.breakdown.split(', ');
            const resetTypes = [
                { id: 'bigNotes', label: 'Big Notes (e.g., 100, 200, 500)', checked: false, steps: 100, description: '', amount: '' },
                { id: 'smallNotes', label: 'Small Notes (e.g., 10, 20, 50)', checked: false, steps: 10, description: '', amount: '' },
                { id: 'coins', label: 'Coins (e.g., 1, 2, 5)', checked: false, steps: 1, description: '', amount: '' },
                { id: 'Others', label: 'Others', checked: false, steps: 1, description: '', amount: '' },
            ];

            parts.forEach(part => {
                const match = part.match(/(.+?):\s*(.+?)\s*-\s*[^\d]*([\d.]+)/);
                if (match) {
                    const [, type, desc, amt] = match;
                    const typeKey = type.trim();

                    // Try to match with existing types
                    let foundType = null;
                    if (typeKey.toLowerCase().includes('big')) foundType = 'bigNotes';
                    else if (typeKey.toLowerCase().includes('small')) foundType = 'smallNotes';
                    else if (typeKey.toLowerCase().includes('coin')) foundType = 'coins';
                    else if (typeKey.toLowerCase().includes('other')) foundType = 'Others';

                    if (foundType) {
                        const typeIndex = resetTypes.findIndex(t => t.id === foundType);
                        if (typeIndex !== -1) {
                            resetTypes[typeIndex] = {
                                ...resetTypes[typeIndex],
                                checked: true,
                                description: desc.trim() !== 'N/A' ? desc.trim() : '',
                                amount: amt.trim()
                            };
                        }
                    } else {
                        // It's a custom type
                        const customId = `custom_${Date.now()}_${Math.random()}`;
                        resetTypes.push({
                            id: customId,
                            label: typeKey,
                            checked: true,
                            steps: 1,
                            description: desc.trim() !== 'N/A' ? desc.trim() : '',
                            amount: amt.trim(),
                            isCustom: true
                        });
                    }
                }
            });

            setEditCurrencyTypes(resetTypes);
        }

        setIsEditFundModalOpen(true);
    };

    const handleEditCurrencyTypeToggle = (id) => {
        setEditCurrencyTypes(editCurrencyTypes.map(ct =>
            ct.id === id ? { ...ct, checked: !ct.checked } : ct
        ));
    };

    const handleEditCurrencyFieldChange = (id, field, value) => {
        setEditCurrencyTypes(editCurrencyTypes.map(ct =>
            ct.id === id ? { ...ct, [field]: value } : ct
        ));
    };

    const calculateEditTotalToAdd = () => {
        return editCurrencyTypes
            .filter(ct => ct.checked)
            .reduce((sum, ct) => sum + (Number(ct.amount) || 0), 0);
    };

    const handleUpdateFund = (e) => {
        e.preventDefault();
        const totalAmount = calculateEditTotalToAdd();

        if (totalAmount <= 0) {
            toast('Please enter at least one amount', 'error');
            return;
        }

        // Create breakdown from selected currency types
        const breakdown = editCurrencyTypes
            .filter(ct => ct.checked && ct.amount)
            .map(ct => `${ct.label.split('(')[0].trim()}: ${ct.description || 'N/A'} - ${settings.currency}${ct.amount}`)
            .join(', ');

        updateSource(selectedFund.id, 'Funds Added', breakdown, totalAmount);

        setIsEditFundModalOpen(false);
        setSelectedFund(null);
        toast('Fund updated successfully!', 'success');
    };

    const handleDeleteFund = (source) => {
        setSelectedFund(source);
        setIsDeleteFundModalOpen(true);
    };

    const confirmDeleteFund = () => {
        if (selectedFund) {
            deleteSource(selectedFund.id);
            setIsDeleteFundModalOpen(false);
            setSelectedFund(null);
            toast('Fund deleted', 'success');
        }
    };

    const toggleItemExpand = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const toggleFundExpand = (fundKey) => {
        setExpandedFunds(prev => ({
            ...prev,
            [fundKey]: !prev[fundKey]
        }));
    };

    const handleAddFunds = (e) => {
        e.preventDefault();
        const totalAmount = calculateTotalToAdd();

        if (totalAmount <= 0) {
            toast('Please enter at least one amount', 'error');
            return;
        }

        // Create breakdown from selected currency types
        const breakdown = currencyTypes
            .filter(ct => ct.checked && ct.amount)
            .map(ct => `${ct.label.split('(')[0].trim()}: ${ct.description || 'N/A'} - ${settings.currency}${ct.amount}`)
            .join(', \n');

        addSource(id, 'Funds Added', breakdown, totalAmount);

        // Reset form
        setCurrencyTypes([
            { id: 'bigNotes', label: 'Big Notes (e.g., 100, 200, 500)', checked: false, steps: 100, description: '', amount: '' },
            { id: 'smallNotes', label: 'Small Notes (e.g., 10, 20, 50)', checked: false, steps: 10, description: '', amount: '' },
            { id: 'coins', label: 'Coins (e.g., 1, 2, 5)', checked: false, steps: 1, description: '', amount: '' },
            { id: 'Others', label: 'Others', checked: false, steps: 1, description: '', amount: '' },
        ]);
        setIsAddFundsModalOpen(false);
        toast('Funds added successfully!', 'success');
    };

    const handleEditCapital = (e) => {
        e.preventDefault();
        updateCapital(id, editName, editColor);
        setIsEditModalOpen(false);
        toast('Capital updated successfully!', 'success');
    };

    const handleDeleteCapital = () => {
        deleteCapital(id);
        setIsDeleteModalOpen(false);
        toast('Capital deleted', 'success');
        router.push('/capitals');
    };

    return (
        <div className="space-y-6 pb-20 page-transition">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">{capital.name}</h1>
                </div>
                {/* <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                        title="Edit Capital"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded-full transition-colors"
                        title="Delete Capital"
                    >
                        <Trash2 size={20} />
                    </button>
                </div> */}
            </header>

            {/* Balance Card */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl shadow-sm transition-colors duration-300 overflow-hidden">
                {/* Balance Display */}
                <div className="p-6 text-center">
                    <p className="text-[var(--muted)] text-sm mb-2">Current Balance</p>
                    <h2 className="text-5xl font-bold mb-1">
                        <span className="text-2xl mr-1">{settings.currency}</span>
                        {balance.toLocaleString()}
                    </h2>
                </div>

                {/* Add Funds Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={() => setIsAddFundsModalOpen(true)}
                        className={`w-full flex items-center justify-center gap-2 ${colors.button} text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95`}
                    >
                        <Plus size={20} /> Add Funds
                    </button>
                </div>
            </div>

            {/* Funds Breakdown */}
            {fundsBreakdown.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl shadow-sm p-6 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{capital.name}</h3>
                        <span className="text-sm text-[var(--muted)]">Last update: {lastUpdate}</span>
                    </div>

                    <div className="space-y-6">
                        {capitalSources.map((source, index) => {
                            // Parse this source's breakdown
                            const sourceFunds = [];
                            if (source.breakdown) {
                                const parts = source.breakdown.split(', ');
                                parts.forEach(part => {
                                    const match = part.match(/(.+?):\s*(.+?)\s*-\s*[^\d]*([\d.]+)/);
                                    if (match) {
                                        const [, type, desc, amt] = match;
                                        sourceFunds.push({
                                            type: type.trim(),
                                            description: desc.trim(),
                                            amount: Number(amt)
                                        });
                                    }
                                });
                            }

                            return (
                                <div key={source.id} className="border-b border-[var(--border)] last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-base">Total: {settings.currency}{source.amount.toLocaleString()}</h4>
                                            <p className="text-xs text-[var(--muted)] mt-0.5">
                                                {new Date(source.date).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditFund(source)}
                                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                                                title="Edit Fund"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFund(source)}
                                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded-lg transition-colors"
                                                title="Delete Fund"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {sourceFunds.length > 0 && (
                                        <ul className="space-y-1 ml-4">
                                            {sourceFunds.map((item, idx) => {
                                                const itemId = `${source.id}-${idx}`;
                                                const isExpanded = expandedItems[itemId] || false;
                                                return (
                                                    <li key={idx} className="text-sm text-[var(--muted)]">
                                                        <div 
                                                            className="flex items-center gap-2 cursor-pointer hover:bg-[var(--input)] p-1 rounded-lg transition-colors"
                                                            onClick={() => toggleItemExpand(itemId)}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] opacity-50"></span>
                                                            <div className="flex justify-between flex-1">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{item.type}:</span>
                                                                    <span className="text-xs">{settings.currency}{item.amount.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {/* <span className="text-xs">
                                                                        {item.description !== 'N/A' && item.description !== 'No description' 
                                                                            ? item.description 
                                                                            : 'No description'}
                                                                    </span> */}
                                                                    <span className="ml-1">
                                                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="ml-6 mt-1 pl-3 border-l-2 border-[var(--border)] text-xs text-[var(--muted)]">
                                                                <span className="font-medium">Description:</span> {item.description !== 'N/A' ? item.description : 'No description'}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* <button
                        onClick={() => setIsAddFundsModalOpen(true)}
                        className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--muted)] hover:border-blue-500 hover:text-blue-600 transition-colors font-medium text-sm"
                    >
                        Add Funds
                    </button> */}
                </div>
            )}

            {/* Add Funds Modal */}
            <Modal isOpen={isAddFundsModalOpen} onClose={() => setIsAddFundsModalOpen(false)} title="Add Funds to Wallet">
                <form onSubmit={handleAddFunds} className="space-y-5">
                    <p className="text-sm text-[var(--muted)]">Select currency types and enter details.</p>

                    {/* Currency Types */}
                    <div className="space-y-4">
                        {currencyTypes.map((ct) => (
                            <div key={ct.id} className="space-y-3">
                                {/* Checkbox and Label */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={ct.checked}
                                            onChange={() => handleCurrencyTypeToggle(ct.id)}
                                            className="w-5 h-5 rounded border-2 border-[var(--border)] bg-[var(--input)] checked:bg-blue-600 checked:border-blue-600 cursor-pointer appearance-none"
                                        />
                                        {ct.checked && (
                                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 12 12">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold flex-1">{ct.label}</span>
                                    {ct.isCustom && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCustomType(ct.id)}
                                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded transition-colors"
                                            title="Remove custom type"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </label>

                                {/* Input Fields - Only shown when checked */}
                                {ct.checked && (
                                    <div className="grid grid-cols-3 gap-3 ml-8">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            className="grid col-span-2 bg-[var(--input)] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                                            value={ct.description}
                                            onChange={(e) => handleCurrencyFieldChange(ct.id, 'description', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            step={ct.steps}
                                            className="bg-[var(--input)] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                                            value={ct.amount}
                                            onChange={(e) => handleCurrencyFieldChange(ct.id, 'amount', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Custom Type */}
                    <div className="pt-2 border-t border-[var(--border)]">
                        <label className="block text-sm font-semibold mb-2">Add Custom Currency Type</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g., Gift Cards, Mobile Money"
                                className="flex-1 bg-[var(--input)] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                                value={newCurrencyType}
                                onChange={(e) => setNewCurrencyType(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCustomType();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomType}
                                className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Balance Summary */}
                    <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--muted)]">Before Balance:</span>
                            <span className="font-bold">{settings.currency}{balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-emerald-600 dark:text-emerald-400">Amount to Add:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{settings.currency}{calculateTotalToAdd().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-[var(--border)]">
                            <span className="font-bold">After Balance:</span>
                            <span className="font-bold text-lg">{settings.currency}{(balance + calculateTotalToAdd()).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full ${colors.button} text-white font-bold py-4 rounded-2xl shadow-lg ${colors.btnHover} transition-all active:scale-95`}
                    >
                        Add Funds
                    </button>
                </form>
            </Modal>

            {/* Edit Capital Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Capital">
                <form onSubmit={handleEditCapital} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">
                            Capital Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Pocket, Money Bag, Bank"
                            className="w-full bg-[var(--input)] border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--foreground)]"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-3">Theme Color</label>
                        <div className="flex flex-wrap gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setEditColor(theme.id)}
                                    className={`w-10 h-10 rounded-xl ${theme.color} transition-all duration-200 ${editColor === theme.id ? 'ring-4 ring-offset-2 ring-blue-400 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Save Changes
                    </button>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Capital?"
                message={`Are you sure you want to delete "${capital.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteCapital}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            {/* Edit Fund Modal */}
            <Modal isOpen={isEditFundModalOpen} onClose={() => setIsEditFundModalOpen(false)} title="Edit Fund">
                <form onSubmit={handleUpdateFund} className="space-y-5">
                    <p className="text-sm text-[var(--muted)]">Update currency types and amounts.</p>

                    {/* Currency Types */}
                    <div className="space-y-4">
                        {editCurrencyTypes.map((ct) => (
                            <div key={ct.id} className="space-y-3">
                                {/* Checkbox and Label */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={ct.checked}
                                            onChange={() => handleEditCurrencyTypeToggle(ct.id)}
                                            className="w-5 h-5 rounded border-2 border-[var(--border)] bg-[var(--input)] checked:bg-blue-600 checked:border-blue-600 cursor-pointer appearance-none"
                                        />
                                        {ct.checked && (
                                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 12 12">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold flex-1">{ct.label}</span>
                                </label>

                                {/* Input Fields - Only shown when checked */}
                                {ct.checked && (
                                    <div className="grid grid-cols-3 gap-3 ml-8">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            className="grid col-span-2 bg-[var(--input)] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                                            value={ct.description}
                                            onChange={(e) => handleEditCurrencyFieldChange(ct.id, 'description', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            step={ct.steps}
                                            className="bg-[var(--input)] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                                            value={ct.amount}
                                            onChange={(e) => handleEditCurrencyFieldChange(ct.id, 'amount', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Balance Summary */}
                    <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--muted)]">Current Amount:</span>
                            <span className="font-bold">{settings.currency}{selectedFund?.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 dark:text-blue-400">New Amount:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{settings.currency}{calculateEditTotalToAdd().toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full ${colors.button} text-white font-bold py-4 rounded-2xl shadow-lg ${colors.btnHover} transition-all active:scale-95`}
                    >
                        Update Fund
                    </button>
                </form>
            </Modal>

            {/* Delete Fund Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteFundModalOpen}
                title="Delete Fund?"
                message={`Are you sure you want to delete this fund of ${settings.currency}${selectedFund?.amount.toLocaleString()}? This action cannot be undone.`}
                onConfirm={confirmDeleteFund}
                onCancel={() => setIsDeleteFundModalOpen(false)}
            />
        </div>
    );
}
