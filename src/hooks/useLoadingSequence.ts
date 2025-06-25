
import { useState, useEffect } from 'react';

export const useLoadingSequence = () => {
  const [loadingStage, setLoadingStage] = useState<'logo-center' | 'logo-moving' | 'albums-loading' | 'complete'>('logo-center');

  useEffect(() => {
    // Этап 1: Логотип появляется в центре (500ms)
    const timer1 = setTimeout(() => {
      setLoadingStage('logo-moving');
    }, 500);

    // Этап 2: Логотип движется в угол (800ms)
    const timer2 = setTimeout(() => {
      setLoadingStage('albums-loading');
    }, 1300);

    // Этап 3: Альбомы начинают загружаться (небольшая задержка)
    const timer3 = setTimeout(() => {
      setLoadingStage('complete');
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return {
    isLogoInCenter: loadingStage === 'logo-center',
    isLogoMoving: loadingStage === 'logo-moving',
    shouldShowAlbums: loadingStage === 'albums-loading' || loadingStage === 'complete',
    isComplete: loadingStage === 'complete'
  };
};
