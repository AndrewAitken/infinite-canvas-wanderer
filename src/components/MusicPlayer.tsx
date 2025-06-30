
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

  // Check file availability
  const checkFileAvailability = async (filePath: string): Promise<boolean> => {
    try {
      console.log(`🔍 Checking file availability: ${filePath}`);
      const response = await fetch(filePath, { method: 'HEAD' });
      console.log(`📊 File check response:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      return response.ok;
    } catch (error) {
      console.error(`❌ File availability check failed for ${filePath}:`, error);
      return false;
    }
  };

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

  // Log audio element state
  const logAudioState = (context: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    console.log(`🎵 Audio state (${context}):`, {
      src: audio.src,
      currentSrc: audio.currentSrc,
      readyState: audio.readyState,
      networkState: audio.networkState,
      paused: audio.paused,
      ended: audio.ended,
      duration: audio.duration,
      currentTime: audio.currentTime,
      buffered: audio.buffered.length > 0 ? `${audio.buffered.start(0)} - ${audio.buffered.end(0)}` : 'none',
      error: audio.error ? {
        code: audio.error.code,
        message: audio.error.message
      } : null
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log('🔄 Audio: loadstart event');
      setIsLoading(true);
      logAudioState('loadstart');
    };

    const handleLoadedMetadata = () => {
      console.log('📋 Audio: loadedmetadata event');
      logAudioState('loadedmetadata');
    };

    const handleLoadedData = () => {
      console.log('📦 Audio: loadeddata event');
      logAudioState('loadeddata');
    };

    const handleCanPlay = () => {
      console.log('✅ Audio: canplay event');
      setAudioError(false);
      setIsLoading(false);
      logAudioState('canplay');
    };

    const handleCanPlayThrough = () => {
      console.log('🚀 Audio: canplaythrough event');
      logAudioState('canplaythrough');
    };

    const handleError = () => {
      console.error('❌ Audio: error event');
      logAudioState('error');
      setAudioError(true);
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить аудиофайл",
        variant: "destructive",
      });
    };

    const handleEnded = () => {
      console.log('🔚 Audio: ended event');
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    const handlePlay = () => {
      console.log('▶️ Audio: play event');
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };

    const handlePause = () => {
      console.log('⏸️ Audio: pause event');
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    const handleSuspend = () => {
      console.log('⏳ Audio: suspend event');
      logAudioState('suspend');
    };

    const handleStalled = () => {
      console.log('🛑 Audio: stalled event');
      logAudioState('stalled');
    };

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('stalled', handleStalled);

    // Setup media session
    setupMediaSession();

    // Initial file check
    checkFileAvailability('/bgRFD2.mp3').then(available => {
      console.log(`📁 bgRFD2.mp3 availability: ${available}`);
      if (!available) {
        console.log('🔄 Checking fallback file...');
        checkFileAvailability('/bgRFD.mp3').then(fallbackAvailable => {
          console.log(`📁 bgRFD.mp3 availability: ${fallbackAvailable}`);
        });
      }
    });

    // Log initial audio state
    logAudioState('initial');

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('stalled', handleStalled);
    };
  }, [toast]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) {
      console.log('🚫 Cannot toggle playback:', { audioExists: !!audio, audioError });
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🎯 Attempting to ${isPlaying ? 'pause' : 'play'} audio`);
      logAudioState('before toggle');

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        console.log('⏸️ Audio paused');
      } else {
        // Request permission before first play
        if (!hasPlayedOnce) {
          console.log('🔐 Requesting permission for first play...');
          const hasPermission = await requestMediaPermission();
          if (!hasPermission) {
            console.log('❌ Permission denied');
            setIsLoading(false);
            return;
          }
        }

        // Check file availability before playing
        const isFileAvailable = await checkFileAvailability('/bgRFD2.mp3');
        if (!isFileAvailable) {
          console.log('🔄 Primary file not available, trying fallback...');
          const isFallbackAvailable = await checkFileAvailability('/bgRFD.mp3');
          if (isFallbackAvailable) {
            console.log('🔄 Switching to fallback file');
            audio.src = '/bgRFD.mp3';
          } else {
            console.error('❌ Neither primary nor fallback file is available');
            toast({
              title: "Файл не найден",
              description: "Аудиофайл недоступен",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        }

        console.log('🎵 Attempting to play audio...');
        await audio.play();
        setIsPlaying(true);
        console.log('✅ Audio play started successfully');
        
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
      console.error('💥 Playback error:', error);
      setIsPlaying(false);
      
      // Handle different types of errors
      if (error instanceof Error) {
        console.log('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
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
            description: `Не удалось запустить музыку: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
      logAudioState('after toggle');
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/bgRFD2.mp3" 
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
