import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { IoAdd } from "react-icons/io5";

// Components
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import StatsGrid from './components/StatsGrid';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import AddExpenseForm from './components/AddExpenseForm';

const App = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('pocketTheme');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem('pocketTheme', JSON.stringify(isDarkMode));
    document.body.style.backgroundColor = isDarkMode ? '#050505' : '#f9fafb';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Layout Styles
  const bgClass = isDarkMode ? 'bg-[#050505]' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/5' : 'border-gray-200';

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${bgClass} ${textClass}`}>
      <Toaster position="top-center" reverseOrder={false} />

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className='max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-6'>
          <BalanceCard isDarkMode={isDarkMode} />
          <StatsGrid isDarkMode={isDarkMode} />
          
          <div className={`p-6 rounded-[2rem] border shadow-xl ${cardBg} ${cardBorder}`}>
             <ExpenseChart isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Right Column */}
        <div className='lg:col-span-1'>
          <TransactionList isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className='fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 border border-white/20'
      >
        <IoAdd size={32} />
      </button>

      <AddExpenseForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default App;