
import React from 'react';
import { Grid2X2, Grid3X3 } from 'lucide-react';
import { Button } from './ui/button';

interface GridToggleProps {
  isGridAligned: boolean;
  onToggle: () => void;
}

const GridToggle: React.FC<GridToggleProps> = ({ isGridAligned, onToggle }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border-2 border-gray-100 hover:bg-white/40 hover:border-gray-200 dark:bg-stone-800/30 dark:border-stone-700 dark:hover:bg-stone-800/40 dark:hover:border-stone-600 transition-all duration-200"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <Grid2X2 className={`h-6 w-6 text-gray-700 dark:text-white transition-all ${isGridAligned ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      <Grid3X3 className={`absolute h-6 w-6 text-gray-700 dark:text-white transition-all ${isGridAligned ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <span className="sr-only">Toggle grid alignment</span>
    </Button>
  );
};

export default GridToggle;
