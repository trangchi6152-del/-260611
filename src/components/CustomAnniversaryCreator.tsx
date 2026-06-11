import React, { useState } from 'react';
import { Heart, Gift, Star, Compass } from 'lucide-react';
import { Anniversary } from '../types';

interface CustomAnniversaryCreatorProps {
  onAdd: (newAnniversary: Anniversary) => void;
}

export const CustomAnniversaryCreator: React.FC<CustomAnniversaryCreatorProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(11);
  const [iconName, setIconName] = useState('Star');
  const [themeColor, setThemeColor] = useState('rose');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Map themeColor to appropriate classes
    let colorClasses = {
      themeColor: 'from-rose-50 to-pink-100',
      bgColor: 'text-rose-500',
      textColor: 'text-rose-800',
      accentColor: '#f43f5e'
    };

    if (themeColor === 'emerald') {
      colorClasses = {
        themeColor: 'from-emerald-50 to-teal-100',
        bgColor: 'text-emerald-500',
        textColor: 'text-emerald-800',
        accentColor: '#10b981'
      };
    } else if (themeColor === 'amber') {
      colorClasses = {
        themeColor: 'from-amber-50 to-orange-100',
        bgColor: 'text-amber-500',
        textColor: 'text-amber-800',
        accentColor: '#f59e0b'
      };
    } else if (themeColor === 'indigo') {
      colorClasses = {
        themeColor: 'from-indigo-50 to-blue-100',
        bgColor: 'text-indigo-500',
        textColor: 'text-indigo-800',
        accentColor: '#6366f1'
      };
    }

    const newAnn: Anniversary = {
      id: `custom-${Date.now()}`,
      name,
      month: Number(month),
      day: Number(day),
      description: '',
      ...colorClasses,
      iconName,
      funFacts: [],
      isCustom: true
    };

    onAdd(newAnn);

    // Reset Form
    setName('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#d2d2d7]/50 p-6 rounded-[24px] shadow-lg space-y-4"
      >
        <h3 className="text-sm font-semibold text-neutral-900 tracking-wide font-sans text-center mb-2">
          ✍️ 起草你的专属纪念日印记
        </h3>

        {/* Name */}
        <div>
          <label className="block text-[11px] font-mono font-semibold text-neutral-500 mb-1">
            纪念日名称 *
          </label>
          <input
            id="custom-anniversary-title-input"
            type="text"
            required
            placeholder="例如：第一次牵手、来北京满一年..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-850 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        {/* Date selection Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-500 mb-1">
              几月份
            </label>
            <select
              id="custom-anniversary-month-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} 月
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-500 mb-1">
              日期
            </label>
            <select
              id="custom-anniversary-day-select"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none"
            >
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} 日
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Choice of visual assets (Icon) */}
        <div>
          <label className="block text-[11px] font-mono font-semibold text-neutral-500 mb-1.5">
            设计图标
          </label>
          <div className="flex gap-2 justify-between">
            {[
              { id: 'Heart', comp: <Heart size={14} /> },
              { id: 'Gift', comp: <Gift size={14} /> },
              { id: 'Star', comp: <Star size={14} /> },
              { id: 'Compass', comp: <Compass size={14} /> }
            ].map((ic) => (
              <button
                key={ic.id}
                type="button"
                onClick={() => setIconName(ic.id)}
                className={`flex-1 flex items-center justify-center p-2 rounded-xl border transition-all ${
                  iconName === ic.id
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-500'
                }`}
              >
                {ic.comp}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div>
          <label className="block text-[11px] font-mono font-semibold text-neutral-500 mb-1.5">
            色彩主调
          </label>
          <div className="flex gap-3 justify-center">
            {[
              { id: 'rose', bg: 'bg-rose-500' },
              { id: 'emerald', bg: 'bg-emerald-500' },
              { id: 'amber', bg: 'bg-amber-500' },
              { id: 'indigo', bg: 'bg-indigo-500' }
            ].map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setThemeColor(col.id)}
                className={`w-6 h-6 rounded-full transition-transform ${col.bg} ${
                  themeColor === col.id ? 'scale-120 ring-2 ring-neutral-400 ring-offset-2' : 'hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-neutral-950 text-white hover:bg-neutral-850 h-10 rounded-xl text-xs font-mono font-bold tracking-wider select-none transition-all shadow-md cursor-pointer"
        >
          保存专属纪念印记
        </button>
      </form>
    </div>
  );
};
