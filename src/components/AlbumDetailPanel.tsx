import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipe } from "@/hooks/useSwipe";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}

const AlbumDetailPanel: React.FC<AlbumDetailPanelProps> = ({
  album,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  currentIndex = 0,
  totalCount = 1
}) => {
  const isMobile = useIsMobile();
  
  const { swipeHandlers } = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });
  
  if (!album) return null;

  const content = (
    <div className="space-y-6">
      <div className="flex justify-center">
        <img 
          src={album.imageUrl} 
          alt={`${album.title} cover`} 
          className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[26px] shadow-lg object-cover transition-all duration-300" 
        />
      </div>
      
      {/* Position indicator for mobile */}
      {isMobile && totalCount > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: totalCount }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            {currentIndex + 1} из {totalCount}
          </span>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Описание</h3>
        <p className="text-muted-foreground leading-relaxed">
          {album.description}
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="px-4 pb-8" {...swipeHandlers}>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold transition-all duration-300">
              {album.title}
            </DrawerTitle>
            <DrawerDescription className="text-lg text-muted-foreground transition-all duration-300">
              {album.artist}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="mt-6 relative">
            {/* Navigation arrows for mobile */}
            {totalCount > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white/90"
                  aria-label="Предыдущий альбом"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white/90"
                  aria-label="Следующий альбом"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[560px] sm:w-[600px] min-w-[560px] max-w-none my-[12px] mx-[12px] h-auto rounded-2xl">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{album.title}</SheetTitle>
          <SheetDescription className="text-lg text-muted-foreground">
            {album.artist}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlbumDetailPanel;
