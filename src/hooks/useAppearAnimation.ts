
import { useMemo } from 'react';

interface UseAppearAnimationParams {
  gridX: number;
  gridY: number;
  delay?: number;
}

export const useAppearAnimation = ({ gridX, gridY, delay = 0 }: UseAppearAnimationParams) => {
  return useMemo(() => {
    // Детерминированная рандомизация только для длительности анимации
    const seed2 = Math.abs((gridX * 31 + gridY * 41) % 1000) / 1000;
    
    // Убираем случайную задержку - элементы появляются сразу
    const randomDelay = 0;
    
    // Случайная длительность от 300ms до 600ms (быстрее чем раньше)
    const randomDuration = 300 + (seed2 * 300);
    
    // Добавляем только базовую задержку если передана
    const totalDelay = delay + randomDelay;
    
    return {
      animationDelay: `${totalDelay}ms`,
      animationDuration: `${randomDuration}ms`,
      // CSS custom properties для анимации
      '--appear-delay': `${totalDelay}ms`,
      '--appear-duration': `${randomDuration}ms`,
    };
  }, [gridX, gridY, delay]);
};
