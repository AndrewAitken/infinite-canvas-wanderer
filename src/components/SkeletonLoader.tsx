
import React from 'react';

interface SkeletonLoaderProps {
  width: number;
  height: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width, height, className = '' }) => {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl ${className}`}
      style={{ width, height }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🎵</div>
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
