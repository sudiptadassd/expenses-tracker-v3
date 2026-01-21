import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CapitalFilterDropdown({ capitals, selectedCapital, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const getSelectedLabel = () => {
        if (selectedCapital === 'all') return 'All Sources';
        const cap = capitals.find(c => c.id === selectedCapital);
        return cap ? cap.name : 'Unknown';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--input)] hover:bg-[var(--card)] rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-neutral-700/50"
            >
                <span className="text-[var(--foreground)]">{getSelectedLabel()}</span>
                <ChevronDown size={16} className={`text-[var(--muted)] transition-transform duration-200 ${isOpen ? '-rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--card)] border border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left border-zinc-500">
                    <div className="p-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                        <button
                            onClick={() => {
                                onSelect('all');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors ${selectedCapital === 'all'
                                ? 'bg-stone-200 text-[var(--background)]'
                                : 'text-[var(--muted)] hover:bg-[var(--input)]hover:text-[var(--foreground)]'
                                }`}
                        >
                            <span>All Sources</span>
                            {selectedCapital === 'all' && <Check size={14} />}
                        </button>

                        {capitals.map((cap) => (
                            <button
                                key={cap.id}
                                onClick={() => {
                                    onSelect(cap.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors ${selectedCapital === cap.id
                                    ? 'bg-stone-200 text-[var(--background)]'
                                    : 'text-[var(--muted)] hover:bg-[var(--input)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                <span className="truncate">{cap.name}</span>
                                {selectedCapital === cap.id && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
