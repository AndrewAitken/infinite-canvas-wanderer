
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
    
    // Увеличенная случайная задержка от 0 до 3000ms (3 секунды)
    const randomDelay = seed1 * 3000;
    
    // Увеличенная случайная длительность от 1200ms до 2400ms
    const randomDuration = 1200 + (seed2 * 1200);
    
    // Параметры для диагонального движения
    const diagonalDistance = 100 + (seed3 * 200); // 100-300px расстояние
    const diagonalDuration = 1500 + (seed4 * 1000); // 1.5-2.5 секунды
    
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
