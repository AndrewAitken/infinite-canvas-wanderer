
import React, { forwardRef, useImperativeHandle, useRef, useCallback, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipe } from "@/hooks/useSwipe";

interface Album {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
}

interface AlbumDetailPanelProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalCount?: number;
  showStaticImage?: boolean;
  onPanelReady?: () => void;
}

export interface AlbumDetailPanelRef {
  getImagePosition: () => { x: number; y: number } | null;
  getImageSize: () => { width: number; height: number };
}

const AlbumDetailPanel = forwardRef<AlbumDetailPanelRef, AlbumDetailPanelProps>(({
  album,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  currentIndex = 0,
  totalCount = 1,
  showStaticImage = true,
  onPanelReady
}, ref) => {
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageStabilized, setImageStabilized] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const stabilizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    swipeHandlers
  } = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious
  });

  // Precise coordinate calculation with multiple fallbacks
  const getPreciseImageCoordinates = useCallback((maxAttempts = 3, attempt = 1): { x: number; y: number } | null => {
    console.log(`Getting image coordinates, attempt ${attempt}/${maxAttempts}`);
    
    if (!imageRef.current) {
      console.warn('Image ref not available');
      return null;
    }

    // Wait for DOM readiness
    const rect = imageRef.current.getBoundingClientRect();
    
    // Check if element is properly rendered
    if (rect.width === 0 || rect.height === 0) {
      console.warn('Image dimensions are zero, element not ready');
      if (attempt < maxAttempts) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(getPreciseImageCoordinates(maxAttempts, attempt + 1));
          }, 100);
        }) as any;
      }
      return null;
    }

    // Calculate precise center with additional logging
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Validate coordinates
    if (centerX < 0 || centerY < 0 || centerX > window.innerWidth || centerY > window.innerHeight) {
      console.warn('Calculated coordinates seem invalid:', { centerX, centerY, windowSize: { width: window.innerWidth, height: window.innerHeight } });
    }

    console.log('Precise image coordinates calculated:', {
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      center: { x: centerX, y: centerY },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollPosition: { x: window.scrollX, y: window.scrollY }
    });

    return { x: centerX, y: centerY };
  }, []);

  // Stabilization mechanism using requestAnimationFrame
  const waitForStabilization = useCallback(() => {
    console.log('Starting image stabilization process');
    setImageStabilized(false);
    
    if (stabilizationTimeoutRef.current) {
      clearTimeout(stabilizationTimeoutRef.current);
    }

    let frameCount = 0;
    const maxFrames = 10; // Wait for 10 animation frames (~166ms at 60fps)
    
    const checkStability = () => {
      frameCount++;
      console.log(`Stabilization frame ${frameCount}/${maxFrames}`);
      
      if (frameCount >= maxFrames) {
        console.log('Image stabilized after frames');
        setImageStabilized(true);
        
        // Additional timeout for extra safety
        stabilizationTimeoutRef.current = setTimeout(() => {
          console.log('Final stabilization timeout reached');
          if (onPanelReady) {
            onPanelReady();
          }
        }, 50);
      } else {
        requestAnimationFrame(checkStability);
      }
    };
    
    requestAnimationFrame(checkStability);
  }, [onPanelReady]);

  // ResizeObserver setup
  useEffect(() => {
    if (!imageRef.current) return;

    console.log('Setting up ResizeObserver for image');
    
    resizeObserverRef.current = new ResizeObserver((entries) => {
      console.log('ResizeObserver triggered, image dimensions changed');
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('New image dimensions:', { width, height });
        
        // Trigger stabilization when size changes
        if (width > 0 && height > 0) {
          waitForStabilization();
        }
      }
    });

    resizeObserverRef.current.observe(imageRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
        stabilizationTimeoutRef.current = null;
      }
    };
  }, [waitForStabilization]);

  // Handle panel animation completion
  const handleAnimationEnd = () => {
    console.log('Panel animation completed, triggering stabilization');
    waitForStabilization();
  };

  useImperativeHandle(ref, () => ({
    getImagePosition: () => {
      console.log('getImagePosition called, stabilized:', imageStabilized);
      return getPreciseImageCoordinates();
    },
    getImageSize: () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        console.log('Getting precise image size:', { width: rect.width, height: rect.height });
        return {
          width: rect.width,
          height: rect.height
        };
      }
      // Fallback размеры с учетом устройства
      const fallbackSize = isMobile 
        ? { width: 240, height: 320 }
        : { width: 300, height: 400 };
      console.log('Using fallback image size:', fallbackSize);
      return fallbackSize;
    }
  }));

  if (!album) return null;

  // Mock participants data
  const participants = [{
    name: "Анна Петрова",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c369?w=150&h=150&fit=crop&crop=face"
  }, {
    name: "Михаил Соколов",
    role: "Art Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }, {
    name: "Елена Краснова",
    role: "Design Researcher",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }];

  const content = <div className="space-y-6 font-ys">
      <div className="flex justify-center">
        <img 
          ref={imageRef}
          src={album.imageUrl} 
          alt={`${album.title} cover`} 
          className="w-[240px] h-[320px] sm:w-[300px] sm:h-[400px] rounded-[12px] shadow-lg object-cover transition-all duration-300"
          style={{
            opacity: showStaticImage ? 1 : 0,
            transition: 'opacity 200ms ease-out'
          }}
          onLoad={() => {
            console.log('Image loaded, starting stabilization process');
            waitForStabilization();
          }}
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-ys font-medium">О проекте</h3>
          <p className="text-sm text-muted-foreground font-ys leading-relaxed">
            Этот дизайн-проект представляет собой исследование современных подходов к визуальной коммуникации. 
            В процессе работы команда использовала методы пользовательского тестирования, прототипирования и итеративного дизайна.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-ys text-base font-medium">Участники</h3>
          <div className="space-y-3">
            {participants.map((participant, index) => <div key={index} className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback className="text-xs font-ys">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium font-ys">{participant.name}</p>
                  <p className="text-xs text-muted-foreground font-ys">{participant.role}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;

  if (isMobile) {
    return <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent 
          className="px-4 pb-8 font-ys max-h-[90vh]" 
          {...swipeHandlers}
          onAnimationEnd={handleAnimationEnd}
        >
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold transition-all duration-300 font-ys">
              {album.title}
            </DrawerTitle>
            <DrawerDescription className="text-lg text-muted-foreground transition-all duration-300 font-ys">
              {album.artist}
            </DrawerDescription>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 mt-6">
            <div className="pb-4">
              {content}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>;
  }

  return <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-[560px] sm:w-[600px] min-w-[560px] max-w-none h-auto my-[24px] mx-[24px] rounded-3xl font-ys"
        onAnimationEnd={handleAnimationEnd}
      >
        <SheetHeader>
          <SheetTitle className="font-ys font-extrabold text-3xl">{album.title}</SheetTitle>
          <SheetDescription className="text-muted-foreground font-ys text-xs">
            {album.artist}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>;
});

AlbumDetailPanel.displayName = 'AlbumDetailPanel';

export default AlbumDetailPanel;
