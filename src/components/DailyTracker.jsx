import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { IoCalendarOutline, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const DailyTracker = ({ isDarkMode }) => {
  const { transactions, dailyLimit, budget } = useBudget();
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'monthly', 'yearly'

  // Colors Logic
  const theme = {
    bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white',
    border: isDarkMode ? 'border-white/5' : 'border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500',
    hover: isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    // Button Styles
    tabContainer: isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200',
    activeTab: isDarkMode ? 'bg-emerald-500 text-white shadow-lg' : 'bg-black text-white shadow-lg',
    inactiveTab: isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black',
  };

  // Logic: Group Data
  const groupedData = transactions.reduce((acc, txn) => {
    const dateObj = new Date(txn.date);
    let key, label, sortTime;

    if (viewMode === 'daily') {
      key = dateObj.toLocaleDateString('en-GB'); 
      label = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      sortTime = dateObj.getTime();
    } else if (viewMode === 'monthly') {
      key = `${dateObj.getMonth()}-${dateObj.getFullYear()}`;
      label = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      sortTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime();
    } else {
      key = dateObj.getFullYear().toString();
      label = key;
      sortTime = new Date(dateObj.getFullYear(), 0, 1).getTime();
    }

    if (!acc[key]) acc[key] = { amount: 0, label, sortTime };
    acc[key].amount += txn.amount;
    return acc;
  }, {});

  const sortedData = Object.values(groupedData).sort((a, b) => b.sortTime - a.sortTime).slice(0, 5);

  const getLimit = () => {
    if (viewMode === 'daily') return Number(dailyLimit);
    if (viewMode === 'monthly') return Number(budget);
    if (viewMode === 'yearly') return Number(budget) * 12;
    return 0;
  };
  const currentLimit = getLimit();

  return (
    <div className={`p-6 rounded-[2rem] border mb-6 relative overflow-hidden transition-all duration-300 ${theme.bg} ${theme.border}`}>
      
      {/* HEADER SECTION */}
      <div className='flex flex-col gap-4 mb-6'>
        <div className='flex justify-between items-center'>
          <h3 className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wider ${theme.subText}`}>
             <IoCalendarOutline /> Performance
          </h3>
        </div>

        {/* 👇 YE RAHE BUTTONS */}
        <div className={`flex p-1 rounded-xl border ${theme.tabContainer}`}>
          {['daily', 'monthly', 'yearly'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all duration-300 ${
                viewMode === mode ? theme.activeTab : theme.inactiveTab
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* LIST SECTION */}
      <div className='space-y-3'>
        {sortedData.length === 0 ? (
           <div className={`text-center py-8 opacity-40 text-xs font-medium ${theme.subText}`}>
              No transactions for {viewMode} view
           </div>
        ) : (
          sortedData.map((item, index) => {
            const spent = item.amount;
            const saved = currentLimit - spent;
            const isSaved = saved >= 0;

            return (
              <div key={index} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${theme.border} ${theme.hover}`}>
                <div className='flex items-center gap-3'>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isSaved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {isSaved ? <IoCheckmarkCircle /> : <IoCloseCircle />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme.text}`}>{item.label}</p>
                    <p className={`text-[10px] font-medium ${theme.subText}`}>Spent: ₹{spent}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className={`text-sm font-bold ${isSaved ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isSaved ? `+₹${saved}` : `-₹${Math.abs(saved)}`}
                  </p>
                  <p className='text-[9px] font-bold uppercase text-neutral-500 tracking-wide'>
                    {isSaved ? 'Saved' : 'Over'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DailyTracker;