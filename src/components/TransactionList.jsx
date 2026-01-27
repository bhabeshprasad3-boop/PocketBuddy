import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { toast } from 'react-hot-toast';
import { IoTrendingDown, IoTrashBin } from "react-icons/io5";

const TransactionList = ({ isDarkMode }) => {
  const { transactions, deleteTransaction } = useBudget();

  const theme = {
    bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500',
    border: isDarkMode ? 'border-white/5' : 'border-gray-200',
    iconBg: isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50',
    hoverBg: isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    headerIconBg: isDarkMode ? 'bg-white/5' : 'bg-gray-100'
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'Food': return '🍔';
      case 'Grocery': return '🥦';
      case 'Travel': return '🚕';
      case 'Shopping': return '🛍️';
      case 'Bills': return '🧾';
      case 'Fun': return '🍿';
      case 'Health': return '💊';
      case 'Education': return '📚';
      case 'Gifts': return '🎁';
      default: return '💸';
    }
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border h-full relative overflow-hidden ${theme.bg} ${theme.border}`}>
      
      <h3 className={`text-lg font-bold mb-8 flex items-center gap-3 ${theme.text}`}>
        <div className={`p-2 rounded-full border ${theme.headerIconBg} ${theme.border}`}>
           <IoTrendingDown className={theme.subText} size={16}/> 
        </div>
        Recent Activity
      </h3>
      
      <div className='space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2'>
        {transactions.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 opacity-30'>
             <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl grayscale ${theme.headerIconBg}`}>💤</div>
             <p className={`text-sm font-medium ${theme.subText}`}>No transactions yet</p>
          </div>
        ) : (
          transactions.map((txn) => (
             <div key={txn.id} className={`group flex justify-between items-center p-4 rounded-2xl transition-all border border-transparent cursor-default ${theme.hoverBg}`}>
              <div className='flex items-center gap-4'>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border group-hover:scale-110 transition-transform ${theme.iconBg} ${theme.border}`}>
                  {getCategoryEmoji(txn.category)}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${theme.text}`}>{txn.title}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${theme.subText}`}>
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                  <span className={`font-bold text-sm ${theme.text}`}>-₹{txn.amount}</span>
                  <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       deleteTransaction(txn.id);
                       toast.success('Deleted', { style: { background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }});
                    }}
                    className="text-neutral-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <IoTrashBin size={14} />
                  </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;