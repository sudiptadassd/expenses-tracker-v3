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
    const [fund, setFund] = useState([]);
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
            const { capitals, fund, sources, expenses, transactions, settings } = JSON.parse(storedData);
            setCapitals(capitals || []);
            setFund(fund || []);
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
                fund,
                sources,
                expenses,
                transactions,
                settings
            }));
        }
    }, [capitals, fund, sources, expenses, transactions, settings, isInitialized]);

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

    const addFund = () => {

    }

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

    const updateSource = (sourceId, title, breakdown, amount) => {
        const source = sources.find(s => s.id === sourceId);
        if (!source) return;

        const oldAmount = source.amount;
        const newAmount = Number(amount);
        const amountDiff = newAmount - oldAmount;

        // Update source
        setSources(sources.map(s => 
            s.id === sourceId 
                ? { ...s, title, breakdown, amount: newAmount }
                : s
        ));

        // Update corresponding transaction
        setTransactions(transactions.map(t => {
            if (t.referenceId === sourceId) {
                return {
                    ...t,
                    note: title,
                    breakdown: breakdown,
                    amount: newAmount,
                    balanceAfter: t.balanceBefore + newAmount
                };
            }
            return t;
        }));
    };

    const addExpense = (capitalId, title, reason, amount, sourceId = null) => {
        const beforeBalance = getCapitalBalance(capitalId);
        const expenseAmount = Number(amount);
        
        // Prevent negative balance
        if (beforeBalance - expenseAmount < 0) {
            throw new Error(`Insufficient balance! Current balance: ${beforeBalance.toLocaleString()}, Required: ${expenseAmount.toLocaleString()}`);
        }

        const newExpense = {
            id: generateId(),
            capitalId,
            sourceId: sourceId || null, // Track which fund this expense came from
            title,
            reason,
            amount: expenseAmount,
            date: new Date().toISOString(),
            beforeBalance,
            afterBalance: beforeBalance - expenseAmount,
        };

        const newTransaction = {
            id: generateId(),
            type: 'DEBIT',
            capitalId,
            sourceId: sourceId || null,
            amount: expenseAmount,
            balanceBefore: beforeBalance,
            balanceAfter: beforeBalance - expenseAmount,
            date: new Date().toISOString(),
            note: title,
            breakdown: reason, // Store reason as breakdown in transaction
            referenceId: newExpense.id
        };

        setExpenses([...expenses, newExpense]);
        setTransactions([newTransaction, ...transactions]);
        
        return newExpense;
    };

    const updateCapital = (id, name, color) => {
        setCapitals(capitals.map(c => c.id === id ? { ...c, name, color } : c));
    };

    const deleteCapital = (id) => {
        const capitalToDelete = capitals.find(c => c.id === id);
        if (!capitalToDelete) return;

        // Remove capital but preserve all transaction records
        setCapitals(capitals.filter(c => c.id !== id));
        
        // Add "Capital Deleted" tag to all transactions from this capital
        setTransactions(transactions.map(t => {
            if (t.capitalId === id) {
                return {
                    ...t,
                    capitalName: capitalToDelete.name,
                    deletedTag: `Capital "${capitalToDelete.name}" Deleted`,
                    capitalDeleted: true
                };
            }
            return t;
        }));

        // Note: sources and expenses are preserved for historical records
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(e => e.id === id);
        if (!expenseToDelete) return;

        // Remove expense entry
        setExpenses(expenses.filter(e => e.id !== id));
        
        // Add "Expense Removed" tag to the transaction but keep the record
        setTransactions(transactions.map(t => {
            if (t.referenceId === id) {
                return {
                    ...t,
                    deletedTag: 'Expense Removed',
                    expenseDeleted: true
                };
            }
            return t;
        }));
    };

    const deleteSource = (id) => {
        // Remove source entry
        setSources(sources.filter(s => s.id !== id));
        
        // Add "Fund Removed" tag to the transaction but keep the record
        setTransactions(transactions.map(t => {
            if (t.referenceId === id) {
                return {
                    ...t,
                    deletedTag: 'Fund Removed',
                    fundDeleted: true
                };
            }
            return t;
        }));
    };

    const resetApp = () => {
        setCapitals([]);
        setFund([]);
        setSources([]);
        setExpenses([]);
        setTransactions([]);
        localStorage.removeItem('expense_tracker_data');
    };

    const loadDummyData = (dummyData) => {
        setCapitals(dummyData.capitals);
        setFund(dummyData.fund);
        setSources(dummyData.sources);
        setExpenses(dummyData.expenses);
        setTransactions(dummyData.transactions);
    };

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const value = {
        capitals,
        fund,
        sources,
        expenses,
        transactions,
        settings,
        setSettings,
        addCapital,
        updateCapital,
        addSource,
        updateSource,
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
