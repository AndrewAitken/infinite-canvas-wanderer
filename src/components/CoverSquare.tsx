
import React from 'react';

interface CoverSquareProps {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
}

const CoverSquare: React.FC<CoverSquareProps> = ({ x, y, gridX, gridY }) => {
  // Generate a consistent color based on grid position
  const getColor = (gx: number, gy: number) => {
    const colors = [
      'bg-blue-400',
      'bg-green-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-yellow-400',
      'bg-red-400',
      'bg-indigo-400',
      'bg-teal-400',
    ];
    
    const index = Math.abs((gx * 7 + gy * 13) % colors.length);
    return colors[index];
  };

  const colorClass = getColor(gridX, gridY);

  return (
    <div
      className={`absolute w-32 h-32 ${colorClass} rounded-lg shadow-lg 
                  transform transition-transform duration-200 
                  hover:scale-105 hover:shadow-xl
                  flex items-center justify-center
                  border-2 border-white`}
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="text-white font-bold text-sm text-center">
        <div>{gridX}</div>
        <div>{gridY}</div>
      </div>
    </div>
  );
};

export default CoverSquare;
