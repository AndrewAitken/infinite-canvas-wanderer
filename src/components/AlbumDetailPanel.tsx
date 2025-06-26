import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
  const {
    swipeHandlers
  } = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious
  });

  if (!album) return null;

  // Mock participants data
  const participants = [
    {
      name: "Анна Петрова",
      role: "UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c369?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Михаил Соколов",
      role: "Art Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Елена Краснова",
      role: "Design Researcher",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const content = <div className="space-y-6 font-ys">
      <div className="flex justify-center">
        <img src={album.imageUrl} alt={`${album.title} cover`} className="w-[240px] h-[320px] sm:w-[300px] sm:h-[400px] rounded-[12px] shadow-lg object-cover transition-all duration-300" />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-ys">О проекте</h3>
          <p className="text-sm text-muted-foreground font-ys leading-relaxed">
            Этот дизайн-проект представляет собой исследование современных подходов к визуальной коммуникации. 
            В процессе работы команда использовала методы пользовательского тестирования, прототипирования и итеративного дизайна.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-ys">Участники</h3>
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center space-x-3">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;

  if (isMobile) {
    return <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="px-4 pb-8 font-ys" {...swipeHandlers}>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold transition-all duration-300 font-ys">
              {album.title}
            </DrawerTitle>
            <DrawerDescription className="text-lg text-muted-foreground transition-all duration-300 font-ys">
              {album.artist}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="mt-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>;
  }
  return <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[560px] sm:w-[600px] min-w-[560px] max-w-none h-auto my-[24px] mx-[24px] rounded-3xl font-ys">
        <SheetHeader>
          <SheetTitle className="text-2xl font-ys font-extrabold">{album.title}</SheetTitle>
          <SheetDescription className="text-lg text-muted-foreground font-ys">
            {album.artist}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>;
};

export default AlbumDetailPanel;
