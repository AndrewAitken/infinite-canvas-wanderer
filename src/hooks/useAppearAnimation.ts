
import { useMemo } from 'react';

interface UseAppearAnimationParams {
  gridX: number;
  gridY: number;
  delay?: number;
}

export const useAppearAnimation = ({ gridX, gridY, delay = 0 }: UseAppearAnimationParams) => {
  return useMemo(() => {
    // Детерминированная рандомизация на основе координат грида
    const seed1 = Math.abs((gridX * 17 + gridY * 23) % 1000) / 1000;
    const seed2 = Math.abs((gridX * 31 + gridY * 41) % 1000) / 1000;
    const seed3 = Math.abs((gridX * 47 + gridY * 53) % 1000) / 1000;
    const seed4 = Math.abs((gridX * 61 + gridY * 67) % 1000) / 1000;
    
    // Очень медленная случайная задержка от 0 до 8 секунд
    const randomDelay = seed1 * 8000;
    
    // Очень медленная случайная длительность от 3 до 6 секунд
    const randomDuration = 3000 + (seed2 * 3000);
    
    // Параметры для диагонального движения - увеличенное расстояние
    const diagonalDistance = 150 + (seed3 * 150); // 150-300px расстояние
    const diagonalDuration = 3000 + (seed4 * 2000); // 3-5 секунд
    
    // Добавляем базовую задержку если передана
    const totalDelay = delay + randomDelay;
    
    return {
      animationDelay: `${totalDelay}ms`,
      animationDuration: `${randomDuration}ms`,
      // CSS custom properties для сложной анимации
      '--appear-delay': `${totalDelay}ms`,
      '--appear-duration': `${randomDuration}ms`,
      '--diagonal-distance': `${diagonalDistance}px`,
      '--diagonal-duration': `${diagonalDuration}ms`,
    };
  }, [gridX, gridY, delay]);
};
