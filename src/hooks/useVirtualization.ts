
import { useMemo } from 'react';
import { PoissonDiskSampler } from '../utils/poissonDisk';

interface VirtualizationParams {
  offset: { x: number; y: number };
  canvasSize: { width: number; height: number };
  gridSize: number;
  bufferSize: number;
  isGridAligned?: boolean;
}

interface VirtualItem {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  pointIndex: number;
}

export const useVirtualization = ({
  offset,
  canvasSize,
  gridSize,
  bufferSize,
  isGridAligned = false,
}: VirtualizationParams): VirtualItem[] => {
  return useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }

    const items: VirtualItem[] = [];
    const sectorSize = gridSize;

    // Вычисляем видимые секторы
    const startSectorX = Math.floor(-offset.x / sectorSize) - bufferSize;
    const endSectorX = Math.ceil((-offset.x + canvasSize.width) / sectorSize) + bufferSize;
    const startSectorY = Math.floor(-offset.y / sectorSize) - bufferSize;
    const endSectorY = Math.ceil((-offset.y + canvasSize.height) / sectorSize) + bufferSize;

    if (isGridAligned) {
      // Строгая сетка с достаточными отступами
      // Размеры элементов: 248-250px ширина, 331-350px высота
      const elementWidth = 248;
      const elementHeight = 331;
      const minHorizontalGap = 80; // минимальный отступ слева-справа
      const minVerticalGap = 80; // минимальный отступ сверху-снизу
      
      // Общий шаг сетки с учетом размера элемента и отступов
      const gridStepX = elementWidth + minHorizontalGap;
      const gridStepY = elementHeight + minVerticalGap;
      
      for (let sectorX = startSectorX; sectorX <= endSectorX; sectorX++) {
        for (let sectorY = startSectorY; sectorY <= endSectorY; sectorY++) {
          // Размещаем одну точку в центре каждого сектора с учетом шага сетки
          const x = sectorX * gridStepX + elementWidth / 2;
          const y = sectorY * gridStepY + elementHeight / 2;
          
          items.push({
            x,
            y,
            gridX: sectorX,
            gridY: sectorY,
            pointIndex: 0,
          });
        }
      }
    } else {
      // Используем Poisson Disk Sampling для случайного размещения
      const minDistance = sectorSize < 350 ? 280 : 350;
      const sampler = new PoissonDiskSampler(minDistance, sectorSize);
      
      for (let sectorX = startSectorX; sectorX <= endSectorX; sectorX++) {
        for (let sectorY = startSectorY; sectorY <= endSectorY; sectorY++) {
          const points = sampler.generatePointsForSector(sectorX, sectorY);
          
          points.forEach((point, pointIndex) => {
            items.push({
              x: point.x,
              y: point.y,
              gridX: sectorX,
              gridY: sectorY,
              pointIndex,
            });
          });
        }
      }
    }

    return items;
  }, [offset.x, offset.y, canvasSize.width, canvasSize.height, gridSize, bufferSize, isGridAligned]);
};
