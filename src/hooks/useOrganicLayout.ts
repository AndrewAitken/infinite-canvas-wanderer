
import { useMemo } from 'react';

interface OrganicItem {
  x: number;
  y: number;
  size: number;
  id: string;
  imageIndex: number;
}

interface OrganicLayoutParams {
  offset: { x: number; y: number };
  canvasSize: { width: number; height: number };
  isMobile: boolean;
}

export const useOrganicLayout = ({
  offset,
  canvasSize,
  isMobile,
}: OrganicLayoutParams): OrganicItem[] => {
  return useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }

    const items: OrganicItem[] = [];
    
    // Настройки для разных устройств
    const minDistance = isMobile ? 100 : 120;
    const baseSize = isMobile ? 200 : 180;
    const sizeVariation = isMobile ? 80 : 100;
    const density = isMobile ? 0.8 : 1.0;
    
    // Расширенная область для генерации (с буфером)
    const bufferSize = 1000;
    const viewportLeft = -offset.x - bufferSize;
    const viewportRight = -offset.x + canvasSize.width + bufferSize;
    const viewportTop = -offset.y - bufferSize;
    const viewportBottom = -offset.y + canvasSize.height + bufferSize;
    
    // Генерация случайных позиций методом Poisson Disk Sampling (упрощенная версия)
    const candidates: OrganicItem[] = [];
    const maxAttempts = 1000;
    
    // Создаем сетку для быстрой проверки расстояний
    const cellSize = minDistance / Math.sqrt(2);
    const gridWidth = Math.ceil((viewportRight - viewportLeft) / cellSize);
    const gridHeight = Math.ceil((viewportBottom - viewportTop) / cellSize);
    const occupiedCells: boolean[][] = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(false));
    
    // Функция для проверки, свободна ли позиция
    const isValidPosition = (x: number, y: number, size: number) => {
      const cellX = Math.floor((x - viewportLeft) / cellSize);
      const cellY = Math.floor((y - viewportTop) / cellSize);
      
      const checkRadius = Math.ceil((size / 2 + minDistance) / cellSize);
      
      for (let dx = -checkRadius; dx <= checkRadius; dx++) {
        for (let dy = -checkRadius; dy <= checkRadius; dy++) {
          const checkX = cellX + dx;
          const checkY = cellY + dy;
          
          if (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
            if (occupiedCells[checkX][checkY]) {
              return false;
            }
          }
        }
      }
      return true;
    };
    
    // Функция для занятия ячеек
    const occupyPosition = (x: number, y: number, size: number) => {
      const cellX = Math.floor((x - viewportLeft) / cellSize);
      const cellY = Math.floor((y - viewportTop) / cellSize);
      
      const occupyRadius = Math.ceil((size / 2 + minDistance) / cellSize);
      
      for (let dx = -occupyRadius; dx <= occupyRadius; dx++) {
        for (let dy = -occupyRadius; dy <= occupyRadius; dy++) {
          const checkX = cellX + dx;
          const checkY = cellY + dy;
          
          if (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
            occupiedCells[checkX][checkY] = true;
          }
        }
      }
    };
    
    // Генерация позиций
    let attempts = 0;
    let itemId = 0;
    
    while (attempts < maxAttempts && items.length < 200) {
      attempts++;
      
      // Случайная позиция в видимой области
      const x = viewportLeft + Math.random() * (viewportRight - viewportLeft);
      const y = viewportTop + Math.random() * (viewportBottom - viewportTop);
      
      // Случайный размер
      const sizeVariationFactor = 0.7 + Math.random() * 0.6; // 0.7 - 1.3
      const size = baseSize + (Math.random() - 0.5) * sizeVariation * sizeVariationFactor;
      
      if (isValidPosition(x, y, size)) {
        // Детерминированный выбор изображения на основе позиции
        const imageIndex = Math.floor(Math.abs(Math.sin(x * 0.001) * Math.cos(y * 0.001)) * 20);
        
        const item: OrganicItem = {
          x: x - size / 2,
          y: y - size / 2,
          size,
          id: `organic-${itemId++}`,
          imageIndex,
        };
        
        items.push(item);
        occupyPosition(x, y, size);
      }
    }
    
    return items;
  }, [offset.x, offset.y, canvasSize.width, canvasSize.height, isMobile]);
};
