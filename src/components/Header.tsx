
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/1d1a0ade-b001-4b1f-951d-7f872bd0d945.png" 
          alt="RFD MUSEUM" 
          className="h-8 w-auto"
          draggable={false}
        />
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
