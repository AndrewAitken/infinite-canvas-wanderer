

import { useMemo } from 'react';

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
    
    // Calculate visible grid bounds
    const startGridX = Math.floor(-offset.x / gridSize) - bufferSize;
    const endGridX = Math.ceil((-offset.x + canvasSize.width) / gridSize) + bufferSize;
    const startGridY = Math.floor(-offset.y / gridSize) - bufferSize;
    const endGridY = Math.ceil((-offset.y + canvasSize.height) / gridSize) + bufferSize;

    // Увеличенный размер для мобильной версии - мобиль: 250px ширина, 350px высота
    const rectWidth = gridSize < 300 ? 250 : 248;
    const rectHeight = gridSize < 300 ? 350 : 331;

    // Generate items for visible area
    for (let gridX = startGridX; gridX <= endGridX; gridX++) {
      for (let gridY = startGridY; gridY <= endGridY; gridY++) {
        const x = gridX * gridSize + (gridSize - rectWidth) / 2; // Center rectangles in grid
        const y = gridY * gridSize + (gridSize - rectHeight) / 2;
        
        items.push({
          x,
          y,
          gridX,
          gridY,
        });
      }
    }

    return items;
  }, [offset, canvasSize, gridSize, bufferSize]);
};

