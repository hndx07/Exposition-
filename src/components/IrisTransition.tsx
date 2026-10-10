import React from 'react';

interface IrisTransitionProps {
  isActive: boolean;
  onTransitionEnd?: () => void;
}

export const IrisTransition: React.FC<IrisTransitionProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-[#3B3355] animate-pulse opacity-90 transition-all duration-500 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-full border-4 border-[#FFF1B8] border-t-transparent animate-spin mb-3" />
        <span className="font-heading font-extrabold text-sm tracking-widest text-[#FFF1B8]">
          MOVING TO LOCATION...
        </span>
      </div>
    </div>
  );
};
