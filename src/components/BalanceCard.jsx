import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency, calculatePercentage } from '../utils/helpers';
import { toast } from 'react-hot-toast';
import { IoWallet, IoWarning, IoPencil, IoCheckmark, IoCalendar, IoAlertCircle, IoLockClosed, IoRefresh } from "react-icons/io5";

const BalanceCard = ({ isDarkMode }) => {
  const { budget, setBudget, savingsGoal, setSavingsGoal, remaining, dailyLimit, daysLeft, resetWallet } = useBudget();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  const [newSavingsGoal, setNewSavingsGoal] = useState(savingsGoal);

  // Health Logic
  const spendableBudget = budget - savingsGoal;
  const percentageLeft = calculatePercentage(remaining, spendableBudget);

  const getStatusStyles = () => {
    if (remaining < 0) return { border: 'border-rose-500/50', shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)]' : 'shadow-xl shadow-rose-500/20', text: 'text-rose-500', bg: isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50', bar: 'bg-rose-500' };
    if (percentageLeft >= 75) return { border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-500/50', shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)]' : 'shadow-xl shadow-emerald-500/20', text: 'text-emerald-500', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', bar: 'bg-emerald-500' };
    if (percentageLeft >= 50) return { border: isDarkMode ? 'border-cyan-500/30' : 'border-cyan-500/50', shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(6,182,212,0.4)]' : 'shadow-xl shadow-cyan-500/20', text: 'text-cyan-500', bg: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50', bar: 'bg-cyan-400' };
    if (percentageLeft >= 25) return { border: isDarkMode ? 'border-amber-500/30' : 'border-amber-500/50', shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.4)]' : 'shadow-xl shadow-amber-500/20', text: 'text-amber-500', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50', bar: 'bg-amber-400' };
    return { border: isDarkMode ? 'border-orange-500/40' : 'border-orange-500/50', shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(249,115,22,0.5)]' : 'shadow-xl shadow-orange-500/20', text: 'text-orange-500', bg: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50', bar: 'bg-orange-500' };
  };

  const status = getStatusStyles();
  const theme = { bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white', text: isDarkMode ? 'text-white' : 'text-gray-900', subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500', inputBg: isDarkMode ? 'bg-white/5' : 'bg-gray-100', border: isDarkMode ? 'border-white/5' : 'border-gray-200' };

  const handleSave = () => {
    if (Number(newSavingsGoal) > Number(newBudget)) return toast.error("Insufficient Funds!");
    setBudget(Number(newBudget));
    setSavingsGoal(Number(newSavingsGoal));
    setIsEditing(false);
    toast.success("Wallet Updated!");
  };

  const handleReset = () => {
    toast((t) => (
      <div className={`flex flex-col gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <p className='font-bold text-sm'>Delete Everything?</p>
        <div className='flex gap-2 mt-2'>
          <button onClick={() => toast.dismiss(t.id)} className='flex-1 py-1 px-3 text-xs bg-gray-500/20 rounded'>Cancel</button>
          <button onClick={() => { resetWallet(); setNewBudget(0); setNewSavingsGoal(0); setIsEditing(false); toast.dismiss(t.id); toast.success("Reset Complete 🗑️"); }} className='flex-1 py-1 px-3 text-xs bg-rose-500 text-white rounded'>Delete</button>
        </div>
      </div>
    ));
  };

  return (
    <div className={`p-8 rounded-[2rem] relative overflow-hidden transition-all duration-700 ${theme.bg} border ${status.border} ${status.shadow}`}>
      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-6'>
          <div className='flex items-center gap-3'>
             <div className={`p-3 rounded-2xl ${status.bg}`}>{remaining < 0 ? <IoAlertCircle className={status.text} size={24}/> : <IoWallet className={status.text} size={24}/>}</div>
             <div><p className={`text-xs font-bold uppercase tracking-wider ${theme.subText}`}>{isEditing ? "Configuration" : "Available Balance"}</p>{remaining < 0 && <p className='text-[10px] text-rose-500 font-bold'>OVERDRAFT</p>}</div>
          </div>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`${theme.inputBg} p-3 rounded-full border ${theme.border}`}>{isEditing ? <IoCheckmark size={20}/> : <IoPencil size={18}/>}</button>
        </div>

        {isEditing ? (
          <div className='space-y-6 animate-fade-in'>
            <div className={`${theme.inputBg} p-4 rounded-2xl border ${theme.border}`}>
              <label className={`text-[10px] uppercase font-bold block mb-2 ${theme.subText}`}>Total Income</label>
              <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className={`text-3xl font-bold bg-transparent outline-none w-full ${theme.text}`} />
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200'}`}>
              <label className='text-[10px] text-emerald-500 uppercase font-bold block mb-2'>Auto-Save Amount</label>
              <input type="number" value={newSavingsGoal} onChange={(e) => setNewSavingsGoal(e.target.value)} className="text-3xl font-bold bg-transparent outline-none w-full text-emerald-500" />
            </div>
            <button onClick={handleReset} className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-rose-50 text-rose-600'}`}><IoRefresh size={16} /> Reset All Data</button>
          </div>
        ) : (
          <div>
             <h2 className={`text-6xl font-extrabold tracking-tight mb-2 ${theme.text}`}>{remaining < 0 ? `-${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}</h2>
             <div className={`w-full h-1.5 rounded-full overflow-hidden mt-6 mb-2 ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}><div className={`h-full transition-all duration-1000 ease-out ${status.bar}`} style={{ width: `${percentageLeft}%` }}></div></div>
          </div>
        )}
        
        {!isEditing && remaining >= 0 && (
          <div className='flex gap-4 mt-8'>
             <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme.inputBg} ${theme.border}`}><div className='bg-amber-500/20 p-2 rounded-lg text-amber-500'><IoWarning size={14}/></div><div><p className={`text-[10px] uppercase font-bold ${theme.subText}`}>Daily Limit</p><p className={`text-sm font-bold ${theme.text}`}>₹{dailyLimit}<span className='text-xs'>/day</span></p></div></div>
             <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme.inputBg} ${theme.border}`}><div className='bg-blue-500/20 p-2 rounded-lg text-blue-500'><IoCalendar size={14}/></div><div><p className={`text-[10px] uppercase font-bold ${theme.subText}`}>Days Left</p><p className={`text-sm font-bold ${theme.text}`}>{daysLeft} days</p></div></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BalanceCard;