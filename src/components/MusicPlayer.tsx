
import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import useSound from 'use-sound';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const { toast } = useToast();

  // Primary audio file
  const [play, { stop }] = useSound('/bgRFD2.mp3', {
    loop: true,
    volume: 0.7,
    onload: () => {
      console.log('✅ Primary audio loaded successfully');
      setAudioError(false);
    },
    onloaderror: () => {
      console.log('❌ Primary file failed, trying fallback');
      setAudioError(true);
    }
  });

  // Fallback audio file
  const [playFallback, { stop: stopFallback }] = useSound('/bgRFD.mp3', {
    loop: true,
    volume: 0.7,
    onload: () => {
      console.log('✅ Fallback audio loaded successfully');
    },
    onloaderror: () => {
      console.log('❌ Fallback file also failed');
    }
  });

  // Setup Media Session API
  const setupMediaSession = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'bgRFD2',
        artist: 'Unknown Artist',
        album: 'Background Music',
      });

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayback();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayback();
      });
    }
  };

  useEffect(() => {
    setupMediaSession();
  }, []);

  // Update Media Session playback state
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const togglePlayback = () => {
    try {
      if (isPlaying) {
        console.log('⏸️ Pausing audio');
        stop();
        stopFallback();
        setIsPlaying(false);
      } else {
        console.log('▶️ Starting audio playback');
        console.log('Audio error state:', audioError);
        
        // Try primary file first
        if (!audioError) {
          console.log('🎵 Attempting to play primary file: bgRFD2.mp3');
          try {
            play();
            setIsPlaying(true);
            console.log('✅ Primary file playback started');
          } catch (primaryError) {
            console.log('❌ Primary file playback failed:', primaryError);
            // If primary fails, try fallback
            console.log('🎵 Attempting to play fallback file: bgRFD.mp3');
            try {
              playFallback();
              setIsPlaying(true);
              console.log('✅ Fallback file playback started');
            } catch (fallbackError) {
              console.log('❌ Fallback file playback also failed:', fallbackError);
              throw fallbackError;
            }
          }
        } else {
          // If primary failed to load, try fallback directly
          console.log('🎵 Primary file failed to load, using fallback: bgRFD.mp3');
          try {
            playFallback();
            setIsPlaying(true);
            console.log('✅ Fallback file playback started');
          } catch (fallbackError) {
            console.log('❌ Fallback file playback failed:', fallbackError);
            throw fallbackError;
          }
        }

        // Show success notification only on first successful play
        if (!hasPlayedOnce) {
          setHasPlayedOnce(true);
          toast({
            title: "Музыка запущена",
            description: "Наслаждайтесь прослушиванием!",
          });
        }
      }
    } catch (playError) {
      console.error('💥 Playback error:', playError);
      setIsPlaying(false);
      
      toast({
        title: "Ошибка воспроизведения",
        description: "Не удалось запустить музыку. Возможно, браузер блокирует автовоспроизведение.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default MusicPlayer;
