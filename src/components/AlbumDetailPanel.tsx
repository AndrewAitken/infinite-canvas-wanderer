
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
          
          <div className="mt-6">
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
