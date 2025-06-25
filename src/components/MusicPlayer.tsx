
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/vanishinghope.mp3" loop preload="metadata" />
      <Button
        onClick={togglePlayback}
        size="icon"
        variant="outline"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:bg-white/90 hover:border-gray-200 dark:bg-stone-800/80 dark:border-stone-700 dark:hover:bg-stone-800/90 dark:hover:border-stone-600 transition-all duration-200"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-gray-700 dark:text-stone-200" />
        ) : (
          <Play className="w-6 h-6 text-gray-700 dark:text-stone-200 ml-0.5" />
        )}
      </Button>
    </>
  );
};

export default MusicPlayer;
