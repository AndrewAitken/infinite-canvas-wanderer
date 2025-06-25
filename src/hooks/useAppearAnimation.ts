
import { useMemo } from 'react';

interface UseAppearAnimationParams {
  gridX: number;
  gridY: number;
  delay?: number;
}

export const useAppearAnimation = ({ gridX, gridY, delay = 0 }: UseAppearAnimationParams) => {
  return useMemo(() => {
    // Детерминированная рандомизация на основе координат грида
    const seed1 = Math.abs((gridX * 17 + gy * 23) % 1000) / 1000;
    const seed2 = Math.abs((gridX * 31 + gridY * 41) % 1000) / 1000;
    const seed3 = Math.abs((gridX * 43 + gridY * 47) % 1000) / 1000;
    
    // Увеличенная случайная задержка от 0 до 2000ms для более медленного появления
    const randomDelay = seed1 * 2000;
    
    // Увеличенная случайная длительность от 1200ms до 2400ms для более медленной анимации
    const randomDuration = 1200 + (seed2 * 1200);
    
    // Дополнительная вариация для еще большей случайности
    const extraRandomDelay = seed3 * 800;
    
    // Добавляем базовую задержку если передана
    const totalDelay = delay + randomDelay + extraRandomDelay;
    
    return {
      animationDelay: `${totalDelay}ms`,
      animationDuration: `${randomDuration}ms`,
      // CSS custom properties для более сложной анимации
      '--appear-delay': `${totalDelay}ms`,
      '--appear-duration': `${randomDuration}ms`,
    };
  }, [gridX, gridY, delay]);
};
