
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Check if Permissions API is supported
  const isPermissionsAPISupported = 'permissions' in navigator;

  // Request media permissions
  const requestMediaPermission = async (): Promise<boolean> => {
    if (!isPermissionsAPISupported) {
      console.log('Permissions API not supported, proceeding with direct play attempt');
      return true;
    }

    try {
      // Try to query autoplay permission
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permission.state);
      
      if (permission.state === 'granted') {
        return true;
      } else if (permission.state === 'prompt') {
        toast({
          title: "Разрешение на воспроизведение",
          description: "Нажмите play для запроса разрешения на воспроизведение музыки",
        });
        return true;
      } else {
        toast({
          title: "Разрешение отклонено",
          description: "Разрешите воспроизведение музыки в настройках браузера",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.log('Permission query failed, proceeding anyway:', error);
      return true;
    }
  };

  // Setup Media Session API
  const setupMediaSession = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Flawed Mangoes Swimming',
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
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
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
        description: "Не удалось загрузить аудиофайл",
        variant: "destructive",
      });
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handlePlay = () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };

    const handlePause = () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Setup media session
    setupMediaSession();

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
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
        // Request permission before first play
        if (!hasPlayedOnce) {
          const hasPermission = await requestMediaPermission();
          if (!hasPermission) {
            setIsLoading(false);
            return;
          }
        }

        await audio.play();
        setIsPlaying(true);
        
        // Show success notification only on first successful play
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
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast({
            title: "Воспроизведение заблокировано",
            description: "Разрешите автоматическое воспроизведение в настройках браузера",
            variant: "destructive",
          });
        } else if (error.name === 'NotSupportedError') {
          toast({
            title: "Формат не поддерживается",
            description: "Ваш браузер не поддерживает данный аудиоформат",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка воспроизведения",
            description: "Не удалось запустить музыку. Попробуйте еще раз.",
            variant: "destructive",
          });
        }
      }
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
        preload="metadata"
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
