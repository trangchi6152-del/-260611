import React from 'react';
import { motion } from 'motion/react';
import { Anniversary } from '../types';
import { AnniversaryIcon } from './AnniversaryIcon';
import { Sparkles, Calendar } from 'lucide-react';

interface AnniversaryCardProps {
  anniversary: Anniversary;
  currentDate: Date;
  onSelect: () => void;
  isActive: boolean;
}

export const AnniversaryCard: React.FC<AnniversaryCardProps> = ({
  anniversary,
  currentDate,
  onSelect,
  isActive
}) => {
  const { name, month, day, isDoubleDay, endDay, description, themeColor, bgColor, textColor, iconName } = anniversary;

  // Calculate if it is today
  const isTodayActive = () => {
    const curMonth = currentDate.getMonth() + 1;
    const curDay = currentDate.getDate();
    if (curMonth === month) {
      if (isDoubleDay && endDay) {
        return curDay === day || curDay === endDay;
      }
      return curDay === day;
    }
    return false;
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const curYear = currentDate.getFullYear();
    // Strip hours/mins/secs for accurate date difference
    const curDateOnly = new Date(curYear, currentDate.getMonth(), currentDate.getDate());
    
    let targetDate = new Date(curYear, month - 1, day);
    
    if (targetDate.getTime() < curDateOnly.getTime()) {
      targetDate = new Date(curYear + 1, month - 1, day);
    }
    
    const diffTime = targetDate.getTime() - curDateOnly.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const today = isTodayActive();
  const daysRem = calculateDaysRemaining();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 rounded-3xl p-5 border shadow-sm h-full flex flex-col justify-between overflow-hidden group ${
        isActive
          ? 'bg-zinc-900 border-zinc-700 text-white shadow-lg ring-2 ring-amber-400Ring'
          : 'bg-white border-neutral-100 hover:border-neutral-200 text-neutral-800'
      }`}
      style={{
        boxShadow: isActive ? '0 12px 30px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.02)'
      }}
    >
      {/* Dynamic Ambient Background Glow for Active Card */}
      {isActive && (
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-400/10 blur-2xl rounded-full pointer-events-none" />
      )}

      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2.5 rounded-2xl ${
              isActive ? 'bg-zinc-800 text-amber-400' : 'bg-neutral-50 text-neutral-600'
            }`}>
              <AnniversaryIcon name={iconName} size={18} />
            </div>
            
            <span className="text-stone-400 font-mono text-xs flex items-center gap-1">
              <Calendar size={12} />
              {month}月{day}日
              {isDoubleDay && endDay && ` - ${endDay}日`}
            </span>
          </div>

          {/* Today Tag */}
          {today ? (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-bounce">
              <Sparkles size={8} /> SPECIAL DAY
            </span>
          ) : daysRem === 0 ? (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-bounce">
              <Sparkles size={8} /> TODAY
            </span>
          ) : (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isActive ? 'bg-zinc-800 text-zinc-400' : 'bg-neutral-100 text-neutral-500'
            }`}>
              还有 {daysRem} 天
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className={`text-base font-medium tracking-tight mb-2 group-hover:text-amber-400 transition-colors ${
          isActive ? 'text-white' : 'text-stone-900'
        }`}>
          {name}
        </h3>
        
        <p className={`text-xs leading-relaxed ${
          isActive ? 'text-zinc-400' : 'text-neutral-500'
        }`}>
          {description.length > 50 ? `${description.slice(0, 48)}...` : description}
        </p>
      </div>

      {/* Card Footer relative statistics */}
      <div className="mt-4 pt-3 border-t border-dashed border-neutral-100/10 flex justify-between items-center text-[10px] font-mono">
        <span className={isActive ? 'text-zinc-500' : 'text-neutral-400'}>
          {today ? '✨ 特效绽放中' : `倒计时: ${daysRem} 天`}
        </span>
        <span className={`transition-all duration-300 tracking-wider group-hover:translate-x-1 ${
          isActive ? 'text-amber-400 font-medium' : 'text-neutral-400'
        }`}>
          {isActive ? '时光机驻留 →' : '进入该纪念日 →'}
        </span>
      </div>
    </motion.div>
  );
};
