'use client';

import { forwardRef } from 'react';
import ColorCard from './ColorCard';

interface PaletteDisplayProps {
  colors: string[];
  className?: string;
}

const PaletteDisplay = forwardRef<HTMLDivElement, PaletteDisplayProps>(
  ({ colors, className = '' }, ref) => {
    if (colors.length === 0) {
      return (
        <div className={`flex items-center justify-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No palette generated yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Click &quot;Generate Random&quot; or enter a seed color to get started
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`flex flex-col md:flex-row gap-0 rounded-lg overflow-hidden shadow-lg ${className}`}
      >
        {colors.map((color, index) => (
          <ColorCard
            key={`${color}-${index}`}
            color={color}
            index={index}
          />
        ))}
      </div>
    );
  }
);

PaletteDisplay.displayName = 'PaletteDisplay';

export default PaletteDisplay;
