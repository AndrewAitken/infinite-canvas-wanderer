
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
    
    // Случайная задержка от 0 до 1500ms (увеличена)
    const randomDelay = seed1 * 1500;
    
    // Случайная длительность от 800ms до 1600ms (увеличена)
    const randomDuration = 800 + (seed2 * 800);
    
    // Добавляем базовую задержку если передана
    const totalDelay = delay + randomDelay;
    
    return {
      animationDelay: `${totalDelay}ms`,
      animationDuration: `${randomDuration}ms`,
      // CSS custom properties для более сложной анимации
      '--appear-delay': `${totalDelay}ms`,
      '--appear-duration': `${randomDuration}ms`,
    };
  }, [gridX, gridY, delay]);
};
