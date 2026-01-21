import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowDownAZ } from 'lucide-react';

export default function SortDropdown({ currentSort, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const sortOptions = [
        { label: 'Newest', value: 'NEWEST' },
        { label: 'Oldest', value: 'OLDEST' },
        { label: 'High Amount', value: 'AMOUNT_HIGH' },
        { label: 'Low Amount', value: 'AMOUNT_LOW' },
    ];

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
        const option = sortOptions.find(o => o.value === currentSort);
        return option ? option.label : 'Sort';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--input)] hover:bg-[var(--card)] rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-neutral-700/50"
            >
                <ArrowDownAZ size={14} className={`text-[var(--muted)] transition-transform duration-200 ${isOpen ? 'rotate-360' : ''}`} />
                <span className="text-[var(--foreground)]">{getSelectedLabel()}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--card)] border border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right border-zinc-500">
                    <div className="p-1">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSortChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors ${currentSort === option.value
                                        ? 'bg-stone-200 text-[var(--background)]'
                                        : 'text-[var(--muted)] hover:bg-[var(--input)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {currentSort === option.value && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
