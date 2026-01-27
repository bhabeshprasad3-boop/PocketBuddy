import React from 'react';
import { IoMoon, IoSunny } from "react-icons/io5";

const Header = ({ isDarkMode, toggleTheme }) => {
  // Theme Styles
  const headerBlur = isDarkMode ? 'bg-[#050505]/80' : 'bg-white/80';
  const borderColor = isDarkMode ? 'border-white/5' : 'border-gray-200';
  const iconBg = isDarkMode ? 'bg-white/5' : 'bg-gray-100';
  const subText = isDarkMode ? 'text-neutral-500' : 'text-gray-500';

  return (
    <div className={`${headerBlur} backdrop-blur-md p-6 border-b ${borderColor} sticky top-0 z-30 transition-colors duration-500`}>
      <div className='max-w-5xl mx-auto flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-extrabold tracking-tight'>
            Pocket<span className='text-emerald-500'>Buddy</span>.
          </h1>
          <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${subText}`}>
            Premium Tracker
          </p>
        </div>
        
        <button 
          onClick={toggleTheme}
          className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg transition-all hover:scale-110 active:scale-95 ${iconBg} ${borderColor}`}
        >
           {isDarkMode ? <IoSunny className="text-yellow-400" /> : <IoMoon className="text-indigo-600" />}
        </button>
      </div>
    </div>
  );
};

export default Header;