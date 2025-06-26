
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
    const seed3 = Math.abs((gridX * 43 + gridY * 47) % 1000) / 1000;
    const seed4 = Math.abs((gridX * 53 + gridY * 59) % 1000) / 1000;
    
    // Увеличенная случайная задержка от 0 до 4 секунд
    const randomDelay = seed1 * 4000;
    
    // Увеличенная случайная длительность от 1.5 до 3 секунд
    const randomDuration = 1500 + (seed2 * 1500);
    
    // Случайные параметры для диагонального движения
    const diagonalDistance = 100 + (seed3 * 150); // 100-250px
    const diagonalDuration = 8000 + (seed4 * 4000); // 8-12 секунд
    
    // Добавляем базовую задержку если передана
    const totalDelay = delay + randomDelay;
    
    return {
      animationDelay: `${totalDelay}ms`,
      animationDuration: `${randomDuration}ms`,
      // CSS custom properties для анимации появления
      '--appear-delay': `${totalDelay}ms`,
      '--appear-duration': `${randomDuration}ms`,
      // CSS custom properties для диагонального движения
      '--diagonal-distance': `${diagonalDistance}px`,
      '--diagonal-duration': `${diagonalDuration}ms`,
    };
  }, [gridX, gridY, delay]);
};
