
import React, { useState, useEffect, useRef } from 'react';

type GameType = 'Anxiety' | 'Stress' | 'Focus' | 'Sensory' | 'Gratitude' | 'Sound' | 'Clutter' | 'Art';

interface GameInfo {
  id: GameType;
  title: string;
  type: string;
  description: string;
  icon: string;
}

const gamesLibrary: GameInfo[] = [
  { id: 'Stress', title: "Thought Shredder", type: "Stress", description: "Type out your worries and watch them get shredded into digital dust.", icon: "✂️" },
  { id: 'Anxiety', title: "Breathing Bubble", type: "Anxiety", description: "A synchronized visual guide to help you regulate your nervous system.", icon: "🫧" },
  { id: 'Focus', title: "Focus Match", type: "Focus", description: "A quick cognitive warmup to sharpen your attention before studying.", icon: "🧩" },
  { id: 'Sensory', title: "Zen Mist", type: "Sensory", description: "Gently clear the fog to reveal a peaceful landscape.", icon: "🌫️" },
  { id: 'Gratitude', title: "Gratitude Garden", type: "Gratitude", description: "Plant positive thoughts and watch your garden grow.", icon: "🌱" },
  { id: 'Sound', title: "Sound Oasis", type: "Sound", description: "Create your own ambient mix for deep work or sleep.", icon: "🎵" },
  { id: 'Clutter', title: "Digital De-clutter", type: "Clutter", description: "Swipe away distractions to find mental clarity.", icon: "🧹" },
  { id: 'Art', title: "Color Therapy", type: "Art", description: "Simple, fluid finger-painting for creative release.", icon: "🎨" },
];

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('Stress');

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-6">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-black text-purple-400 tracking-tight uppercase">Wellness Arcade</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Quick interactive tools to help you ground your senses and reset your focus.
        </p>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">
        {/* Sidebar Library */}
        <div className="space-y-4 bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar sticky top-24">
          <h3 className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] px-2 mb-6">Game Library</h3>
          <div className="space-y-3">
            {gamesLibrary.map((game) => (
              <div 
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-4 group ${
                  activeGame === game.id 
                    ? 'bg-purple-600 border-purple-500 shadow-xl shadow-purple-950/40 text-purple-400 scale-[1.02]' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:bg-slate-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${activeGame === game.id ? 'bg-purple-500/20' : 'bg-slate-800'}`}>
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-black leading-none mb-1 ${activeGame === game.id ? 'text-purple-400' : 'text-slate-400'}`}>{game.title}</h4>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${activeGame === game.id ? 'text-purple-400' : 'text-slate-500'}`}>{game.type}</span>
                </div>
                {activeGame === game.id && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Game View */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-slate-800 min-h-[600px] flex flex-col relative overflow-hidden">
          <div className="mb-10 flex justify-between items-start">
             <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.4em] mb-2 block">Now Playing</span>
                <h3 className="text-3xl font-black text-purple-400">{gamesLibrary.find(g => g.id === activeGame)?.title}</h3>
             </div>
             <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-2xl">
                {gamesLibrary.find(g => g.id === activeGame)?.icon}
             </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {activeGame === 'Stress' && <StressShredder />}
            {activeGame === 'Anxiety' && <BreathingBubble />}
            {activeGame === 'Focus' && <FocusMatch />}
            {activeGame === 'Sensory' && <ZenMist />}
            {activeGame === 'Gratitude' && <GratitudeGarden />}
            {activeGame === 'Sound' && <SoundOasis />}
            {activeGame === 'Clutter' && <DigitalDeclutter />}
            {activeGame === 'Art' && <ColorTherapy />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- GAME COMPONENTS ---

const StressShredder: React.FC = () => {
  const [thought, setThought] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);

  const handleShred = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;
    setIsShredding(true);
    const newParticles = Array.from({length: 40}).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    }));
    setParticles(newParticles);
    setTimeout(() => {
      setThought('');
      setIsShredding(false);
      setParticles([]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in zoom-in duration-300">
      <p className="text-slate-400 font-medium italic">Type your stress, then watch it disappear.</p>
      <div className="relative">
        <textarea 
          value={thought}
          disabled={isShredding}
          onChange={(e) => setThought(e.target.value)}
          placeholder="I'm feeling overwhelmed by..."
          className={`w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 text-xl outline-none focus:border-purple-500/50 transition-all resize-none shadow-inner text-purple-400 placeholder:text-slate-600 ${isShredding ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        />
        {isShredding && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {particles.map(p => (
              <div key={p.id} className="absolute w-2 h-2 bg-purple-500 rounded-sm animate-ping" style={{ transform: `translate(${p.x * 4}px, ${p.y * 4}px)`, transition: 'all 2s ease-out' }} />
            ))}
            <div className="text-purple-400 font-black text-2xl uppercase tracking-[0.3em] animate-bounce">Gone Forever</div>
          </div>
        )}
      </div>
      <button onClick={handleShred} disabled={!thought.trim() || isShredding} className="bg-purple-600 text-purple-400 px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-950/40 hover:bg-purple-700 transition-all disabled:opacity-30 active:scale-95">
        Destroy Stress
      </button>
    </div>
  );
};

const BreathingBubble: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          switch (phase) {
            case 'Inhale': setPhase('Hold'); return 4;
            case 'Hold': setPhase('Exhale'); return 4;
            case 'Exhale': setPhase('Pause'); return 4;
            case 'Pause': setPhase('Inhale'); return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="text-center space-y-12 animate-in fade-in zoom-in duration-300">
      <div className="relative flex items-center justify-center w-80 h-80 mx-auto">
        <div 
          className={`absolute rounded-full transition-all duration-[4000ms] ease-linear border-[12px] border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.2)]
          ${phase === 'Inhale' ? 'w-full h-full bg-purple-500/20' : ''}
          ${phase === 'Hold' ? 'w-full h-full bg-purple-500/40' : ''}
          ${phase === 'Exhale' ? 'w-40 h-40 bg-purple-500/10' : ''}
          ${phase === 'Pause' ? 'w-40 h-40 bg-purple-500/5' : ''}`}
        />
        <div className="z-10 text-center">
          <div className="text-7xl font-black text-purple-400 mb-1">{counter}</div>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-purple-400">{phase}</div>
        </div>
      </div>
      <div className="bg-slate-950 px-8 py-4 rounded-2xl border border-slate-800 inline-block">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ground yourself in the rhythm</p>
      </div>
    </div>
  );
};

const FocusMatch: React.FC = () => {
  const symbols = ['🎯', '🚀', '⭐', '🧠', '💡', '📚', '🧬', '🧪'];
  const [cards, setCards] = useState<{id: number, symbol: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
  };

  useEffect(() => { initGame(); }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-black text-purple-400 uppercase tracking-widest">Moves: {moves}</h3>
        <button onClick={initGame} className="bg-purple-600 text-purple-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Reset Board</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} onClick={() => handleCardClick(i)} className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform border
            ${card.flipped || card.matched ? 'bg-purple-500/20 border-purple-500/40 rotate-0 scale-100' : 'bg-slate-950 border-slate-800 rotate-3 scale-95 hover:rotate-0 hover:scale-100'}
            ${card.matched ? 'opacity-40' : 'opacity-100'}`}>
            {(card.flipped || card.matched) ? card.symbol : ''}
          </div>
        ))}
      </div>
      {cards.length > 0 && cards.every(c => c.matched) && <div className="text-center p-8 bg-purple-600 text-purple-400 rounded-3xl animate-bounce shadow-2xl shadow-purple-950/40 font-black uppercase">Mind Sharpened!</div>}
    </div>
  );
};

const ZenMist: React.FC = () => {
  const [clearedCount, setClearedCount] = useState(0);
  const [grid, setGrid] = useState<boolean[]>(Array(100).fill(false));
  const landscapeUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000";

  const clearFog = (index: number) => {
    if (grid[index]) return;
    const newGrid = [...grid];
    newGrid[index] = true;
    setGrid(newGrid);
    setClearedCount(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-3xl text-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-950 border border-slate-800">
        <img src={landscapeUrl} className="absolute inset-0 w-full h-full object-cover" alt="Zen" />
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {grid.map((cleared, i) => (
            <div key={i} onMouseEnter={() => clearFog(i)} onTouchMove={() => clearFog(i)} className={`w-full h-full transition-all duration-1000 ${cleared ? 'opacity-0 scale-150' : 'bg-slate-900/98 backdrop-blur-xl border-[0.2px] border-slate-800/10'}`} />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center px-4">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Atmosphere cleared: {Math.round((clearedCount / 100) * 100)}%</span>
        <button onClick={() => { setGrid(Array(100).fill(false)); setClearedCount(0); }} className="text-purple-400 font-black uppercase text-[10px] tracking-widest hover:underline">Restore Mist</button>
      </div>
    </div>
  );
};

const GratitudeGarden: React.FC = () => {
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    setItems(prev => [item, ...prev].slice(0, 8));
    setItem('');
  };

  return (
    <div className="w-full max-w-xl text-center space-y-10 animate-in fade-in zoom-in duration-300">
      <p className="text-slate-400 font-medium italic">What are you grateful for right now?</p>
      <form onSubmit={handleAdd} className="flex gap-4">
        <input 
          type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g., A warm cup of chai..."
          className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-purple-400"
        />
        <button type="submit" className="bg-purple-600 text-purple-400 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all">Plant</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-3xl border border-purple-500/20 animate-in zoom-in duration-700 flex flex-col items-center gap-3">
             <span className="text-3xl">🌸</span>
             <p className="text-[10px] font-bold text-slate-400 leading-tight">{it}</p>
          </div>
        ))}
        {Array.from({ length: 8 - items.length }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-slate-950/30 border border-dashed border-slate-800 rounded-3xl" />
        ))}
      </div>
    </div>
  );
};

const SoundOasis: React.FC = () => {
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const sounds = [
    { name: 'Rain', icon: '🌧️' },
    { name: 'Forest', icon: '🍃' },
    { name: 'Waves', icon: '🌊' },
    { name: 'Lo-Fi', icon: '🎹' },
    { name: 'Static', icon: '📻' },
    { name: 'Night', icon: '🌌' },
  ];

  const toggleSound = (name: string) => {
    setActiveSounds(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-10 animate-in fade-in zoom-in duration-300">
      <p className="text-slate-400 font-medium">Toggle layers to build your perfect focus atmosphere.</p>
      <div className="grid grid-cols-3 gap-6">
        {sounds.map(s => (
          <button 
            key={s.name} onClick={() => toggleSound(s.name)}
            className={`p-8 rounded-[2rem] flex flex-col items-center gap-4 transition-all border group ${activeSounds.includes(s.name) ? 'bg-purple-600 border-purple-500 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900'}`}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{s.icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${activeSounds.includes(s.name) ? 'text-purple-400' : 'text-slate-600'}`}>{s.name}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-1 h-8 items-end">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`w-1 bg-purple-500/40 rounded-full transition-all duration-300 ${activeSounds.length > 0 ? 'animate-pulse' : 'h-1'}`} style={{ height: activeSounds.length > 0 ? `${Math.random() * 100}%` : '4px', animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    </div>
  );
};

const DigitalDeclutter: React.FC = () => {
  const [clutter, setClutter] = useState<{id: number, x: number, y: number, icon: string}[]>([]);
  const icons = ['📱', '💬', '📧', '🔔', '🔴', '⚠️'];

  const spawn = () => {
    setClutter(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, icon: icons[Math.floor(Math.random() * icons.length)] }]);
  };

  useEffect(() => {
    const interval = setInterval(spawn, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <p className="text-slate-400 font-medium italic">Click the distractions to clear your screen.</p>
      <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-[2.5rem] border-2 border-slate-800 overflow-hidden shadow-inner cursor-crosshair">
        {clutter.map(c => (
          <button 
            key={c.id} 
            onClick={() => setClutter(prev => prev.filter(p => p.id !== c.id))}
            className="absolute transition-all hover:scale-150 active:scale-50 text-4xl animate-in zoom-in duration-300"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            {c.icon}
          </button>
        ))}
        {clutter.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase text-slate-800 tracking-[0.5em]">System Clear</span>
          </div>
        )}
      </div>
      <div className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Active Distractions: {clutter.length}</div>
    </div>
  );
};

const ColorTherapy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#a855f7');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 20;
    ctx.strokeStyle = brushColor;
  }, [brushColor]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full max-w-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['#581c87', '#7e22ce', '#9333ea', '#a855f7', '#c084fc'].map(c => (
            <button key={c} onClick={() => setBrushColor(c)} className={`w-8 h-8 rounded-full border-2 ${brushColor === c ? 'border-purple-500' : 'border-transparent'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
        <button onClick={clear} className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-purple-400">Clear Canvas</button>
      </div>
      <canvas 
        ref={canvasRef} width={800} height={500}
        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
        onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
        className="w-full aspect-[16/10] bg-slate-950 rounded-[2.5rem] border-2 border-slate-800 shadow-inner cursor-crosshair touch-none"
      />
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Free-form fluid doodling for sensory release</p>
    </div>
  );
};

export default Games;
