import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Gift,
  Music,
  MapPin,
  Cpu,
  Flame,
  Sun,
  Cloud,
  Wine,
  Smile,
  CheckCircle2
} from 'lucide-react';

// Common visual styles for cards to match WOVE layout
const widgetCardClass = "p-6 bg-white/85 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-sm max-w-sm mx-auto w-full select-none";

// Simple Audio Tone Helper for button micro-interactions
const triggerButtonTone = (freq = 520) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (_) {}
};

/* ==========================================================================
   1. LOVE ANNIVERSARY WIDGET (恋爱纪念日)
   ========================================================================== */
export const LoveAnniversaryCard: React.FC = () => {
  const [loveIndex, setLoveIndex] = useState(100);
  const [floats, setFloats] = useState<{ id: number; x: number }[]>([]);

  const handleCharge = () => {
    setLoveIndex((prev) => Math.min(prev + 5, 520));
    triggerButtonTone(620);
    
    const newId = Date.now() + Math.random();
    setFloats((prev) => [...prev, { id: newId, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== newId));
    }, 1200);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-rose-500 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Heart size={12} className="fill-rose-500" /> 恋爱纪念日自研芯片
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击爱心进行充能。</p>

      <div className="relative h-28 w-full bg-rose-50/40 rounded-xl border border-rose-150 flex items-center justify-center overflow-hidden mb-4">
        {/* Pulsing center heart */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="cursor-pointer group relative z-10"
          onClick={handleCharge}
        >
          <Heart size={44} className="text-rose-500 fill-rose-500 shadow-md group-hover:scale-110 transition-transform" />
        </motion.div>

        {/* Floating miniature hearts on clicking */}
        {floats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ y: 20, opacity: 1, scale: 0.8 }}
            animate={{ y: -60, opacity: 0, scale: 1.2 }}
            className="absolute text-rose-400 font-bold text-sm pointer-events-none select-none"
            style={{ left: `${f.x}%` }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-neutral-500 font-mono">已充能: {loveIndex}%</span>
        <button
          onClick={handleCharge}
          className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-xl font-sans text-[11px] font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
        >
          充能
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. CANDLE BLOWER WIDGET (世界诗歌日、棉棉生日 & 我的生日)
   ========================================================================== */
export const CandleBlower: React.FC<{ name: string; onBlowOut?: () => void }> = ({ name, onBlowOut }) => {
  const [lit, setLit] = useState(true);

  const handleBlow = () => {
    if (lit) {
      setLit(false);
      triggerButtonTone(350);
      if (onBlowOut) onBlowOut();
    }
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Gift size={12} className="text-emerald-500" /> 生日
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击蜡烛将其吹熄。</p>

      <div className="relative h-28 w-full bg-emerald-50/20 rounded-xl border border-emerald-100 flex flex-col items-center justify-end pb-3 cursor-pointer" onClick={handleBlow}>
        {/* Flame */}
        <AnimatePresence>
          {lit && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.12, 0.95, 1], y: [0, -2, 1, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
              className="absolute bottom-16 w-4 h-7 bg-gradient-to-t from-red-500 via-amber-400 to-yellow-100 rounded-full blur-[0.5px] shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          )}
        </AnimatePresence>

        {/* Small Candle */}
        <div className="w-3 h-10 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 rounded-t-sm shadow-sm" />
        <div className="w-16 h-3 bg-amber-200 rounded-t-md rounded-b-sm border-t border-amber-300 shadow-inner" />
      </div>

      <div className="mt-3 text-center">
        {lit ? (
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-mono font-medium">
            🔥 点击吹灭
          </span>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-xs text-emerald-800 font-sans font-medium">祝生日快乐！✨</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   3. PILLOW FIGHT WIDGET (国际枕头大战日)
   ========================================================================== */
export const PillowFightCard: React.FC = () => {
  const [fights, setFights] = useState(0);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);

  const handleFight = (side: 'left' | 'right') => {
    setFights((prev) => prev + 1);
    setActiveSide(side);
    triggerButtonTone(400);

    setTimeout(() => {
      setActiveSide(null);
    }, 200);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-amber-500 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Cloud size={12} className="text-amber-500" /> 枕头大战
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击两侧枕头进行模拟对决。</p>

      <div className="relative h-28 w-full bg-amber-50/20 rounded-xl border border-amber-100 flex items-center justify-around overflow-hidden mb-4">
        {/* Left Cushion */}
        <motion.button
          animate={activeSide === 'left' ? { scale: 0.85, rotate: -15 } : { scale: 1, rotate: 0 }}
          onClick={() => handleFight('left')}
          className="w-16 h-12 bg-white border border-neutral-300 rounded-2xl shadow-sm flex items-center justify-center text-xl cursor-pointer"
        >
          ☁️
        </motion.button>

        <span className="text-xs text-neutral-400 font-mono">VS</span>

        {/* Right Cushion */}
        <motion.button
          animate={activeSide === 'right' ? { scale: 0.85, rotate: 15 } : { scale: 1, rotate: 0 }}
          onClick={() => handleFight('right')}
          className="w-16 h-12 bg-amber-100 border border-amber-300 rounded-2xl shadow-sm flex items-center justify-center text-xl cursor-pointer"
        >
          ☁️
        </motion.button>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>击打次数: <b>{fights}</b></span>
        <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-500">
          {fights > 0 ? '💥 互动中' : '💤 待开始'}
        </span>
      </div>
    </div>
  );
};

/* ==========================================================================
   4. INTIMACY METER WIDGET (有性生活纪念日)
   ========================================================================== */
export const IntimacyMeter: React.FC = () => {
  const [bpm, setBpm] = useState(80);

  const getSensation = () => {
    if (bpm < 75) return '☘️ 平稳';
    if (bpm < 100) return '💓 轻快';
    if (bpm < 125) return '🔥 炽热';
    return '⚡ 同频';
  };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-pink-500/10 shadow-lg max-w-sm mx-auto w-full select-none">
      <h4 className="text-xs font-bold text-pink-400 tracking-wider uppercase mb-1 flex items-center gap-1 font-sans">
        <Flame size={12} className="text-pink-500 fill-pink-500" /> 心率监测
      </h4>
      <p className="text-xs text-slate-400 mb-4 font-sans">调节滑动条，改变模拟心率。</p>

      {/* Orbit ring */}
      <div className="relative h-24 w-full flex items-center justify-center mb-4">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ repeat: Infinity, duration: 60 / bpm, ease: 'easeInOut' }}
          className="absolute inset-x-8 h-12 bg-pink-500/15 rounded-full blur-md"
        />
        <motion.div
          animate={{ scale: [0.95, 1.15, 0.95] }}
          transition={{ repeat: Infinity, duration: 60 / bpm, ease: 'easeInOut' }}
          className="bg-gradient-to-tr from-fuchsia-500 to-pink-500 h-10 w-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)] z-10"
        >
          <Heart size={14} className="text-white fill-white" />
        </motion.div>
      </div>

      <div className="w-full mb-3">
        <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
          <span>心率 / 频率</span>
          <span className="text-pink-400 font-bold">{bpm} BPM</span>
        </div>
        <input
          id="intimacy-slider"
          type="range"
          min="60"
          max="140"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full accent-pink-500 cursor-pointer h-1 bg-slate-700 rounded-lg appearance-none"
        />
      </div>

      <div className="px-3 py-1.5 bg-black/40 rounded-xl text-center border border-pink-500/10">
        <span className="text-[10px] text-pink-300 font-sans font-medium">{getSensation()}</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   5. NATIONAL SCIENCE DAY (全国科技工作者日)
   ========================================================================== */
export const NationalScienceDayCard: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState<boolean[]>([true, false, true, false, false]);

  const toggleNode = (idx: number) => {
    const updated = [...activeNodes];
    updated[idx] = !updated[idx];
    setActiveNodes(updated);
    triggerButtonTone(200 + idx * 100);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-cyan-600 tracking-wider uppercase mb-1 flex items-center gap-1 font-sans">
        <Cpu size={12} className="text-cyan-500" /> 技术节点调试
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击各个节点进行状态切换。</p>

      <div className="relative h-24 w-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-around px-4 mb-3">
        {activeNodes.map((active, idx) => (
          <button
            key={idx}
            onClick={() => toggleNode(idx)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            {/* Logic node led */}
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              active
                ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)] scale-110'
                : 'bg-slate-700 group-hover:bg-slate-600'
            }`} />
            <span className="text-[9px] font-mono text-slate-500">CH-{idx + 1}</span>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-neutral-400 font-sans text-center">
        活跃节点: {activeNodes.filter((n) => n).length} / 5
      </p>
    </div>
  );
};

/* ==========================================================================
   6. SOLSTICE SLIDER WIDGET (夏至日)
   ========================================================================== */
export const SolsticeSlider: React.FC<{ onChange?: (val: number) => void }> = ({ onChange }) => {
  const [val, setVal] = useState(50); // 0 (Dawn) -> 50 (Noon) -> 100 (Dusk)

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value);
    setVal(rawVal);
    if (onChange) onChange(rawVal);
  };

  const getFactualLabel = () => {
    if (val < 25) return '🌅 曙光 (04:30)';
    if (val < 45) return '☀️ 朝阳 (09:00)';
    if (val < 65) return '👑 正午 (12:00)';
    if (val < 85) return '🍊 晚霞 (18:30)';
    return '🌌 夜幕 (21:00)';
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1 flex items-center gap-1 font-sans">
        <Sun size={12} className="text-orange-500" /> 夏至时刻
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">移动滑块观察夏至日的阳光变化。</p>

      <div className="w-full px-1 mb-4 select-none">
        <input
          id="solstice-solar-slider"
          type="range"
          min="0"
          max="100"
          value={val}
          onChange={handleSlider}
          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-amber-100 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-neutral-400 font-mono mt-1">
          <span>清晨</span>
          <span>正午</span>
          <span>日落</span>
        </div>
      </div>

      <div className="px-3 py-2 bg-amber-50/60 rounded-xl border border-amber-100 text-center font-sans text-xs text-amber-900 font-medium whitespace-pre-wrap">
        {getFactualLabel()}
      </div>
    </div>
  );
};

/* ==========================================================================
   7. GRAPE DAY WIDGET (Grape day纪念日)
   ========================================================================== */
export const GrapeDayCard: React.FC = () => {
  const [juiceLevel, setJuiceLevel] = useState(30);

  const handleSqueeze = () => {
    setJuiceLevel((prev) => Math.min(prev + 10, 100));
    triggerButtonTone(580);
  };

  const handleResetJuice = () => {
    setJuiceLevel(0);
    triggerButtonTone(210);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-1 flex items-center gap-1 flex-row">
        <Wine size={12} className="text-purple-500" /> 葡萄浆果
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击榨汁充盈杯子。</p>

      <div className="relative h-24 w-full bg-purple-50/20 rounded-xl border border-purple-100 flex items-center justify-center gap-6 overflow-hidden mb-3">
        {/* Grape glass representation */}
        <div className="relative w-12 h-16 border-2 border-neutral-400 rounded-b-xl flex items-end overflow-hidden pb-1">
          {/* Stem & Stand */}
          <div className="absolute left-[20px] bottom-[-20px] w-1 h-3 bg-neutral-400/80" />
          {/* Juice Liquid level fill */}
          <motion.div
            animate={{ height: `${juiceLevel}%` }}
            className="w-full bg-purple-500/80 rounded-b-lg origin-bottom"
          />
        </div>

        <span className="text-4xl select-none filter drop-shadow">🍇</span>
      </div>

      <div className="flex gap-2 items-center justify-between text-xs">
        <span className="text-neutral-500 font-mono">杯中容量: {juiceLevel}%</span>
        <div className="flex gap-2">
          {juiceLevel >= 100 ? (
            <button
              onClick={handleResetJuice}
              className="bg-neutral-800 hover:bg-neutral-900 text-white px-2.5 py-1 text-[10px] rounded-lg tracking-wide select-none cursor-pointer"
            >
              清空
            </button>
          ) : null}
          <button
            onClick={handleSqueeze}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-semibold rounded-xl tracking-wide select-none transition-transform active:scale-95 cursor-pointer"
          >
            榨汁 🍹
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   8. VINYL RECORD PLAYER (kontinue发行纪念日 - 9月29日)
   ========================================================================== */
export const VinylPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    setPlaying(!playing);
    triggerButtonTone(playing ? 300 : 440);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-amber-500 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Music size={12} className="text-amber-500" /> 《kontinue》唱片
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">点击唱机体验模拟黑胶旋转。</p>

      <div className="relative h-28 w-full bg-neutral-900 rounded-xl flex items-center justify-center overflow-hidden mb-3 border border-neutral-800">
        <motion.div
          animate={playing ? { rotate: 360 } : {}}
          transition={playing ? { repeat: Infinity, duration: 4, ease: 'linear' } : {}}
          className="relative w-20 h-20 bg-zinc-950 rounded-full border border-neutral-700 flex items-center justify-center cursor-pointer shadow-lg"
          style={{ backgroundImage: 'repeating-radial-gradient(circle, #242424, #121212 3px, #242424 6px)' }}
          onClick={togglePlayback}
        >
          {/* Vinyl label center */}
          <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-[7px] text-zinc-900 font-bold select-none text-center">
            kntn
          </div>
        </motion.div>

        {/* Tone arm slider */}
        <div className="absolute right-6 top-3 w-3 h-16 origin-top bg-neutral-400 border border-neutral-500 rounded" style={{
          transform: playing ? 'rotate(18deg)' : 'rotate(0deg)',
          transition: 'transform 0.4s ease'
        }} />
      </div>

      <div className="text-center">
        <button
          onClick={togglePlayback}
          className={`w-full py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all select-none cursor-pointer ${
            playing
              ? 'bg-amber-400 text-zinc-900 hover:bg-amber-500'
              : 'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200'
          }`}
        >
          {playing ? '⏸ 暂停旋转' : '▶ 模拟播放'}
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   9. BEIJING TIMELINE WIDGET (来北京纪念日 - 11月8日)
   ========================================================================== */
export const BeijingTimeline: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8 select-none">
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-md border-4 border-white/80"
      >
        <MapPin size={44} className="text-white" />
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   10. DENGDENG弟 WIDGET (登登弟生日 - 11月30日)
   ========================================================================== */
export const DengdengCard: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [confettis, setConfettis] = useState<{ id: number; x: number }[]>([]);

  const handleBless = () => {
    setLikes((prev) => prev + 1);
    triggerButtonTone(550);
    const newId = Date.now() + Math.random();
    setConfettis((prev) => [...prev, { id: newId, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setConfettis((prev) => prev.filter((c) => c.id !== newId));
    }, 1000);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Smile size={12} className="text-orange-500" /> 登登弟生日
      </h4>
      <p className="text-xs text-neutral-500 mb-3 font-sans">点击送上生日祝福。</p>

      <div className="relative h-24 w-full bg-orange-50/20 rounded-xl border border-orange-100 flex items-center justify-center overflow-hidden mb-3">
        <span className="text-4xl select-none">🎂🍰✨</span>

        {confettis.map((c) => (
          <motion.div
            key={c.id}
            initial={{ y: 20, opacity: 1, scale: 0.5 }}
            animate={{ y: -50, opacity: 0, scale: 1.2, rotate: 180 }}
            className="absolute text-orange-400 font-bold text-xs pointer-events-none select-none"
            style={{ left: `${c.x}%` }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-500">祝福值: <b>{likes}</b></span>
        <button
          onClick={handleBless}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-[11px] rounded-lg tracking-wide select-none active:scale-95 transition-transform cursor-pointer"
        >
          送祝福 👏
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   11. PENGIUN DOLL FACAI WIDGET (发财生日 - 12月25日)
   ========================================================================== */
export const FacaiPenguinCard: React.FC = () => {
  const [mood, setMood] = useState<'calm' | 'happy' | 'scarf'>('calm');
  const [bouncetimer, setBouncetimer] = useState(false);

  const handlePet = () => {
    setMood('happy');
    setBouncetimer(true);
    triggerButtonTone(680);
    setTimeout(() => {
      setMood('calm');
      setBouncetimer(false);
    }, 1200);
  };

  const handleTidyScarf = () => {
    setMood('scarf');
    triggerButtonTone(480);
    setTimeout(() => {
      setMood('calm');
    }, 1200);
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1 flex items-center gap-1">
        <span>🐧</span> 发财企鹅
      </h4>
      <p className="text-xs text-neutral-500 mb-4 font-sans">“发财”是一只陪伴在身边的企鹅玩偶。</p>

      {/* Styled vector CSS representation of the penguin doll */}
      <div className="relative h-36 w-full bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col items-center justify-center overflow-hidden mb-3">
        
        {/* Shadow under feet */}
        <div className="absolute bottom-3 w-16 h-2 bg-neutral-900/10 rounded-full blur-[1px]" />

        {/* Penguin avatar body */}
        <motion.div
          animate={bouncetimer ? { y: [0, -12, 0], scale: [1, 1.05, 0.95, 1] } : {}}
          transition={{ duration: 0.6, repeat: bouncetimer ? Infinity : 0, ease: "easeInOut" }}
          className="relative w-24 h-28 flex flex-col items-center justify-end pb-2 cursor-pointer z-10"
          onClick={handlePet}
        >
          {/* Wings - Left & Right flippers */}
          <motion.div 
            animate={mood === 'happy' ? { rotate: [-15, -35, -15] } : { rotate: -15 }}
            transition={{ duration: 0.3, repeat: mood === 'happy' ? Infinity : 0, repeatType: 'reverse' }}
            className="absolute left-1 top-10 w-4 h-11 bg-slate-800 rounded-full origin-top-right -rotate-12 shadow-sm"
          />
          <motion.div 
            animate={mood === 'happy' ? { rotate: [15, 35, 15] } : { rotate: 15 }}
            transition={{ duration: 0.3, repeat: mood === 'happy' ? Infinity : 0, repeatType: 'reverse' }}
            className="absolute right-1 top-10 w-4 h-11 bg-slate-800 rounded-full origin-top-left rotate-12 shadow-sm"
          />

          {/* Core Body Container */}
          <div className="relative w-20 h-24 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[45px] shadow-sm flex flex-col items-center pt-2 overflow-hidden border border-slate-700">
            
            {/* Soft inner facial white background shape mask */}
            <div className="absolute top-2 w-16 h-20 bg-white rounded-[32px] flex flex-col items-center pt-4 shadow-inner">
              
              {/* Eyes with reflections for dynamic, deep soul effect */}
              <div className="flex gap-4 mb-1.5 relative z-10">
                {/* Left eye */}
                <div className="relative w-3.5 h-3.5 bg-neutral-900 rounded-full flex items-start justify-start p-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute right-0.5 bottom-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                </div>
                {/* Right eye */}
                <div className="relative w-3.5 h-3.5 bg-neutral-900 rounded-full flex items-start justify-start p-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute right-0.5 bottom-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Rosy blush cheeks */}
              <div className="absolute top-6 w-full px-2 flex justify-between">
                <motion.div 
                  animate={mood === 'happy' ? { scale: [1, 1.3, 1], opacity: 0.9 } : { scale: 1, opacity: 0.5 }}
                  className="w-3 h-2 bg-rose-400 rounded-full blur-[0.5px]" 
                />
                <motion.div 
                  animate={mood === 'happy' ? { scale: [1, 1.3, 1], opacity: 0.9 } : { scale: 1, opacity: 0.5 }}
                  className="w-3 h-2 bg-rose-400 rounded-full blur-[0.5px]" 
                />
              </div>

              {/* Cute beak */}
              <motion.div 
                animate={mood === 'happy' ? { scaleY: [1, 1.2, 1] } : {}}
                className="w-3.5 h-3 bg-amber-400 rounded-b-full shadow-sm z-10" 
              />

            </div>

            {/* Cozy red scarf */}
            <div className="absolute bottom-4.5 z-25 flex flex-col items-end w-16">
              {/* Scarf main horizontal band */}
              <div className="w-16 h-3 bg-red-500 rounded-full relative shadow-sm border border-red-650/30">
                {/* Fringe detail lines */}
                <div className="absolute left-2 top-0.5 bottom-0.5 w-[2px] bg-red-400/50" />
                <div className="absolute left-3 top-0.5 bottom-0.5 w-[2px] bg-red-400/50" />
              </div>
              {/* Scarf tail hanging down */}
              <motion.div
                animate={mood === 'scarf' ? { rotate: [10, 30, -10, 10], scaleY: [1, 1.1, 0.9, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="w-3.5 h-7 bg-red-500 rounded-b-md relative right-2 -mt-[3px] origin-top shadow-md border-r border-b border-red-600/30 flex flex-col justify-end"
              >
                {/* Scarf fringe at the bottom of the tail */}
                <div className="flex justify-between px-[1.5px] h-[3px]">
                  <div className="w-[1px] h-full bg-yellow-400 rounded-full" />
                  <div className="w-[1px] h-full bg-yellow-300 rounded-full" />
                  <div className="w-[1px] h-full bg-yellow-400 rounded-full" />
                </div>
              </motion.div>
            </div>

          </div>

          {/* Feet */}
          <div className="absolute bottom-0 w-16 flex justify-between px-2">
            <div className="w-4 h-2.5 bg-amber-400 rounded-full transform -rotate-12 shadow-sm border border-amber-500/20" />
            <div className="w-4 h-2.5 bg-amber-400 rounded-full transform rotate-12 shadow-sm border border-amber-500/20" />
          </div>

        </motion.div>

        {/* Action text speech bubble */}
        <AnimatePresence>
          {mood !== 'calm' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className="absolute top-2 bg-indigo-950 text-white px-2.5 py-1 rounded-lg border border-indigo-800 text-[10px] font-sans font-medium shadow-md z-20 flex items-center gap-1"
            >
              <span>✨</span>
              {mood === 'happy' ? '发财：啾啾~ (开心)' : '发财的围巾整理好啦！🧣'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caring interactive triggers */}
      <div className="flex gap-2">
        <button
          onClick={handlePet}
          className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-1.5 rounded-xl text-[10px] font-medium transition-all active:scale-95 cursor-pointer"
        >
          💆 抚摸发财
        </button>
        <button
          onClick={handleTidyScarf}
          className="flex-1 bg-indigo-50 hover:bg-indigo-150 text-indigo-800 border border-indigo-200 py-1.5 rounded-xl text-[10px] font-medium transition-all active:scale-95 cursor-pointer"
        >
          🧣 整理围巾
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   12. GENERIC COMPONENT FOR CUSTOM RECORDED ANNIVERSARIES (自定义专属印记)
   ========================================================================== */
interface GenericMemoryCardProps {
  name: string;
  onStamp?: () => void;
}

export const GenericMemoryCard: React.FC<GenericMemoryCardProps> = ({ name, onStamp }) => {
  const [stampCount, setStampCount] = useState(0);

  const handleStamp = () => {
    setStampCount((prev) => prev + 1);
    triggerButtonTone(440);
    if (onStamp) onStamp();
  };

  return (
    <div className={widgetCardClass}>
      <h4 className="text-xs font-bold text-neutral-600 tracking-wider uppercase mb-1 flex items-center gap-1">
        <Smile size={12} className="text-neutral-500" /> 专属纪念
      </h4>
      <p className="text-xs text-neutral-500 mb-3 font-sans">
        这里是你自定义写下的记事芯片：<b>{name}</b>。
      </p>

      {/* Virtual Stamp Pad Frame */}
      <div className="relative h-24 w-full bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-center overflow-hidden mb-3">
        <motion.div
          animate={stampCount > 0 ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <span className="text-4xl block select-none">✏️📓</span>
        </motion.div>

        {stampCount > 0 && (
          <div className="absolute top-2 right-2 bg-amber-400 text-neutral-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full select-none">
            盖章数: {stampCount}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleStamp}
          className="w-full bg-neutral-950 text-white hover:bg-neutral-850 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wide select-none transition-transform active:scale-95 cursor-pointer"
        >
          ✨ 盖章
        </button>
      </div>
    </div>
  );
};
