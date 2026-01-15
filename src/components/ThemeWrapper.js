'use client';

import { useExpenses } from "@/context/ExpenseContext";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }) {
    const { settings } = useExpenses();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const html = document.documentElement;
            if (settings.darkMode) {
                html.classList.add('dark');
                html.style.colorScheme = 'dark';
            } else {
                html.classList.remove('dark');
                html.style.colorScheme = 'light';
            }
        }
    }, [settings.darkMode, mounted]);

    if (!mounted) {
        return <div className="min-h-screen bg-white">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            {children}
        </div>
    );
}
