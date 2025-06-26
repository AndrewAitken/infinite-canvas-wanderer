
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

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
      <div className="fixed bottom-6 left-6 z-50 glass-button-wrap">
        <button
          onClick={togglePlayback}
          className="glass-button"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 glass-button-icon" />
          ) : (
            <Play className="w-6 h-6 glass-button-icon ml-0.5" />
          )}
        </button>
        <div className="glass-button-shadow"></div>
      </div>
    </>
  );
};

export default MusicPlayer;
