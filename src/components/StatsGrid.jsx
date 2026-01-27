import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { IoArrowDown, IoLockClosed } from "react-icons/io5";

const StatsGrid = ({ isDarkMode }) => {
  const { totalSpent, savingsGoal, remaining } = useBudget();

  const theme = {
    bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500',
    border: isDarkMode ? 'border-white/5' : 'border-gray-200',
    secureBorder: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200'
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Expense Card */}
      <div className={`p-6 rounded-3xl border relative group overflow-hidden ${theme.bg} ${theme.border} ${remaining < 0 ? 'border-rose-500/30' : ''}`}>
         <div className='relative z-10'>
            <div className='flex justify-between items-center mb-4'>
               <div className='p-2 bg-rose-500/10 text-rose-500 rounded-lg'><IoArrowDown size={18}/></div>
               <span className={`text-[10px] font-bold uppercase ${theme.subText}`}>This Month</span>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${theme.text}`}>₹{totalSpent}</h3>
            <p className={`text-xs font-medium ${theme.subText}`}>Total Spent</p>
         </div>
      </div>

      {/* Wallet Card */}
      <div className={`p-6 rounded-3xl border relative group overflow-hidden ${theme.bg} ${theme.secureBorder}`}>
         <div className='relative z-10'>
            <div className='flex justify-between items-center mb-4'>
               <div className='p-2 bg-emerald-500/10 text-emerald-500 rounded-lg'><IoLockClosed size={18}/></div>
               <span className='text-[10px] font-bold text-emerald-500/50 uppercase'>SECURE</span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-500 mb-1">₹{savingsGoal}</h3>
            <p className={`text-xs font-medium ${theme.subText}`}>Saving Wallet</p>
         </div>
      </div>
    </div>
  );
};

export default StatsGrid;