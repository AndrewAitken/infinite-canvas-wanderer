
import { useMemo } from 'react';
import { PoissonDiskSampler } from '../utils/poissonDisk';

interface VirtualizationParams {
  offset: { x: number; y: number };
  canvasSize: { width: number; height: number };
  gridSize: number;
  bufferSize: number;
}

interface VirtualItem {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  pointIndex: number;
  nearbyAlbums: string[]; // Список соседних обложек
}

export const useVirtualization = ({
  offset,
  canvasSize,
  gridSize,
  bufferSize,
}: VirtualizationParams): VirtualItem[] => {
  return useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }

    const items: VirtualItem[] = [];
    const sectorSize = gridSize;

    // Увеличиваем минимальное расстояние для лучшего разделения
    const minDistance = sectorSize < 350 ? 380 : 450;
    const sampler = new PoissonDiskSampler(minDistance, sectorSize);
    
    // Вычисляем видимые секторы
    const startSectorX = Math.floor(-offset.x / sectorSize) - bufferSize;
    const endSectorX = Math.ceil((-offset.x + canvasSize.width) / sectorSize) + bufferSize;
    const startSectorY = Math.floor(-offset.y / sectorSize) - bufferSize;
    const endSectorY = Math.ceil((-offset.y + canvasSize.height) / sectorSize) + bufferSize;

    // Сначала генерируем все точки
    const allPoints: Array<{x: number, y: number, gridX: number, gridY: number, pointIndex: number}> = [];
    
    for (let sectorX = startSectorX; sectorX <= endSectorX; sectorX++) {
      for (let sectorY = startSectorY; sectorY <= endSectorY; sectorY++) {
        const points = sampler.generatePointsForSector(sectorX, sectorY);
        
        points.forEach((point, pointIndex) => {
          allPoints.push({
            x: point.x,
            y: point.y,
            gridX: sectorX,
            gridY: sectorY,
            pointIndex,
          });
        });
      }
    }

    // Теперь для каждой точки находим соседние обложки
    allPoints.forEach((item) => {
      const nearbyAlbums: string[] = [];
      const searchRadius = 600; // Радиус поиска соседей
      
      allPoints.forEach((otherItem) => {
        if (otherItem === item) return;
        
        const distance = Math.sqrt(
          Math.pow(item.x - otherItem.x, 2) + Math.pow(item.y - otherItem.y, 2)
        );
        
        if (distance <= searchRadius) {
          // Генерируем обложку для соседа, чтобы добавить в список исключений
          const albumCovers = ['/RFD 06.09.2024.jpg', '/RFD01111024.jpg', '/RFD03102024.jpg', '/RFD04042025.jpg', '/RFD08112024-1.jpg', '/RFD08112024.jpg', '/RFD13122024.jpg', '/RFD14022025.jpg', '/RFD14032025.jpg', '/RFD17012025.jpg', '/RFD181024.jpg', '/RFD21032025.jpg', '/RFD22112024.jpg', '/RFD23082024.jpg', '/RFD24012025.jpg', '/RFD251024.jpg', '/RFD27092024.jpg', '/RFD28032025.jpg', '/RFD29112024.jpg', '/RFD30082024.jpg', '/RFD31012025.jpg', '/RFD_20.06.2025.jpg'];
          
          const hash1 = Math.abs(otherItem.gridX * 97 + otherItem.gridY * 101 + otherItem.pointIndex * 89) % 1009;
          const hash2 = Math.abs(otherItem.gridX * 103 + otherItem.gridY * 107 + otherItem.pointIndex * 91) % 1013;
          const hash3 = Math.abs(otherItem.gridX * 109 + otherItem.gridY * 113 + otherItem.pointIndex * 93) % 1019;
          const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;
          const neighborAlbum = albumCovers[combinedHash];
          
          if (!nearbyAlbums.includes(neighborAlbum)) {
            nearbyAlbums.push(neighborAlbum);
          }
        }
      });
      
      items.push({
        ...item,
        nearbyAlbums,
      });
    });

    return items;
  }, [offset, canvasSize, gridSize, bufferSize]);
};
