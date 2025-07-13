'use client';

import { Copy, Check } from 'lucide-react';
import { usePaletteStore } from '../store/paletteStore';
import tinycolor from 'tinycolor2';

interface ColorCardProps {
  color: string;
  index: number;
}

export default function ColorCard({ color, index }: ColorCardProps) {
  const { copyColor, copiedColor } = usePaletteStore();
  
  const isCopied = copiedColor === color;
  const textColor = tinycolor(color).isLight() ? '#000000' : '#ffffff';
  
  const handleCopyClick = () => {
    copyColor(color);
  };

  return (
    <div 
      className="relative flex-1 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] group cursor-pointer transition-all duration-200 hover:scale-105"
      style={{ backgroundColor: color }}
      onClick={handleCopyClick}
    >
      {/* Color info overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div 
          className="flex items-center justify-between"
          style={{ color: textColor }}
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase tracking-wider">
              {color}
            </span>
            <span className="text-xs opacity-75">
              Color {index + 1}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyClick();
            }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
            aria-label={`Copy ${color} to clipboard`}
          >
            {isCopied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Always visible color code for mobile */}
      <div className="absolute bottom-4 left-4 md:hidden">
        <div 
          className="px-2 py-1 rounded text-xs font-medium bg-black/20 backdrop-blur-sm"
          style={{ color: textColor }}
        >
          {color}
        </div>
      </div>

      {/* Copy feedback */}
      {isCopied && (
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-green-500 text-white text-sm rounded-full shadow-lg animate-pulse">
            Copied!
          </div>
        </div>
      )}
    </div>
  );
}
