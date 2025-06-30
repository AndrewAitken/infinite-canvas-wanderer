
import React, { useEffect } from 'react';

interface ImageZoomProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ isOpen, imageUrl, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] max-w-[90vw] transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Album cover"
          className="h-auto max-h-[80vh] w-auto object-contain shadow-2xl"
          draggable={false}
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageZoom;
