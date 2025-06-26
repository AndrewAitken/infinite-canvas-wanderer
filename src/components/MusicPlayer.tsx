
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioPermissionRequested, setAudioPermissionRequested] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  const requestAudioPermission = async () => {
    if (!audioPermissionRequested) {
      toast({
        title: "Разрешение на воспроизведение",
        description: "Нажмите кнопку воспроизведения для запуска музыки. Браузер может запросить разрешение на автовоспроизведение.",
      });
      setAudioPermissionRequested(true);
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setIsLoading(true);
      
      // При первом взаимодействии запрашиваем разрешение и показуем уведомление
      if (!hasUserInteracted) {
        await requestAudioPermission();
        setHasUserInteracted(true);
        // Инициализируем аудио элемент
        audio.load();
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Пытаемся воспроизвести звук
        await audio.play();
        setIsPlaying(true);
        
        // Показываем успешное уведомление при первом воспроизведении
        if (audioPermissionRequested && !isPlaying) {
          toast({
            title: "Музыка запущена",
            description: "Наслаждайтесь прослушиванием!",
          });
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      
      // Показываем пользователю понятное сообщение об ошибке
      toast({
        title: "Ошибка воспроизведения",
        description: "Не удалось запустить музыку. Возможно, браузер заблокировал автовоспроизведение. Попробуйте нажать кнопку еще раз.",
        variant: "destructive",
      });
      
      // Сбрасываем состояния для повторной попытки
      setHasUserInteracted(false);
      setAudioPermissionRequested(false);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/Flawed Mangoes Swimming.mp3" loop preload="metadata" />
      <Button
        onClick={togglePlayback}
        disabled={isLoading}
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
