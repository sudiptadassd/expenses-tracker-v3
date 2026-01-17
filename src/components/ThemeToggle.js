
'use client';

import React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { settings, setSettings } = useExpenses();

    return (
        <div className="p-4 flex items-center justify-between">
            <button
                onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center
                        ${settings.darkMode ? 'bg-blue-600' : 'bg-neutral-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center
                            transform transition-transform duration-200 ease-in-out
                            ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}
                >
                    {settings.darkMode ? (
                        <Moon size={10} className="text-blue-600" />
                    ) : (
                        <Sun size={10} className="text-amber-500" />
                    )}
                </div>
            </button>
        </div>
    );
}

export default ThemeToggle;