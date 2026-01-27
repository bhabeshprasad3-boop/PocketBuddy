import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { toast } from 'react-hot-toast';
import { IoWallet, IoWarning, IoPencil, IoCheckmark, IoCalendar, IoAlertCircle, IoLockClosed } from "react-icons/io5";

const BalanceCard = ({ isDarkMode }) => {
  const { budget, setBudget, savingsGoal, setSavingsGoal, remaining, dailyLimit, daysLeft } = useBudget();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  const [newSavingsGoal, setNewSavingsGoal] = useState(savingsGoal);

  // Colors Logic
  const spendableBudget = budget - savingsGoal;
  const percentageLeft = spendableBudget > 0 ? (remaining / spendableBudget) * 100 : 0;

  const getStatusStyles = () => {
    if (remaining < 0) return {
      border: 'border-rose-500/50',
      shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)]' : 'shadow-xl shadow-rose-500/20',
      text: 'text-rose-500',
      bg: isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50',
      bar: 'bg-rose-500'
    };
    if (percentageLeft >= 75) return {
      border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-500/50',
      shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)]' : 'shadow-xl shadow-emerald-500/20',
      text: 'text-emerald-500',
      bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
      bar: 'bg-emerald-500'
    };
    if (percentageLeft >= 50) return {
      border: isDarkMode ? 'border-cyan-500/30' : 'border-cyan-500/50',
      shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(6,182,212,0.4)]' : 'shadow-xl shadow-cyan-500/20',
      text: 'text-cyan-500',
      bg: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50',
      bar: 'bg-cyan-400'
    };
    if (percentageLeft >= 25) return {
      border: isDarkMode ? 'border-amber-500/30' : 'border-amber-500/50',
      shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.4)]' : 'shadow-xl shadow-amber-500/20',
      text: 'text-amber-500',
      bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50',
      bar: 'bg-amber-400'
    };
    return {
      border: isDarkMode ? 'border-orange-500/40' : 'border-orange-500/50',
      shadow: isDarkMode ? 'shadow-[0_0_50px_-12px_rgba(249,115,22,0.5)]' : 'shadow-xl shadow-orange-500/20',
      text: 'text-orange-500',
      bg: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50',
      bar: 'bg-orange-500'
    };
  };

  const status = getStatusStyles();
  
  // Theme Helpers
  const cardBg = isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white';
  const mainText = isDarkMode ? 'text-white' : 'text-gray-900';
  const subText = isDarkMode ? 'text-neutral-500' : 'text-gray-500';
  const inputBg = isDarkMode ? 'bg-white/5' : 'bg-gray-100';
  const cardBorder = isDarkMode ? 'border-white/5' : 'border-gray-200';

  const handleSaveBudget = () => {
    const incomeAmount = Number(newBudget);
    const lockAmount = Number(newSavingsGoal);

    if (lockAmount > incomeAmount) {
      toast.error("Insufficient Funds!", { style: { borderRadius: '12px', background: isDarkMode ? '#171717' : '#fff', color: isDarkMode ? '#fff' : '#000' } });
      return;
    }
    setBudget(incomeAmount);
    setSavingsGoal(lockAmount);
    setIsEditing(false);
    toast.success("Wallet Updated!", { style: { borderRadius: '12px', background: isDarkMode ? '#171717' : '#fff', color: isDarkMode ? '#fff' : '#000' } });
  };

  return (
    <div className={`p-8 rounded-[2rem] relative overflow-hidden transition-all duration-700 ${cardBg} border ${status.border} ${status.shadow}`}>
      
      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-6'>
          <div className='flex items-center gap-3'>
             <div className={`p-3 rounded-2xl ${status.bg}`}>
                {remaining < 0 ? <IoAlertCircle className={status.text} size={24}/> : <IoWallet className={status.text} size={24}/>}
             </div>
             <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${subText}`}>
                   {isEditing ? "Configuration" : "Available Balance"}
                </p>
                {remaining < 0 && <p className='text-[10px] text-rose-500 font-bold'>OVERDRAFT DETECTED</p>}
             </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSaveBudget() : setIsEditing(true)}
            className={`${inputBg} p-3 rounded-full transition-all border ${cardBorder} active:scale-95`}
          >
            {isEditing ? <IoCheckmark size={20}/> : <IoPencil size={18}/>}
          </button>
        </div>

        {isEditing ? (
          <div className='space-y-6 animate-fade-in'>
            <div className={`${inputBg} p-4 rounded-2xl border ${cardBorder}`}>
              <label className={`text-[10px] uppercase font-bold block mb-2 ${subText}`}>Total Income</label>
              <div className='flex items-center gap-2'>
                <span className={`text-2xl ${subText}`}>₹</span>
                <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className={`text-3xl font-bold bg-transparent outline-none w-full ${mainText}`} />
              </div>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200'}`}>
              <label className='text-[10px] text-emerald-500 uppercase font-bold block mb-2 flex items-center gap-1'><IoLockClosed /> Auto-Save Amount</label>
              <div className='flex items-center gap-2'>
                <span className='text-2xl text-emerald-500/50'>₹</span>
                <input type="number" value={newSavingsGoal} onChange={(e) => setNewSavingsGoal(e.target.value)} className="text-3xl font-bold bg-transparent outline-none w-full text-emerald-500" />
              </div>
            </div>
          </div>
        ) : (
          <div>
             <h2 className={`text-6xl font-extrabold tracking-tight mb-2 ${mainText}`}>
               {remaining < 0 ? `-₹${Math.abs(remaining)}` : `₹${remaining}`}
             </h2>
             <div className={`w-full h-1.5 rounded-full overflow-hidden mt-6 mb-2 ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                <div className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${status.bar}`} style={{ width: `${Math.max(0, Math.min(100, percentageLeft))}%` }}></div>
             </div>
             <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest ${subText}`}>
                <span>0%</span><span>50%</span><span>100%</span>
             </div>
          </div>
        )}
        
        {!isEditing && (
          <div className='flex gap-4 mt-8'>
             {remaining >= 0 && (
               <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputBg} ${cardBorder}`}>
                  <div className='bg-amber-500/20 p-2 rounded-lg text-amber-500'><IoWarning size={14}/></div>
                  <div><p className={`text-[10px] uppercase font-bold ${subText}`}>Daily Limit</p><p className={`text-sm font-bold ${mainText}`}>₹{dailyLimit}<span className={`text-xs ${subText}`}>/day</span></p></div>
               </div>
             )}
             <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputBg} ${cardBorder}`}>
                <div className='bg-blue-500/20 p-2 rounded-lg text-blue-500'><IoCalendar size={14}/></div>
                <div><p className={`text-[10px] uppercase font-bold ${subText}`}>Days Left</p><p className={`text-sm font-bold ${mainText}`}>{daysLeft} <span className={`text-xs ${subText}`}>days</span></p></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;