
// Poisson Disk Sampling для равномерного случайного размещения
export interface Point {
  x: number;
  y: number;
}

export class PoissonDiskSampler {
  private minDistance: number;
  private sectorSize: number;
  private maxAttempts: number;

  constructor(minDistance: number = 450, sectorSize: number = 900, maxAttempts: number = 30) {
    this.minDistance = minDistance;
    this.sectorSize = sectorSize;
    this.maxAttempts = maxAttempts;
  }

  // Детерминированный псевдослучайный генератор на основе seed
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Генерация точек для сектора
  generatePointsForSector(sectorX: number, sectorY: number): Point[] {
    const points: Point[] = [];
    const seed = sectorX * 1000 + sectorY;
    
    // Уменьшаем количество точек на сектор для большего расстояния
    const targetPoints = Math.floor(1 + this.seededRandom(seed + 1) * 2); // 1-3 точки на сектор
    
    for (let attempt = 0; attempt < this.maxAttempts && points.length < targetPoints; attempt++) {
      const x = sectorX * this.sectorSize + this.seededRandom(seed + attempt * 2) * this.sectorSize;
      const y = sectorY * this.sectorSize + this.seededRandom(seed + attempt * 2 + 1) * this.sectorSize;
      
      const candidate: Point = { x, y };
      
      // Проверяем минимальное расстояние до существующих точек
      if (this.isValidPoint(candidate, points)) {
        points.push(candidate);
      }
    }
    
    return points;
  }

  private isValidPoint(candidate: Point, existingPoints: Point[]): boolean {
    for (const point of existingPoints) {
      const distance = Math.sqrt(
        Math.pow(candidate.x - point.x, 2) + Math.pow(candidate.y - point.y, 2)
      );
      if (distance < this.minDistance) {
        return false;
      }
    }
    return true;
  }
}
