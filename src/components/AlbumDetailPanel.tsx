import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
}
const AlbumDetailPanel: React.FC<AlbumDetailPanelProps> = ({
  album,
  isOpen,
  onClose
}) => {
  if (!album) return null;
  return <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[560px] sm:w-[600px] min-w-[560px] max-w-none">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{album.title}</SheetTitle>
          <SheetDescription className="text-lg text-muted-foreground">
            {album.artist}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex justify-center">
            <img src={album.imageUrl} alt={`${album.title} cover`} className="w-[320px] h-[320px] rounded-[26px] shadow-lg object-cover" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Описание</h3>
            <p className="text-muted-foreground leading-relaxed">
              {album.description}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};
export default AlbumDetailPanel;