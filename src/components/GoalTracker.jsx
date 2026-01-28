import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { IoTrophy, IoAdd, IoPencil, IoRocket, IoCheckmark, IoRefresh, IoAlertCircle, IoCalendar, IoTime, IoTrendingUp } from "react-icons/io5";
import { toast } from 'react-hot-toast';

const GoalTracker = ({ isDarkMode }) => {
  const { goal, updateGoal, addToGoal, remaining } = useBudget(); // 'remaining' (Available Balance) chahiye suggestion ke liye
  
  const [isEditing, setIsEditing] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  
  // Edit States
  const [tempTitle, setTempTitle] = useState(goal.title);
  const [tempTarget, setTempTarget] = useState(goal.targetAmount);
  const [tempDate, setTempDate] = useState(goal.targetDate); // 📅 Target Date State

  // Colors
  const theme = {
    bg: isDarkMode ? 'bg-[#0F0F0F]' : 'bg-white',
    border: isDarkMode ? 'border-white/5' : 'border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500',
    inputBg: isDarkMode ? 'bg-white/5' : 'bg-gray-100',
    barBg: isDarkMode ? 'bg-neutral-800' : 'bg-gray-200',
    historyItem: isDarkMode ? 'hover:bg-white/5 border-white/5' : 'hover:bg-gray-50 border-gray-100'
  };

  const percentage = Math.min(100, Math.max(0, (goal.savedAmount / goal.targetAmount) * 100));

  // --- 🧠 SMART CALCULATIONS ---
  const calculateSuggestion = () => {
    if (!goal.targetDate || goal.savedAmount >= goal.targetAmount) return null;

    const today = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = Math.abs(target - today);
    const daysLeftForGoal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (daysLeftForGoal <= 0) return { text: "Date passed! Update target date.", color: "text-rose-500" };

    const amountNeeded = goal.targetAmount - goal.savedAmount;
    const dailyNeed = amountNeeded / daysLeftForGoal;

    // Suggestion Logic based on Available Income (Remaining)
    // Assume monthly remaining is available for 30 days roughly
    const dailyAvailable = remaining > 0 ? (remaining / 30) : 0; 

    if (dailyNeed > remaining) {
      return { 
        text: `⚠️ Impossible! You need ₹${dailyNeed.toFixed(0)}/day, but you only have ₹${remaining} total.`, 
        color: "text-rose-500",
        days: daysLeftForGoal
      };
    } else if (dailyNeed > dailyAvailable) {
       return { 
        text: `💪 Tough! Save ₹${dailyNeed.toFixed(0)} daily. (Tight budget)`, 
        color: "text-amber-500",
        days: daysLeftForGoal
      };
    } else {
       return { 
        text: `✅ Easy! Just save ₹${dailyNeed.toFixed(0)} daily.`, 
        color: "text-emerald-500",
        days: daysLeftForGoal
      };
    }
  };

  const suggestion = calculateSuggestion();

  // Handlers
  const handleSaveGoal = () => {
    updateGoal({ 
      ...goal, 
      title: tempTitle, 
      targetAmount: Number(tempTarget),
      targetDate: tempDate 
    });
    setIsEditing(false);
    toast.success("Goal Updated! 🎯");
  };

  const handleAddMoney = (e) => {
    e.preventDefault();
    if (!addAmount) return;
    addToGoal(Number(addAmount));
    setAddAmount('');
    toast.success(`Added ₹${addAmount} to Goal! 🚀`);
  };

  const handleResetProgress = () => {
    toast((t) => (
      <div className={`flex flex-col gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <p className='font-bold text-sm'>Reset Progress?</p>
        <div className='flex gap-2 mt-2'>
          <button onClick={() => toast.dismiss(t.id)} className='flex-1 py-1 px-3 text-xs bg-gray-500/20 rounded'>Cancel</button>
          <button onClick={() => {
              updateGoal({ ...goal, savedAmount: 0, history: [] }); // History bhi clear
              setIsEditing(false);
              toast.dismiss(t.id);
          }} className='flex-1 py-1 px-3 text-xs bg-rose-500 text-white rounded'>Reset</button>
        </div>
      </div>
    ));
  };

  return (
    <div className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all ${theme.bg} ${theme.border}`}>
      
      <div className='absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none'></div>

      {/* HEADER */}
      <div className='flex justify-between items-start mb-6 relative z-10'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-purple-500/20 text-purple-400 rounded-2xl'>
            <IoTrophy size={24} />
          </div>
          <div className='flex flex-col'>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.subText}`}>My Target</p>
            {isEditing ? (
              <input 
                type="text" 
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className={`bg-transparent border-b border-purple-500 outline-none w-32 font-bold ${theme.text}`}
              />
            ) : (
              <h3 className={`text-xl font-extrabold ${theme.text}`}>{goal.title}</h3>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => isEditing ? handleSaveGoal() : setIsEditing(true)}
          className={`p-2 rounded-full border transition-all ${theme.inputBg} ${theme.border} ${theme.subText}`}
        >
          {isEditing ? <IoCheckmark className="text-emerald-500"/> : <IoPencil />}
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className='mb-4 relative z-10'>
        <div className='flex justify-between text-xs font-bold mb-2'>
           <span className='text-purple-400'>₹{goal.savedAmount.toLocaleString()}</span>
           <span className={theme.subText}>{percentage.toFixed(0)}%</span>
           <span className={theme.subText}>Target: {isEditing ? (
             <input type="number" value={tempTarget} onChange={(e) => setTempTarget(e.target.value)} className={`w-16 bg-transparent border-b border-purple-500 outline-none text-right ${theme.text}`} />
           ) : `₹${goal.targetAmount.toLocaleString()}`}</span>
        </div>

        <div className={`w-full h-4 rounded-full overflow-visible relative ${theme.barBg}`}>
           <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out relative" style={{ width: `${percentage}%` }}>
             <div className='absolute -right-3 -top-2.5 bg-white text-purple-600 p-1 rounded-full shadow-lg transform rotate-45 border-2 border-purple-100 z-20'>
                <IoRocket size={12} />
             </div>
           </div>
        </div>
      </div>

      {/* 🧠 SMART SUGGESTION BOX (Only in View Mode) */}
      {!isEditing && suggestion && (
        <div className={`mb-6 p-3 rounded-xl border flex items-start gap-3 bg-opacity-50 ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
           <div className='p-2 bg-purple-500/10 text-purple-400 rounded-full mt-0.5'>
              <IoTrendingUp size={14} />
           </div>
           <div>
              <p className={`text-xs font-bold ${suggestion.color}`}>{suggestion.text}</p>
              <p className={`text-[10px] ${theme.subText}`}>Target Date: {new Date(goal.targetDate).toLocaleDateString()} ({suggestion.days} days left)</p>
           </div>
        </div>
      )}

      {/* INPUTS AREA */}
      {isEditing ? (
        <div className='space-y-4'>
           {/* Date Picker Input */}
           <div>
              <label className={`text-[10px] uppercase font-bold block mb-1 ${theme.subText}`}>Achieve By Date</label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${theme.inputBg} ${theme.border}`}>
                 <IoCalendar className="text-purple-500"/>
                 <input 
                   type="date" 
                   value={tempDate}
                   onChange={(e) => setTempDate(e.target.value)}
                   className={`bg-transparent outline-none w-full text-xs font-bold ${theme.text} [color-scheme:${isDarkMode ? 'dark' : 'light'}]`}
                 />
              </div>
           </div>
           
           <button onClick={handleResetProgress} className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase text-[10px] tracking-widest ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-rose-50 text-rose-600'}`}>
             <IoRefresh size={14} /> Reset Progress
           </button>
        </div>
      ) : (
        <form onSubmit={handleAddMoney} className='flex gap-2 relative z-10 mb-6'>
          <div className='relative flex-1'>
             <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${theme.subText}`}>₹</span>
             <input type="number" placeholder="Add savings..." value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className={`w-full py-3 pl-7 pr-3 rounded-xl text-sm font-bold outline-none border transition-colors focus:border-purple-500 ${theme.inputBg} ${theme.border} ${theme.text}`} />
          </div>
          <button type="submit" className='bg-gradient-to-tr from-purple-600 to-pink-600 text-white p-3 rounded-xl shadow-lg active:scale-95'>
            <IoAdd size={20} />
          </button>
        </form>
      )}

      {/* 📜 HISTORY LIST (Last 3 entries) */}
      {!isEditing && goal.history && goal.history.length > 0 && (
        <div className='border-t pt-4 border-dashed border-gray-700/50'>
           <p className={`text-[10px] font-bold uppercase mb-3 ${theme.subText}`}>Recent Contributions</p>
           <div className='space-y-2'>
              {goal.history.slice(0, 3).map((entry, index) => (
                <div key={index} className={`flex justify-between items-center p-2 rounded-lg border text-xs transition-colors ${theme.historyItem}`}>
                   <div className='flex items-center gap-2'>
                      <IoTime className='text-purple-500 opacity-50'/>
                      <span className={`font-medium ${theme.subText}`}>
                        {/* FULL DATE FORMAT: 28 Jan 2026 */}
                        {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                   </div>
                   <span className='font-bold text-emerald-500'>+₹{entry.amount}</span>
                </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default GoalTracker;