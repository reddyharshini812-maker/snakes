import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="dashboard font-sans selection:bg-magenta/30 tear">
      <div className="scanlines" />
      <div className="static-noise" />

      <header className="bento-card header-card z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="logo glitch-text font-digital"
          data-text="SYS.CORE_V1.0"
        >
          SYS.CORE_V1.0
        </motion.div>
        <div className="status-pill">[ERR_CODE: 0x00F]</div>
      </header>

      <aside className="bento-card library-card z-10">
        <div className="section-title">// AUDIO_SUBSYSTEM</div>
        <MusicPlayer />
      </aside>

      <section className="bento-card game-card z-10">
        <SnakeGame />
      </section>

      <aside className="bento-card stats-card z-10">
        <div className="section-title">// INPUT_OVERRIDE</div>
        <div className="p-4 bg-black border-2 border-[#FF00FF] space-y-1">
          <span className="text-xs text-[#00FFFF] uppercase tracking-wider font-digital">VECTOR</span>
          <p className="text-xl font-bold text-[#FF00FF]">ARROWS</p>
        </div>
        <div className="p-4 bg-black border-2 border-[#00FFFF] space-y-1">
          <span className="text-xs text-[#FF00FF] uppercase tracking-wider font-digital">HALT</span>
          <p className="text-xl font-bold text-[#00FFFF]">SPACE</p>
        </div>
        
        <div className="mt-auto section-title">// SYS_INFO</div>
        <p className="text-[#00FFFF] text-lg font-mono leading-relaxed">
          &gt; MEMORY LEAK DETECTED.<br/>
          &gt; OVERRIDING PROTOCOLS.<br/>
          &gt; AWAITING INPUT...
        </p>
      </aside>

      <footer className="bento-card player-card z-10">
        <div className="text-[#FF00FF] text-sm uppercase tracking-[0.3em] font-digital">
          &copy; 2099 NEON_VOID_CORP
        </div>
      </footer>
    </div>
  );
}


