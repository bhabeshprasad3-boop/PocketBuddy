import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  
  // --- 1. LOAD DATA ---
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('pocketBudget');
    return saved ? Number(saved) : 4000;
  });

  // 👇 NEW: Savings Goal (Jo paise lock karne hain)
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('pocketSavingsGoal');
    return saved ? Number(saved) : 0;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pocketTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. AUTO-SAVE ---
  useEffect(() => {
    localStorage.setItem('pocketBudget', budget);
    localStorage.setItem('pocketSavingsGoal', savingsGoal); // Save Goal
    localStorage.setItem('pocketTransactions', JSON.stringify(transactions));
  }, [budget, savingsGoal, transactions]);

  // --- 3. CALCULATIONS (Updated Logic) ---
  
  const totalSpent = transactions.reduce((total, item) => total + item.amount, 0);

  // ✨ MAGIC FORMULA: Total Budget - Locked Savings - Kharcha
  const remaining = budget - savingsGoal - totalSpent;

  // Real Savings = Locked Amount + (Spendable mein se jo bacha hai)
  // (Ye optional hai, graph ke liye kaam aayega)
  const totalActualSavings = savingsGoal + Math.max(0, remaining);

  // Date Logic (Same as before)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInCurrentMonth - currentDay);

  const dailyLimit = (remaining / daysLeft).toFixed(0);

  // --- ACTIONS ---
  const addTransaction = (newTxn) => {
    setTransactions([newTxn, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(txn => txn.id !== id));
  };

  return (
    <BudgetContext.Provider value={{
      budget, setBudget,
      savingsGoal, setSavingsGoal, // 👈 Export kiya
      transactions,
      totalSpent,
      remaining, // Ab ye "Spendable Balance" hai
      totalActualSavings,
      daysLeft,
      dailyLimit,
      addTransaction,
      deleteTransaction
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);