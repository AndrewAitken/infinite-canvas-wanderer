
import { useMemo } from 'react';
import { PoissonDiskSampler } from '../utils/poissonDisk';

interface VirtualizationParams {
  offset: { x: number; y: number };
  canvasSize: { width: number; height: number };
  gridSize: number; // Теперь используется как sectorSize
  bufferSize: number;
}

interface VirtualItem {
  x: number;
  y: number;
  gridX: number; // Теперь это sectorX
  gridY: number; // Теперь это sectorY
  pointIndex: number; // Индекс точки в секторе
}

export const useVirtualization = ({
  offset,
  canvasSize,
  gridSize, // Переименуем в sectorSize для ясности
  bufferSize,
}: VirtualizationParams): VirtualItem[] => {
  return useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }

    const items: VirtualItem[] = [];
    const sectorSize = gridSize; // 400px сектор

    // Определяем минимальное расстояние в зависимости от размера устройства
    const minDistance = sectorSize < 350 ? 280 : 350;
    const sampler = new PoissonDiskSampler(minDistance, sectorSize);
    
    // Вычисляем видимые секторы
    const startSectorX = Math.floor(-offset.x / sectorSize) - bufferSize;
    const endSectorX = Math.ceil((-offset.x + canvasSize.width) / sectorSize) + bufferSize;
    const startSectorY = Math.floor(-offset.y / sectorSize) - bufferSize;
    const endSectorY = Math.ceil((-offset.y + canvasSize.height) / sectorSize) + bufferSize;

    // Генерируем точки для каждого видимого сектора
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

    return items;
  }, [offset, canvasSize, gridSize, bufferSize]);
};
