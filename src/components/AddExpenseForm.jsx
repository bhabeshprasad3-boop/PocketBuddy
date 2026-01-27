import React, { useState } from 'react';
import { IoClose, IoFastFood, IoShirt, IoBus, IoGameController, IoWallet, IoCart, IoFitness, IoBook, IoReceipt, IoGift } from "react-icons/io5";
import { useBudget } from '../context/BudgetContext';


const categories = [
  { id: 'Food', icon: <IoFastFood />, label: 'Street Food', color: 'bg-orange-500' },
  { id: 'Grocery', icon: <IoCart />, label: 'Grocery', color: 'bg-green-500' },
  { id: 'Travel', icon: <IoBus />, label: 'Travel/Fuel', color: 'bg-blue-500' },
  { id: 'Shopping', icon: <IoShirt />, label: 'Shopping', color: 'bg-purple-500' },
  { id: 'Bills', icon: <IoReceipt />, label: 'Recharge/Bills', color: 'bg-yellow-500' },
  { id: 'Fun', icon: <IoGameController />, label: 'Movies/Fun', color: 'bg-pink-500' },
  { id: 'Health', icon: <IoFitness />, label: 'Gym/Meds', color: 'bg-red-500' },
  { id: 'Education', icon: <IoBook />, label: 'Books/Xerox', color: 'bg-indigo-500' },
  { id: 'Gifts', icon: <IoGift />, label: 'Gifts/Help', color: 'bg-rose-500' },
  { id: 'Other', icon: <IoWallet />, label: 'Other', color: 'bg-gray-500' },
];

const AddExpenseForm = ({ isOpen, onClose }) => {
  const { addTransaction } = useBudget();
  
  // State: Sirf Amount aur Category chahiye ab
  const [amount, setAmount] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('Food'); // Default selection

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation: Sirf Amount check karo
    if (!amount) return alert("Paisa toh daalo bhai!");

    // Selected Category ka pura data dhundo (Label nikaalne ke liye)
    const categoryObj = categories.find(c => c.id === selectedCatId);

    const newTxn = {
      id: Date.now(),
      title: categoryObj.label, // ✨ MAGIC: Title apne aap Category ka naam ban jayega
      amount: Number(amount),
      category: categoryObj.id,
      date: new Date().toISOString(),
      type: 'expense'
    };

    addTransaction(newTxn);
    
    // Reset
    setAmount('');
    setSelectedCatId('Food'); // Reset to default
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      
      <div className="bg-neutral-900 w-full max-w-md rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">Quick Add</h2>
          <button onClick={onClose} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-neutral-400">
            <IoClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. AMOUNT INPUT (Sabse Bada) */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-500">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-neutral-800 text-white text-4xl font-black py-6 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 text-center placeholder-neutral-700"
                placeholder="0"
                autoFocus
              />
            </div>
            <p className="text-center text-xs text-neutral-500 mt-2 font-medium">Enter Amount & Pick Category</p>
          </div>

          {/* 2. CATEGORY GRID (Buttons) */}
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group ${
                  selectedCatId === cat.id 
                    ? `${cat.color} border-transparent text-white shadow-lg scale-[1.02]` 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                <div className={`text-xl p-2 rounded-full ${selectedCatId === cat.id ? 'bg-white/20' : 'bg-black/20'}`}>
                  {cat.icon}
                </div>
                <span className={`font-bold text-sm ${selectedCatId === cat.id ? 'text-white' : 'group-hover:text-neutral-200'}`}>
                    {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* 3. SUBMIT BUTTON */}
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-4 rounded-2xl text-xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95">
            DONE
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;