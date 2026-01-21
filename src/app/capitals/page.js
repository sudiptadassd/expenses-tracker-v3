'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Plus, X, Wallet as WalletIcon, ChevronLeft } from 'lucide-react';
import CapitalCard from '@/components/CapitalCard';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import { useRouter } from 'next/navigation';

export default function CapitalsPage() {
    const router = useRouter();
    const { capitals, addCapital, updateCapital, deleteCapital } = useExpenses();
    const { toast } = useFeedback();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCapitalName, setNewCapitalName] = useState('');
    const [selectedColor, setSelectedColor] = useState('blue');

    // Edit form states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCapital, setSelectedCapital] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('blue');

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

    const handleAddCapital = (e) => {
        e.preventDefault();
        if (!newCapitalName.trim()) return;
        addCapital(newCapitalName, selectedColor);
        setNewCapitalName('');
        setSelectedColor('blue');
        setIsModalOpen(false);
        toast('Capital created successfully!', 'success');
    };

    const handleEditClick = (capital, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCapital(capital);
        setEditName(capital.name);
        setEditColor(capital.color);
        setIsEditModalOpen(true);
    };

    const handleEditCapital = (e) => {
        e.preventDefault();
        if (!editName.trim()) return;
        updateCapital(selectedCapital.id, editName, editColor);
        setIsEditModalOpen(false);
        setSelectedCapital(null);
        toast('Capital updated successfully!', 'success');
    };

    const handleDeleteClick = (capital, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCapital(capital);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteCapital(selectedCapital.id);
        setIsDeleteModalOpen(false);
        setSelectedCapital(null);
        toast('Capital deleted successfully', 'success');
    };

    // console.log(capitals)

    return (
        <div className="space-y-6 page-transition">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--input)] rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Capitals</h1>
                        <p className="text-[var(--muted)] text-sm">Manage your money containers</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="space-y-4">
                {capitals.map(capital => (
                    <CapitalCard 
                        key={capital.id} 
                        capital={capital}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                ))}
                {capitals.length === 0 && (
                    <div className="bg-[var(--input)] border border-dashed border-[var(--border)] rounded-3xl p-12 text-center text-[var(--muted)] transition-colors duration-300">
                        <WalletIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No capitals created yet.</p>
                        <p className="text-xs mt-1">Tap the + button to add your first container like "Pocket" or "Money Bag".</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Capital">
                <form onSubmit={handleAddCapital} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">
                            Capital Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Pocket, Money Bag, Bank"
                            className="w-full bg-[var(--input)] border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--foreground)]"
                            value={newCapitalName}
                            onChange={(e) => setNewCapitalName(e.target.value)}
                            autoFocus
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
                                    onClick={() => setSelectedColor(theme.id)}
                                    className={`w-10 h-10 rounded-xl ${theme.color} transition-all duration-200 ${selectedColor === theme.id ? 'ring-4 ring-offset-2 ring-blue-400 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${
                            selectedColor === 'blue' ? 'bg-blue-600 shadow-blue-500/30' :
                            selectedColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-500/30' :
                            selectedColor === 'rose' ? 'bg-rose-600 shadow-rose-500/30' :
                            selectedColor === 'amber' ? 'bg-amber-600 shadow-amber-500/30' :
                            selectedColor === 'indigo' ? 'bg-indigo-600 shadow-indigo-500/30' :
                            selectedColor === 'violet' ? 'bg-violet-600 shadow-violet-500/30' :
                            selectedColor === 'purple' ? 'bg-purple-600 shadow-purple-500/30' :
                            selectedColor === 'pink' ? 'bg-pink-600 shadow-pink-500/30' :
                            selectedColor === 'cyan' ? 'bg-cyan-600 shadow-cyan-500/30' :
                            selectedColor === 'teal' ? 'bg-teal-600 shadow-teal-500/30' :
                            selectedColor === 'lime' ? 'bg-lime-600 shadow-lime-500/30' :
                            'bg-orange-600 shadow-orange-500/30'
                        }`}
                    >
                        Create Capital
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
                            autoFocus
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
                message={`Are you sure you want to delete "${selectedCapital?.name}"? All transaction history will be preserved.`}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
