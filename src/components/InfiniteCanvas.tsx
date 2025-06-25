
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useDrag } from '../hooks/useDrag';
import { useVirtualization } from '../hooks/useVirtualization';
import CoverSquare from './CoverSquare';
import AlbumDetailPanel from './AlbumDetailPanel';
import { getAlbumData, Album, getAlbumIndex, getAllAlbums, getNextAlbumIndex, getPreviousAlbumIndex, getAlbumByIndex } from '../data/albumData';

const GRID_SIZE = 350; // Increased from 200 to 350 for more spacing
const BUFFER_SIZE = 2; // Extra cells to render outside viewport

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  
  const allAlbums = getAllAlbums();
  
  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { offset, isDragging, handleMouseDown, handleTouchStart } = useDrag();
  
  const visibleItems = useVirtualization({
    offset,
    canvasSize,
    gridSize: GRID_SIZE,
    bufferSize: BUFFER_SIZE,
  });

  const handleAlbumClick = useCallback((imageUrl: string) => {
    const albumData = getAlbumData(imageUrl);
    const albumIndex = getAlbumIndex(imageUrl);
    
    setSelectedAlbum(albumData);
    setCurrentAlbumIndex(albumIndex >= 0 ? albumIndex : 0);
    setIsPanelOpen(true);
  }, []);

  const handleNextAlbum = useCallback(() => {
    const nextIndex = getNextAlbumIndex(currentAlbumIndex);
    const nextAlbum = getAlbumByIndex(nextIndex);
    
    if (nextAlbum) {
      setSelectedAlbum(nextAlbum);
      setCurrentAlbumIndex(nextIndex);
    }
  }, [currentAlbumIndex]);

  const handlePreviousAlbum = useCallback(() => {
    const prevIndex = getPreviousAlbumIndex(currentAlbumIndex);
    const prevAlbum = getAlbumByIndex(prevIndex);
    
    if (prevAlbum) {
      setSelectedAlbum(prevAlbum);
      setCurrentAlbumIndex(prevIndex);
    }
  }, [currentAlbumIndex]);

  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedAlbum(null);
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        className={`fixed inset-0 overflow-hidden bg-stone-100 cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isPanelOpen ? 'backdrop-blur-sm bg-stone-100/80' : ''
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {visibleItems.map((item) => (
            <CoverSquare
              key={`${item.gridX}-${item.gridY}`}
              x={item.x}
              y={item.y}
              gridX={item.gridX}
              gridY={item.gridY}
              canvasSize={canvasSize}
              offset={offset}
              onAlbumClick={handleAlbumClick}
            />
          ))}
        </div>
      </div>

      <AlbumDetailPanel
        album={selectedAlbum}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onNext={handleNextAlbum}
        onPrevious={handlePreviousAlbum}
        currentIndex={currentAlbumIndex}
        totalCount={allAlbums.length}
      />
    </>
  );
};

export default InfiniteCanvas;
