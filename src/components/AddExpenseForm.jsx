import React, { useState } from 'react';
import { IoClose, IoFastFood, IoShirt, IoBus, IoGameController, IoWallet, IoCart, IoFitness, IoBook, IoReceipt, IoGift, IoMic } from "react-icons/io5"; // 👈 Added IoMic
import { useBudget } from '../context/BudgetContext';
import { toast } from 'react-hot-toast';

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

const AddExpenseForm = ({ isOpen, onClose, isDarkMode }) => {
  const { addTransaction } = useBudget();
  const [amount, setAmount] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('Food');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  // 🎤 VOICE LOGIC
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      return alert("Browser not supported for Voice. Use Chrome.");
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English
    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Heard:", transcript);
      
      // Magic Regex to find numbers (e.g., "50 rupees")
      const numberMatch = transcript.match(/(\d+)/);
      if (numberMatch) {
        setAmount(numberMatch[0]);
        toast.success(`Heard: "₹${numberMatch[0]}"`);
      } else {
        toast.error("Couldn't hear an amount. Try again.");
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice Error. Try again.");
    };

    recognition.start();
  };

  const theme = {
    modal: isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-100',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    inputBg: isDarkMode ? 'bg-neutral-800' : 'bg-gray-100',
    inputTxt: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-neutral-500' : 'text-gray-500',
    close: isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500',
    unselected: isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    const cat = categories.find(c => c.id === selectedCatId);
    addTransaction({ id: Date.now(), title: cat.label, amount: Number(amount), category: cat.id, date: new Date().toISOString() });
    setAmount(''); setSelectedCatId('Food'); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-slide-up ${theme.modal}`}>
        <div className={`flex justify-between items-center p-6 border-b ${isDarkMode?'border-neutral-800':'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${theme.text}`}>Quick Add</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${theme.close}`}><IoClose size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-500">₹</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full text-4xl font-black py-6 pl-12 pr-14 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 text-center ${theme.inputBg} ${theme.inputTxt}`} placeholder="0" autoFocus/>
              
              {/* 🎤 MIC BUTTON */}
              <button type="button" onClick={startListening} className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-500'}`}>
                 <IoMic size={20} />
              </button>
            </div>
            <p className={`text-center text-xs mt-2 font-medium ${theme.subText}`}>{isListening ? "Listening... Speak amount..." : "Tap Mic & say '50 rupees'"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setSelectedCatId(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${selectedCatId === cat.id ? `${cat.color} border-transparent text-white shadow-lg` : theme.unselected}`}>
                <div className={`text-xl p-2 rounded-full ${selectedCatId===cat.id?'bg-white/20':'bg-black/10'}`}>{cat.icon}</div><span className="font-bold text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl text-xl shadow-lg active:scale-95">DONE</button>
        </form>
      </div>
    </div>
  );
};
export default AddExpenseForm;