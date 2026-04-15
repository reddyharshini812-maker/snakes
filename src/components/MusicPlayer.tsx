import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01",
    artist: "NULL_POINTER",
    duration: "3:45",
    color: "bg-[#00FFFF]",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CORRUPT_SECTOR",
    artist: "SYS_ADMIN",
    duration: "4:12",
    color: "bg-[#FF00FF]",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "BUFFER_OVERFLOW",
    artist: "UNKNOWN_ENTITY",
    duration: "2:58",
    color: "bg-[#00FFFF]",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full flex flex-col gap-6 relative h-full justify-center">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex gap-6 items-center">
        {/* Album Art Placeholder */}
        <div className={`w-24 h-24 border-2 border-[#00FFFF] flex items-center justify-center relative group bg-black`}>
          <Music2 className="w-10 h-10 text-[#FF00FF]" />
          
          {/* Animated Bars when playing */}
          {isPlaying && (
            <div className="absolute bottom-2 flex gap-1 items-end h-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 24, 8, 32, 4] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  className="w-2 bg-[#00FFFF]"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h3 className="text-xl font-digital truncate text-[#00FFFF]">{currentTrack.title}</h3>
            <p className="text-lg text-[#FF00FF] font-mono">{currentTrack.artist}</p>
          </motion.div>

          <div className="mt-4 space-y-2">
            <div className="h-2 w-full bg-black border border-[#FF00FF] overflow-hidden">
              <motion.div
                className={`h-full ${currentTrack.color}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm font-mono text-[#00FFFF]">
              <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t-2 border-[#FF00FF] pt-4">
        <div className="flex items-center gap-4">
          <button onClick={skipBackward} className="p-2 text-[#00FFFF] hover:text-[#FF00FF] transition-colors">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 border-2 border-[#00FFFF] bg-black text-[#FF00FF] flex items-center justify-center hover:bg-[#00FFFF] hover:text-black transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button onClick={skipForward} className="p-2 text-[#00FFFF] hover:text-[#FF00FF] transition-colors">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#FF00FF]">
          <Volume2 className="w-5 h-5" />
          <div className="w-16 h-2 bg-black border border-[#00FFFF]">
            <div className="w-3/4 h-full bg-[#FF00FF]" />
          </div>
        </div>
      </div>
    </div>
  );
}

