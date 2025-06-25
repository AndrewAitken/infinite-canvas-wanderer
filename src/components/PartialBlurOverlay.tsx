
import React from 'react';
import { cn } from "@/lib/utils";

interface PartialBlurOverlayProps {
  className?: string;
  panelWidth?: number;
  onClick?: () => void;
}

const PartialBlurOverlay: React.FC<PartialBlurOverlayProps> = ({
  className,
  panelWidth = 560,
  onClick
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-lg transition-all duration-500 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      style={{
        right: `${panelWidth + 24}px`, // Panel width + margin
        left: 0,
        top: 0,
        bottom: 0,
      }}
      onClick={onClick}
    />
  );
};

export default PartialBlurOverlay;
