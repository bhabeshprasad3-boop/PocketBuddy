import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useBudget } from '../context/BudgetContext';

const ExpenseChart = ({ isDarkMode }) => {
  const { totalSpent, remaining } = useBudget();

  const data = [
    { name: 'Spent', value: totalSpent },
    { name: 'Available', value: Math.max(0, remaining) }, 
  ];

  const COLORS = ['#ef4444', '#10b981'];

  // 👇 FIX: Agar kharcha 0 hai, toh Padding 0 rakho taaki Gap na dikhe
  const paddingValue = totalSpent > 0 ? 5 : 0;

  const theme = {
    title: isDarkMode ? 'text-neutral-400' : 'text-gray-400',
    centerLabel: isDarkMode ? 'text-neutral-500' : 'text-gray-400',
    centerValue: isDarkMode ? 'text-white' : 'text-gray-900',
    legendText: isDarkMode ? '#a3a3a3' : '#374151',
    tooltipBg: isDarkMode ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: isDarkMode ? '1px solid #10b981' : '1px solid #e5e7eb',
    tooltipText: isDarkMode ? '#fff' : '#111827',
  };

  return (
    <div className="w-full h-[300px] flex flex-col items-center justify-center relative">
      <h3 className={`font-bold mb-2 uppercase tracking-widest text-xs ${theme.title}`}>
        Spendable Analysis
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={paddingValue} // 👈 Yahan change kiya hai
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.tooltipBg,
              border: theme.tooltipBorder,
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
              color: theme.tooltipText,
              padding: '12px'
            }}
            itemStyle={{ color: theme.tooltipText, fontWeight: 'bold' }}
            cursor={false}
          />
          
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span style={{ color: theme.legendText }} className="font-medium ml-1 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 text-center pointer-events-none">
         <p className={`text-[10px] uppercase font-bold ${theme.centerLabel}`}>Available</p>
         <p className={`text-xl font-black ${theme.centerValue}`}>₹{Math.max(0, remaining)}</p>
      </div>
    </div>
  );
};

export default ExpenseChart;