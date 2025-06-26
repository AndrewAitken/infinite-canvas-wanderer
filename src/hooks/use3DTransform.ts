
import { useMemo } from 'react';

interface Use3DTransformParams {
  mouseX: number;
  mouseY: number;
  elementX: number;
  elementY: number;
  elementWidth: number;
  elementHeight: number;
  maxRotation?: number;
  maxDistance?: number;
  scaleEffect?: number;
}

export const use3DTransform = ({
  mouseX,
  mouseY,
  elementX,
  elementY,
  elementWidth,
  elementHeight,
  maxRotation = 18,
  maxDistance = 350,
  scaleEffect = 0.03
}: Use3DTransformParams) => {
  return useMemo(() => {
    // Центр элемента
    const centerX = elementX + elementWidth / 2;
    const centerY = elementY + elementHeight / 2;
    
    // Расстояние от курсора до центра элемента
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Если курсор слишком далеко, эффект отсутствует
    if (distance > maxDistance) {
      return {
        transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
        isHovered: false
      };
    }
    
    // Нормализованные координаты от -1 до 1
    const normalizedX = deltaX / maxDistance;
    const normalizedY = deltaY / maxDistance;
    
    // Углы поворота (инвертируем Y для естественного движения)
    const rotateY = normalizedX * maxRotation;
    const rotateX = -normalizedY * maxRotation;
    
    // Эффект масштабирования (чем ближе курсор, тем больше)
    const scaleFactor = 1 + (1 - distance / maxDistance) * scaleEffect;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleFactor})`,
      isHovered: distance < maxDistance * 0.7 // Считаем "наведенным" если курсор достаточно близко
    };
  }, [mouseX, mouseY, elementX, elementY, elementWidth, elementHeight, maxRotation, maxDistance, scaleEffect]);
};
