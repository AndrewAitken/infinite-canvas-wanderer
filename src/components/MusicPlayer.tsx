
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const tryAutoplay = async () => {
      try {
        // Устанавливаем громкость и другие настройки
        audio.volume = 0.7;
        await audio.play();
        setIsPlaying(true);
        console.log('Music started automatically');
      } catch (error) {
        console.log('Autoplay blocked, waiting for user interaction');
        
        const handleFirstInteraction = async () => {
          if (!hasUserInteracted) {
            setHasUserInteracted(true);
            try {
              await audio.play();
              setIsPlaying(true);
              console.log('Music started after user interaction');
            } catch (err) {
              console.error('Error playing audio after interaction:', err);
            }
          }
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });
      }
    };

    audio.addEventListener('ended', handleEnded);
    
    // Пытаемся запустить музыку сразу при загрузке
    tryAutoplay();

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [hasUserInteracted]);

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
        setHasUserInteracted(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/bgRFD.mp3" 
        loop 
        preload="auto"
        autoPlay
      />
      <Button
        onClick={togglePlayback}
        size="icon"
        variant="outline"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border-2 border-gray-100 hover:bg-white/40 hover:border-gray-200 dark:bg-stone-800/30 dark:border-stone-700 dark:hover:bg-stone-800/40 dark:hover:border-stone-600 transition-all duration-200"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-gray-700 dark:text-white" />
        ) : (
          <Play className="w-6 h-6 text-gray-700 dark:text-white ml-0.5" />
        )}
      </Button>
    </>
  );
};

export default MusicPlayer;
