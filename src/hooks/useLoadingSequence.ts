
import { useState, useEffect } from 'react';

export const useLoadingSequence = () => {
  const [loadingStage, setLoadingStage] = useState<'logo-center' | 'logo-pause' | 'logo-moving' | 'albums-loading' | 'complete'>('logo-center');

  useEffect(() => {
    // Этап 1: Логотип появляется в центре (1800ms)
    const timer1 = setTimeout(() => {
      setLoadingStage('logo-pause');
    }, 1800);

    // Этап 2: Логотип задерживается (600ms)
    const timer2 = setTimeout(() => {
      setLoadingStage('logo-moving');
    }, 1800 + 600);

    // Этап 3: Логотип движется в угол (1200ms)
    const timer3 = setTimeout(() => {
      setLoadingStage('albums-loading');
    }, 1800 + 600 + 1200);

    // Этап 4: Пауза перед появлением карточек (456ms)
    const timer4 = setTimeout(() => {
      setLoadingStage('complete');
    }, 1800 + 600 + 1200 + 456);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return {
    isLogoInCenter: loadingStage === 'logo-center' || loadingStage === 'logo-pause',
    isLogoMoving: loadingStage === 'logo-moving',
    shouldShowAlbums: loadingStage === 'albums-loading' || loadingStage === 'complete',
    isComplete: loadingStage === 'complete'
  };
};
