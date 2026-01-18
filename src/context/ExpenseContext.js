'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { v4 as generateId } from 'uuid';

const ExpenseContext = createContext();

/* ✅ Simple ID generator (Date-based) */
const generateId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};

export const ExpenseProvider = ({ children }) => {
    const [capitals, setCapitals] = useState([]);
    const [sources, setSources] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState({
        currency: '₹',
        darkMode: false,
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // Persistence
    useEffect(() => {
        const storedData = localStorage.getItem('expense_tracker_data');
        if (storedData) {
            const { capitals, sources, expenses, transactions, settings } = JSON.parse(storedData);
            setCapitals(capitals || []);
            setSources(sources || []);
            setExpenses(expenses || []);
            setTransactions(transactions || []);
            setSettings(settings || { currency: '₹', darkMode: false });
        } else {
            // First time use: Detect OS theme preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setSettings(prev => ({ ...prev, darkMode: prefersDark }));
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('expense_tracker_data', JSON.stringify({
                capitals,
                sources,
                expenses,
                transactions,
                settings
            }));
        }
    }, [capitals, sources, expenses, transactions, settings, isInitialized]);

    // Balance Calculation Utils
    const getCapitalBalance = (capitalId) => {
        const capitalSources = sources.filter(s => s.capitalId === capitalId);
        const capitalExpenses = expenses.filter(e => e.capitalId === capitalId);

        const totalCredit = capitalSources.reduce((sum, s) => sum + Number(s.amount), 0);
        const totalDebit = capitalExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

        return totalCredit - totalDebit;
    };

    const getInitialBalance = (capitalId) => {
        const capitalSources = sources.filter(s => s.capitalId === capitalId);
        return capitalSources.reduce((sum, s) => sum + Number(s.amount), 0);
    };

    const getTotalBalance = () => {
        return capitals.reduce((sum, capital) => sum + getCapitalBalance(capital.id), 0);
    };

    // Actions
    const addCapital = (name, color = 'blue') => {
        const newCapital = {
            id: generateId(),
            name,
            color,
            createdAt: new Date().toISOString(),
        };
        setCapitals([...capitals, newCapital]);
        return newCapital;
    };

    const addSource = (capitalId, title, breakdown, amount) => {
        const beforeBalance = getCapitalBalance(capitalId);
        const newSource = {
            id: generateId(),
            capitalId,
            title,
            breakdown,
            amount: Number(amount),
            date: new Date().toISOString(),
        };

        const newTransaction = {
            id: generateId(),
            type: 'CREDIT',
            capitalId,
            amount: Number(amount),
            balanceBefore: beforeBalance,
            balanceAfter: beforeBalance + Number(amount),
            date: new Date().toISOString(),
            note: title,
            breakdown: breakdown, // Store breakdown in transaction
            referenceId: newSource.id
        };

        setSources([...sources, newSource]);
        setTransactions([newTransaction, ...transactions]);
    };

    const addExpense = (capitalId, title, reason, amount) => {
        const beforeBalance = getCapitalBalance(capitalId);
        const newExpense = {
            id: generateId(),
            capitalId,
            title,
            reason,
            amount: Number(amount),
            date: new Date().toISOString(),
            beforeBalance,
            afterBalance: beforeBalance - Number(amount),
        };

        const newTransaction = {
            id: generateId(),
            type: 'DEBIT',
            capitalId,
            amount: Number(amount),
            balanceBefore: beforeBalance,
            balanceAfter: beforeBalance - Number(amount),
            date: new Date().toISOString(),
            note: title,
            breakdown: reason, // Store reason as breakdown in transaction
            referenceId: newExpense.id
        };

        setExpenses([...expenses, newExpense]);
        setTransactions([newTransaction, ...transactions]);
    };

    const deleteCapital = (id) => {
        setCapitals(capitals.filter(c => c.id !== id));
        // setSources(sources.filter(s => s.capitalId !== id));
        // setExpenses(expenses.filter(e => e.capitalId !== id));
        // setTransactions(transactions.filter(t => t.capitalId !== id));
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(e => e.id === id);
        if (!expenseToDelete) return;

        setExpenses(expenses.filter(e => e.id !== id));
        setTransactions(transactions.filter(t => t.referenceId !== id));
        // Note: In a real app with ledger logic, deleting an expense would require recalculating 
        // all subsequent transaction before/after balances if we want to maintain strict ordering.
        // For this simple implementation, we'll keep it as is, but total balances will auto-update
        // because they are calculated on-the-fly via getCapitalBalance.
    };

    const deleteSource = (id) => {
        setSources(sources.filter(s => s.id !== id));
        setTransactions(transactions.filter(t => t.referenceId !== id));
    };

    const resetApp = () => {
        setCapitals([]);
        setSources([]);
        setExpenses([]);
        setTransactions([]);
        localStorage.removeItem('expense_tracker_data');
    };

    const loadDummyData = (dummyData) => {
        setCapitals(dummyData.capitals);
        setSources(dummyData.sources);
        setExpenses(dummyData.expenses);
        setTransactions(dummyData.transactions);
    };

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const value = {
        capitals,
        sources,
        expenses,
        transactions,
        settings,
        setSettings,
        addCapital,
        addSource,
        addExpense,
        deleteCapital,
        deleteExpense,
        deleteSource,
        getCapitalBalance,
        getInitialBalance,
        getTotalBalance,
        resetApp,
        loadDummyData,
        toggleDarkMode
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};
