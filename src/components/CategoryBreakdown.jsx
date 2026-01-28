import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { calculatePercentage, formatCurrency } from '../utils/helpers';
import { IoPieChart } from "react-icons/io5";

const CategoryBreakdown = ({ isDarkMode }) => {
  const { transactions } = useBudget();

  // Categories Colors & Icons Map
  const catConfig = {
    Food: { color: 'bg-orange-500', text: 'text-orange-500' },
    Grocery: { color: 'bg-green-500', text: 'text-green-500' },
    Travel: { color: 'bg-blue-500', text: 'text-blue-500' },
    Shopping: { color: 'bg-purple-500', text: 'text-purple-500' },
    Bills: { color: 'bg-yellow-500', text: 'text-yellow-500' },
    Fun: { color: 'bg-pink-500', text: 'text-pink-500' },
    Health: { color: 'bg-red-500', text: 'text-red-500' },
    Education: { color: 'bg-indigo-500', text: 'text-indigo-500' },
    Gifts: { color: 'bg-rose-500', text: 'text-rose-500' },
    Other: { color: 'bg-gray-500', text: 'text-gray-500' },
  };

  // Group by Category
  const grouped = transactions.reduce((acc, txn) => {
    if (!acc[txn.category]) acc[txn.category] = 0;
    acc[txn.category] += txn.amount;
    return acc;
  }, {});

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const sortedCats = Object.entries(grouped).sort((a, b) => b[1] - a[1]); // Sort highest first

  const theme = {
    bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    border: isDarkMode ? 'border-white/5' : 'border-gray-200',
    barBg: isDarkMode ? 'bg-white/10' : 'bg-gray-100'
  };

  if (transactions.length === 0) return null;

  return (
    <div className={`p-6 rounded-[2rem] border mt-6 ${theme.bg} ${theme.border}`}>
      <h3 className={`text-sm font-bold flex items-center gap-2 uppercase mb-4 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>
        <IoPieChart /> Spending Breakdown
      </h3>
      <div className='space-y-4'>
        {sortedCats.map(([cat, amount]) => {
          const percent = calculatePercentage(amount, total);
          const style = catConfig[cat] || catConfig.Other;
          return (
            <div key={cat}>
              <div className='flex justify-between text-xs font-bold mb-1'>
                <span className={`${theme.text}`}>{cat}</span>
                <span className={style.text}>{formatCurrency(amount)} ({percent.toFixed(0)}%)</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${theme.barBg}`}>
                <div className={`h-full rounded-full ${style.color}`} style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CategoryBreakdown;