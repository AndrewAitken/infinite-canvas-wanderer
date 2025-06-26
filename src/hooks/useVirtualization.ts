
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
      // Строгая сетка с равными отступами
      for (let sectorX = startSectorX; sectorX <= endSectorX; sectorX++) {
        for (let sectorY = startSectorY; sectorY <= endSectorY; sectorY++) {
          // Размещаем точки в регулярной сетке внутри сектора
          const pointsPerRow = 2;
          const pointsPerCol = 2;
          const spacing = sectorSize / (pointsPerRow + 1);
          
          let pointIndex = 0;
          for (let row = 0; row < pointsPerRow; row++) {
            for (let col = 0; col < pointsPerCol; col++) {
              const x = sectorX * sectorSize + spacing * (col + 1);
              const y = sectorY * sectorSize + spacing * (row + 1);
              
              items.push({
                x,
                y,
                gridX: sectorX,
                gridY: sectorY,
                pointIndex,
              });
              pointIndex++;
            }
          }
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
  }, [offset, canvasSize, gridSize, bufferSize, isGridAligned]);
};
