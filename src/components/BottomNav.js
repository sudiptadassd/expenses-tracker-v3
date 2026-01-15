'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Wallet,
    List,
    TrendingDown,
    User
} from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', icon: Home, path: '/' },
        { label: 'Capitals', icon: Wallet, path: '/capitals' },
        { label: 'History', icon: List, path: '/transactions' },
        { label: 'Expenses', icon: TrendingDown, path: '/expenses' },
        { label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-[var(--nav-bg)] backdrop-blur-lg border-t border-[var(--border)] flex justify-around py-3 pb-6 z-50 transition-colors duration-300">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive
                            ? 'text-blue-500 scale-110'
                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                            }`}
                    >
                        <Icon size={20} className={isActive ? 'fill-blue-500/10' : ''} />
                        <span className="text-[10px] font-medium leading-none">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
