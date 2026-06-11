import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Sparkles,
  RotateCcw,
  Trash2,
  Heart,
  Music,
  Compass,
  Plus,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

import { Anniversary } from './types';
import { DEFAULT_ANNIVERSARIES } from './data/anniversaries';
import { getClosestAnniversaryIndex } from './utils/date';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { CustomAnniversaryCreator } from './components/CustomAnniversaryCreator';
import { AnniversaryIcon } from './components/AnniversaryIcon';
import {
  CandleBlower,
  SolsticeSlider,
  IntimacyMeter,
  VinylPlayer,
  BeijingTimeline,
  DengdengCard,
  LoveAnniversaryCard,
  PillowFightCard,
  NationalScienceDayCard,
  GrapeDayCard,
  FacaiPenguinCard,
  GenericMemoryCard
} from './components/InteractiveWidgets';

export default function App() {
  const [realDate, setRealDate] = useState<Date>(() => new Date());
  
  // Load custom anniversaries from LocalStorage on first run
  const [customAnniversaries, setCustomAnniversaries] = useState<Anniversary[]>(() => {
    try {
      const stored = localStorage.getItem('mine_anniversaries');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading custom anniversaries:', e);
      return [];
    }
  });

  // Combined list
  const allAnniversaries = useMemo(() => {
    return [...DEFAULT_ANNIVERSARIES, ...customAnniversaries];
  }, [customAnniversaries]);

  // Handle starting with the anniversary closest to today
  const [selectedIndex, setSelectedIndex] = useState(() => {
    return getClosestAnniversaryIndex(allAnniversaries, new Date());
  });

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Sync clock
  useEffect(() => {
    const timer = setInterval(() => {
      setRealDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ensure selectedIndex stays in range
  useEffect(() => {
    if (selectedIndex >= allAnniversaries.length) {
      setSelectedIndex(Math.max(0, allAnniversaries.length - 1));
    }
  }, [allAnniversaries, selectedIndex]);

  const activeAnniversary = allAnniversaries[selectedIndex] || allAnniversaries[0];

  const handleAddCustom = (newAnn: Anniversary) => {
    const updated = [...customAnniversaries, newAnn];
    setCustomAnniversaries(updated);
    try {
      localStorage.setItem('mine_anniversaries', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom anniversary:', e);
    }
    // Set active selector to the newly created anniversary
    setSelectedIndex(allAnniversaries.length);
  };

  const handleDeleteCustom = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customAnniversaries.filter((ann) => ann.id !== idToDelete);
    setCustomAnniversaries(updated);
    try {
      localStorage.setItem('mine_anniversaries', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom anniversary:', e);
    }
    setSelectedIndex(0);
  };

  // Helper tone for button clicks
  const triggerTickTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (_) {}
  };

  // Select index by wheel click/interaction
  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < allAnniversaries.length) {
      setSelectedIndex(idx);
      triggerTickTone();
    }
  };

  // Quick navigation wheel shift
  const shiftIndex = (direction: number) => {
    let nextIdx = selectedIndex + direction;
    if (nextIdx < 0) nextIdx = allAnniversaries.length - 1;
    if (nextIdx >= allAnniversaries.length) nextIdx = 0;
    setSelectedIndex(nextIdx);
    triggerTickTone();
  };

  // Current formatted date representation based on active item
  const formattedDateString = useMemo(() => {
    if (!activeAnniversary) return '';
    const padStr = (num: number) => num.toString().padStart(2, '0');
    return `${padStr(activeAnniversary.month)}.${padStr(activeAnniversary.day)}`;
  }, [activeAnniversary]);

  return (
    <div className="min-h-screen w-full bg-[#f4f4f6] recruitment-mesh flex flex-col justify-between p-6 md:p-12 selection:bg-amber-400 selection:text-neutral-900 overflow-x-hidden relative transition-all duration-500">
      
      {/* Decorative clean radial background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.03)_0%,transparent_100%)] pointer-events-none" />

      {/* Subtle decorative background watermarks */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none blur-3xl rounded-full" />
      
      {/* Particle Canvas embedded precisely behind elements */}
      {activeAnniversary && (
        <InteractiveCanvas
          key={activeAnniversary.id}
          id={activeAnniversary.id}
          themeColorHex={activeAnniversary.accentColor}
          isSpecialDay={true}
        />
      )}

      {/* TOP ROW: Header Navigation */}
      <div className="z-10 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#1d1d1f]" />
          <span className="text-base font-bold tracking-wider text-[#1d1d1f] font-sans">时光纪念印记</span>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-[#86868b] tracking-wider uppercase hidden sm:inline">
            ✦ CHRONOLOGICAL MEMORIAL DECK
          </span>
          
          {/* Quick System Time indicator */}
          <div className="px-3 py-1 bg-white/60 backdrop-blur border border-[#d2d2d7]/30 rounded-full text-[10px] font-mono text-[#1d1d1f] shadow-sm flex items-center gap-1.5">
            <Clock size={10} className="text-[#86868b]" />
            {realDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })} {realDate.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* MAIN BODY: Splitted into Left Arc selector and Right Display content */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto py-6 relative">
        
        {/* LEFT COLUMN: SWISS-STYLE DIAL WHEEL (md:col-span-5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[280px] select-none h-full md:pr-4">
          
          {/* Elegant thin circular arc line background */}
          <div className="absolute left-[-20%] md:left-[-12%] w-[380px] h-[380px] border border-dashed border-neutral-300/60 rounded-full pointer-events-none" />

          {/* UP / DOWN tiny navigation caret to spin wheel easily */}
          <div className="absolute top-0 flex flex-col items-center gap-1">
            <button
              onClick={() => shiftIndex(-1)}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronUp size={16} />
            </button>
          </div>

          {/* List of date markers mapped along the physical arc curve */}
          <div className="flex flex-col gap-5 py-4 w-full pl-6 md:pl-12 my-6">
            {allAnniversaries.map((ann, idx) => {
              const isSelected = idx === selectedIndex;
              const distance = Math.abs(idx - selectedIndex);
              
              // Keep only items within a logical scope visible or faded
              if (distance > 3 && idx !== 0 && idx !== allAnniversaries.length - 1) return null;

              const padM = ann.month.toString().padStart(2, '0');
              const padD = ann.day.toString().padStart(2, '0');

              // Dynamic custom coordinate shift mimicking a true round arc wheel
              const offsetMultiplier = Math.sin((idx - selectedIndex) * 0.45);
              const indentX = Math.max(0, (1 - Math.abs(offsetMultiplier)) * 24);

              return (
                <motion.div
                  key={ann.id}
                  onClick={() => handleSelectIndex(idx)}
                  style={{ paddingLeft: `${indentX}px` }}
                  className="flex items-center gap-3 cursor-pointer group transition-all duration-300 transform"
                >
                  {/* Small Dot pointing to the active one, styled exactly like the screenshot */}
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    {isSelected ? (
                      <motion.div
                        layoutId="active-dot-pointer"
                        className="w-1.5 h-1.5 rounded-full bg-neutral-900"
                      />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-neutral-350 opacity-40 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Numeric identifier: e.g. "04.12" (faded when non-selected, bold dark black when selected) */}
                  <span
                    className={`font-mono text-3xl md:text-4xl transition-all duration-300 font-bold ${
                      isSelected
                        ? 'text-[#1d1d1f] scale-110 tracking-tight'
                        : 'text-[#86868b] opacity-30 hover:opacity-60 text-2xl md:text-3xl font-medium'
                    }`}
                  >
                    {padM}.{padD}
                  </span>

                  {/* Secondary indicator */}
                  {isSelected && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      className="text-[10px] font-mono text-neutral-500 hidden sm:inline"
                    >
                      ● ACTIVE RUNTIME
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-0 flex flex-col items-center gap-1">
            <button
              onClick={() => shiftIndex(1)}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronDown size={16} />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN DISPLAY HEADER & ACTION (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col justify-center text-left space-y-6 md:pl-8">
          <AnimatePresence mode="wait">
            {activeAnniversary && (
              <motion.div
                key={activeAnniversary.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#86868b] tracking-widest bg-neutral-200/50 px-2 py-0.5 rounded-lg select-none">
                    {formattedDateString}
                  </span>

                  {activeAnniversary.isCustom && (
                    <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-mono px-2 py-0.5 rounded-lg select-none">
                      CUSTOM RECORD
                    </span>
                  )}
                </div>

                {/* Main Display Header (e.g. "Interaction") */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] leading-tight font-sans">
                  {activeAnniversary.name}
                </h2>

                {/* Interactive Dashboard Area depending on which is selected */}
                <div className="mt-6 pt-2 min-h-[360px] flex items-center justify-center">
                  {activeAnniversary.id === 'love-anniversary' && (
                    <LoveAnniversaryCard />
                  )}
                  {activeAnniversary.id === 'poetry-mianmian-birthday' && (
                    <CandleBlower name="棉棉" onBlowOut={triggerTickTone} />
                  )}
                  {activeAnniversary.id === 'pillow-fight-day' && (
                    <PillowFightCard />
                  )}
                  {activeAnniversary.id === 'intimacy-anniversary' && (
                    <IntimacyMeter />
                  )}
                  {activeAnniversary.id === 'national-science-day' && (
                    <NationalScienceDayCard />
                  )}
                  {activeAnniversary.id === 'summer-solstice' && (
                    <SolsticeSlider onChange={() => {}} />
                  )}
                  {activeAnniversary.id === 'grape-day' && (
                    <GrapeDayCard />
                  )}
                  {activeAnniversary.id === 'personal-birthday' && (
                    <CandleBlower name="我" onBlowOut={triggerTickTone} />
                  )}
                  {activeAnniversary.id === 'kontinue-release' && (
                    <VinylPlayer />
                  )}
                  {activeAnniversary.id === 'come-to-beijing-anniversary' && (
                    <BeijingTimeline />
                  )}
                  {activeAnniversary.id === 'dengdeng-birthday' && (
                    <DengdengCard />
                  )}
                  {activeAnniversary.id === 'facai-birthday' && (
                    <FacaiPenguinCard />
                  )}

                  {/* Simple fallbacks for newly custom ones to interact instantly */}
                  {!['love-anniversary', 'poetry-mianmian-birthday', 'pillow-fight-day', 'intimacy-anniversary', 'national-science-day', 'summer-solstice', 'grape-day', 'personal-birthday', 'kontinue-release', 'come-to-beijing-anniversary', 'dengdeng-birthday', 'facai-birthday'].includes(activeAnniversary.id) && (
                    <GenericMemoryCard name={activeAnniversary.name} onStamp={triggerTickTone} />
                  )}
                </div>

                {/* Absolute subtle trash button for custom days */}
                {activeAnniversary.isCustom && (
                  <div className="pt-2">
                    <button
                      onClick={(e) => handleDeleteCustom(activeAnniversary.id, e)}
                      className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 p-2 rounded-xl transition-all border border-rose-100"
                      title="删除该纪念日"
                    >
                      <Trash2 size={13} />
                      <span>删除此自定义卡片</span>
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* BOTTOM ROW: Dynamic action capsule */}
      <div className="z-10 flex justify-end items-center border-t border-neutral-200/40 pt-6 mt-6 select-none">
        {/* Elegant active capsule trigger - Clicking opens creator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCreatorOpen(!isCreatorOpen);
              triggerTickTone();
            }}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#4040ff] text-white hover:bg-[#3434d8] font-sans text-xs font-semibold rounded-full shadow-lg cursor-pointer transition-all hover:scale-103 active:scale-97 select-none"
          >
            {isCreatorOpen ? <X size={13} /> : <Plus size={13} />}
            {isCreatorOpen ? '关闭配置器' : '自定义纪念日'}
          </button>
        </div>
      </div>

      {/* Expanded Elegant Drawer Creator - Styled as a sleek modal overlay to prevent layout adjustments */}
      <AnimatePresence>
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatorOpen(false)}
              className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative z-10 border border-neutral-200/50 overflow-hidden"
            >
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={() => setIsCreatorOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[85vh] overflow-y-auto p-4 md:p-6 bg-[#f4f4f6]/50">
                <CustomAnniversaryCreator onAdd={handleAddCustom} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
