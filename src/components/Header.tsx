
import React from 'react';

interface HeaderProps {
  isLogoInCenter: boolean;
  isLogoMoving: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogoInCenter, isLogoMoving }) => {
  return (
    <header 
      className={`fixed z-50 transition-all duration-300 ${
        isLogoInCenter 
          ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
          : 'top-0 left-0 p-4'
      }`}
      style={{
        animation: isLogoInCenter 
          ? 'logo-fade-in 0.5s ease-out' 
          : isLogoMoving 
            ? 'logo-center-to-corner 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
            : 'none'
      }}
    >
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/1d1a0ade-b001-4b1f-951d-7f872bd0d945.png" 
          alt="RFD MUSEUM" 
          className={`w-auto transition-all duration-300 ${
            isLogoInCenter ? 'h-12' : 'h-8'
          }`}
          draggable={false}
        />
      </div>
    </header>
  );
};

export default Header;
