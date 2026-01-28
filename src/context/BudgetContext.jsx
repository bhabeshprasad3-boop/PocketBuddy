import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  // --- EXISTING STATES ---
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('pocketBudget')) || 0);
  const [savingsGoal, setSavingsGoal] = useState(() => Number(localStorage.getItem('pocketSavingsGoal')) || 0);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('pocketTransactions')) || []);
  
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('pocketGoal');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      title: parsed.title || 'Dream Item',
      targetAmount: parsed.targetAmount || 50000,
      savedAmount: parsed.savedAmount || 0,
      targetDate: parsed.targetDate || '',
      history: parsed.history || []
    };
  });

  // 👇 NEW: Subscriptions State
  const [subscriptions, setSubscriptions] = useState(() => JSON.parse(localStorage.getItem('pocketSubs')) || []);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('pocketBudget', budget);
    localStorage.setItem('pocketSavingsGoal', savingsGoal);
    localStorage.setItem('pocketTransactions', JSON.stringify(transactions));
    localStorage.setItem('pocketGoal', JSON.stringify(goal));
    localStorage.setItem('pocketSubs', JSON.stringify(subscriptions)); // Save Subs
  }, [budget, savingsGoal, transactions, goal, subscriptions]);

  // --- CALCULATIONS ---
  const totalSpent = transactions.reduce((total, item) => total + item.amount, 0);
  const remaining = budget - savingsGoal - totalSpent;
  const today = new Date();
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInCurrentMonth - today.getDate());
  const dailyLimit = remaining > 0 ? (remaining / daysLeft).toFixed(0) : 0;

  // --- ACTIONS ---
  const addTransaction = (newTxn) => setTransactions([newTxn, ...transactions]);
  const deleteTransaction = (id) => setTransactions(transactions.filter(txn => txn.id !== id));
  
  const updateGoal = (data) => setGoal(data);
  const addToGoal = (amount) => {
    const newEntry = { amount, date: new Date().toISOString() };
    setGoal(prev => ({ ...prev, savedAmount: prev.savedAmount + amount, history: [newEntry, ...prev.history] }));
  };

  // 👇 NEW: Subscription Actions
  const addSubscription = (sub) => setSubscriptions([...subscriptions, sub]);
  const deleteSubscription = (id) => setSubscriptions(subscriptions.filter(s => s.id !== id));

  const resetWallet = () => {
    setBudget(0); setSavingsGoal(0); setTransactions([]); setSubscriptions([]);
    setGoal({ title: 'Dream Item', targetAmount: 50000, savedAmount: 0, targetDate: '', history: [] });
    localStorage.clear();
  };

  return (
    <BudgetContext.Provider value={{
      budget, setBudget,
      savingsGoal, setSavingsGoal,
      transactions, goal, subscriptions, // 👈 Added subscriptions
      totalSpent, remaining, daysLeft, dailyLimit,
      addTransaction, deleteTransaction, resetWallet,
      updateGoal, addToGoal,
      addSubscription, deleteSubscription // 👈 Added Actions
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);