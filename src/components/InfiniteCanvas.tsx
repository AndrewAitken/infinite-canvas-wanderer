
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useDrag } from '../hooks/useDrag';
import { useVirtualization } from '../hooks/useVirtualization';
import { useFlyingAnimation } from '../hooks/useFlyingAnimation';
import CoverSquare from './CoverSquare';
import AlbumDetailPanel, { AlbumDetailPanelRef } from './AlbumDetailPanel';
import FlyingImageAnimation from './FlyingImageAnimation';
import GridToggle from './GridToggle';
import { getAlbumData, Album, getAlbumIndex, getAllAlbums, getNextAlbumIndex, getPreviousAlbumIndex, getAlbumByIndex } from '../data/albumData';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';

// Размеры сетки с учетом планшета
const GRID_SIZE_DESKTOP = 400; // 248px элемент + ~152px отступы (минимум 100px)
const GRID_SIZE_TABLET = 312; // 248px элемент + ~64px отступы (минимум 56px)
const GRID_SIZE_MOBILE = 346; // 250px элемент + ~96px отступы (минимум 48px горизонтально)
const BUFFER_SIZE = 2; // Extra cells to render outside viewport

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<AlbumDetailPanelRef>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [hiddenImageKey, setHiddenImageKey] = useState<string | null>(null);
  const [showStaticImage, setShowStaticImage] = useState(false);
  const [pendingAnimation, setPendingAnimation] = useState<{
    imageUrl: string;
    clickPosition: { x: number; y: number };
  } | null>(null);
  const [isGridAligned, setIsGridAligned] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const allAlbums = getAllAlbums();
  const { animationState, startFlyingAnimation, setAnimationPhase, stopFlyingAnimation } = useFlyingAnimation();
  
  // Определяем размер сетки в зависимости от устройства
  const gridSize = isMobile ? GRID_SIZE_MOBILE : isTablet ? GRID_SIZE_TABLET : GRID_SIZE_DESKTOP;
  
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

  const { offset, isDragging, isMomentum, handleMouseDown, handleTouchStart } = useDrag();
  
  const visibleItems = useVirtualization({
    offset,
    canvasSize,
    gridSize,
    bufferSize: BUFFER_SIZE,
    isGridAligned,
  });

  const handleGridToggle = useCallback(() => {
    setIsTransitioning(true);
    setIsGridAligned(prev => !prev);
    
    // Завершаем анимацию через 800ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, []);

  const handlePanelReady = useCallback(async () => {
    console.log('Panel ready callback triggered');
    
    if (!pendingAnimation) {
      console.log('No pending animation, exiting');
      return;
    }

    console.log('Processing pending animation:', pendingAnimation);
    
    // Multiple attempts to get accurate coordinates
    const maxAttempts = 5;
    let attempt = 1;
    
    const tryGetCoordinates = async (): Promise<void> => {
      console.log(`Attempt ${attempt}/${maxAttempts} to get panel coordinates`);
      
      const panelImagePos = panelRef.current?.getImagePosition();
      const panelImageSize = panelRef.current?.getImageSize();
      
      if (panelImagePos && panelImageSize && panelImagePos.x > 0 && panelImagePos.y > 0) {
        console.log('Successfully got panel coordinates:', {
          position: panelImagePos,
          size: panelImageSize,
          startPosition: pendingAnimation.clickPosition
        });
        
        startFlyingAnimation(
          pendingAnimation.imageUrl, 
          pendingAnimation.clickPosition, 
          panelImagePos
        );
        setPendingAnimation(null);
        return;
      }
      
      if (attempt < maxAttempts) {
        attempt++;
        console.log('Coordinates not ready, retrying in 100ms');
        await new Promise(resolve => setTimeout(resolve, 100));
        return tryGetCoordinates();
      }
      
      console.warn('Failed to get coordinates after all attempts, using fallback');
      // Fallback animation with estimated position
      const fallbackPos = {
        x: window.innerWidth - 300,
        y: window.innerHeight / 2
      };
      
      startFlyingAnimation(
        pendingAnimation.imageUrl, 
        pendingAnimation.clickPosition, 
        fallbackPos
      );
      setPendingAnimation(null);
    };
    
    await tryGetCoordinates();
  }, [pendingAnimation, startFlyingAnimation]);

  const handleAlbumClick = useCallback((imageUrl: string, clickPosition: { x: number; y: number }) => {
    const albumData = getAlbumData(imageUrl);
    const albumIndex = getAlbumIndex(imageUrl);
    
    // Hide the clicked image
    const imageKey = `${clickPosition.x}-${clickPosition.y}-${imageUrl}`;
    setHiddenImageKey(imageKey);
    
    // Set album data and open panel
    setSelectedAlbum(albumData);
    setCurrentAlbumIndex(albumIndex >= 0 ? albumIndex : 0);
    setIsPanelOpen(true);
    setShowStaticImage(false);
    
    // Store animation data to be used when panel is ready
    setPendingAnimation({ imageUrl, clickPosition });
  }, []);

  const handleFlyingAnimationReachTarget = useCallback(() => {
    // Show static image in panel when flying animation reaches target
    setShowStaticImage(true);
    setAnimationPhase('showing-in-panel');
  }, [setAnimationPhase]);

  const handleFlyingAnimationComplete = useCallback(() => {
    stopFlyingAnimation();
  }, [stopFlyingAnimation]);

  const handleNextAlbum = useCallback(() => {
    const nextIndex = getNextAlbumIndex(currentAlbumIndex);
    const nextAlbum = getAlbumByIndex(nextIndex);
    
    if (nextAlbum) {
      setSelectedAlbum(nextAlbum);
      setCurrentAlbumIndex(nextIndex);
      setShowStaticImage(true); // Show immediately for navigation
    }
  }, [currentAlbumIndex]);

  const handlePreviousAlbum = useCallback(() => {
    const prevIndex = getPreviousAlbumIndex(currentAlbumIndex);
    const prevAlbum = getAlbumByIndex(prevIndex);
    
    if (prevAlbum) {
      setSelectedAlbum(prevAlbum);
      setCurrentAlbumIndex(prevIndex);
      setShowStaticImage(true); // Show immediately for navigation
    }
  }, [currentAlbumIndex]);

  const handlePanelClose = useCallback(() => {
    // Simply close panel and show the hidden image back
    setIsPanelOpen(false);
    setSelectedAlbum(null);
    setShowStaticImage(false);
    setHiddenImageKey(null); // Show the original image back
    setPendingAnimation(null); // Clear any pending animation
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        className={`fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isPanelOpen ? 'backdrop-blur-sm bg-background/80' : ''
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: isDragging ? 'grabbing' : isMomentum ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: isDragging || isMomentum ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {visibleItems.map((item) => {
            const itemKey = `${item.gridX}-${item.gridY}-${item.pointIndex}`;
            const isHidden = hiddenImageKey?.includes(itemKey) || false;
            
            return (
              <CoverSquare
                key={itemKey}
                x={item.x}
                y={item.y}
                gridX={item.gridX}
                gridY={item.gridY}
                pointIndex={item.pointIndex}
                canvasSize={canvasSize}
                offset={offset}
                onAlbumClick={handleAlbumClick}
                isMobile={isMobile}
                isTablet={isTablet}
                isHidden={isHidden}
                isTransitioning={isTransitioning}
              />
            );
          })}
        </div>

        {/* Grid Toggle Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <GridToggle 
            isGridAligned={isGridAligned}
            onToggle={handleGridToggle}
          />
        </div>
      </div>

      <FlyingImageAnimation
        imageUrl={animationState.imageUrl}
        startPosition={animationState.startPosition}
        endPosition={animationState.endPosition}
        isVisible={animationState.isActive}
        onComplete={handleFlyingAnimationComplete}
        onReachTarget={handleFlyingAnimationReachTarget}
        targetImageSize={panelRef.current?.getImageSize() || { width: 300, height: 400 }}
      />

      <AlbumDetailPanel
        ref={panelRef}
        album={selectedAlbum}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onNext={handleNextAlbum}
        onPrevious={handlePreviousAlbum}
        currentIndex={currentAlbumIndex}
        totalCount={allAlbums.length}
        showStaticImage={showStaticImage}
        onPanelReady={handlePanelReady}
      />
    </>
  );
};

export default InfiniteCanvas;
