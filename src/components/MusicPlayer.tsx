
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setAudioError(false);
      setIsLoading(false);
    };

    const handleError = () => {
      console.error('Audio loading error');
      setAudioError(true);
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить аудиофайл. Проверьте подключение к интернету.",
        variant: "destructive",
      });
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [toast]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    try {
      setIsLoading(true);

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        
        // Показать уведомление только при первом успешном запуске
        if (!hasPlayedOnce) {
          setHasPlayedOnce(true);
          toast({
            title: "Музыка запущена",
            description: "Наслаждайтесь прослушиванием!",
          });
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
      
      toast({
        title: "Ошибка воспроизведения",
        description: "Не удалось запустить музыку. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/Flawed Mangoes Swimming.mp3" 
        loop 
        preload="auto"
      />
      <Button
        onClick={togglePlayback}
        disabled={isLoading || audioError}
        size="icon"
        variant="outline"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border-2 border-gray-100 hover:bg-white/40 hover:border-gray-200 dark:bg-stone-800/30 dark:border-stone-700 dark:hover:bg-stone-800/40 dark:hover:border-stone-600 transition-all duration-200"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-gray-700 dark:border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6 text-gray-700 dark:text-white" />
        ) : (
          <Play className="w-6 h-6 text-gray-700 dark:text-white ml-0.5" />
        )}
      </Button>
    </>
  );
};

export default MusicPlayer;
