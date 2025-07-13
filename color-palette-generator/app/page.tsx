'use client';

import { useEffect, useRef, useState } from 'react';
import { Shuffle, Download, Heart, HeartOff, Settings } from 'lucide-react';
import { toPng } from 'html-to-image';
import PaletteDisplay from './components/PaletteDisplay';
import { usePaletteStore } from './store/paletteStore';
import { HarmonyType, isValidHexColor } from './lib/colors';
import { exportPaletteAsJSON } from './lib/storage';

const harmonyOptions: { value: HarmonyType; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'splitComplement', label: 'Split Complement' },
];

export default function Home() {
  const {
    currentPalette,
    seedColor,
    harmonyType,
    isGenerating,
    generateRandom,
    generateFromSeed,
    setSeedColor,
    setHarmonyType,
    savePalette,
    isPaletteSaved,
    loadSavedPalettes,
  } = usePaletteStore();

  const [seedInput, setSeedInput] = useState(seedColor);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Load saved palettes on mount
  useEffect(() => {
    loadSavedPalettes();
    generateRandom(); // Generate initial palette
  }, [loadSavedPalettes, generateRandom]);

  const handleSeedInputChange = (value: string) => {
    setSeedInput(value);
    if (isValidHexColor(value)) {
      setSeedColor(value);
    }
  };

  const handleGenerateFromSeed = () => {
    if (isValidHexColor(seedInput)) {
      setSeedColor(seedInput);
      generateFromSeed(seedInput, harmonyType);
    }
  };

  const handleSavePalette = () => {
    const saved = savePalette();
    if (saved) {
      // Could show a toast notification here
      console.log('Palette saved successfully');
    }
  };

  const handleExportPNG = async () => {
    if (!paletteRef.current || currentPalette.length === 0) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(paletteRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `color-palette-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    if (currentPalette.length === 0) return;
    exportPaletteAsJSON(currentPalette);
  };

  const isValidSeed = isValidHexColor(seedInput);
  const paletteIsSaved = isPaletteSaved();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Color Palette Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Generate beautiful color palettes for your design projects. Create random palettes or use color harmony rules with a seed color.
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Random Generation */}
          <div className="flex-1">
            <button
              onClick={generateRandom}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Shuffle size={20} />
              {isGenerating ? 'Generating...' : 'Generate Random'}
            </button>
          </div>

          {/* Advanced Controls Toggle */}
          <div className="flex-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Settings size={20} />
              Advanced Options
            </button>
          </div>
        </div>

        {/* Advanced Controls */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Seed Color Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seed Color
                </label>
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => handleSeedInputChange(e.target.value)}
                  placeholder="#3B82F6"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isValidSeed
                      ? 'border-gray-300 dark:border-gray-600'
                      : 'border-red-300 dark:border-red-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
              </div>

              {/* Harmony Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harmony Type
                </label>
                <select
                  value={harmonyType}
                  onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {harmonyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate from Seed */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerateFromSeed}
                  disabled={!isValidSeed || isGenerating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Generate from Seed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Palette Display */}
      <div className="space-y-4">
        <PaletteDisplay ref={paletteRef} colors={currentPalette} />

        {/* Action Buttons */}
        {currentPalette.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleSavePalette}
              disabled={paletteIsSaved}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                paletteIsSaved
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {paletteIsSaved ? <HeartOff size={20} /> : <Heart size={20} />}
              {paletteIsSaved ? 'Already Saved' : 'Save Palette'}
            </button>

            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to Use
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>• Click &quot;Generate Random&quot; to create a new random palette</li>
          <li>• Use &quot;Advanced Options&quot; to generate palettes from a seed color</li>
          <li>• Click on any color to copy its hex code to your clipboard</li>
          <li>• Save your favorite palettes and view them in the &quot;Saved Palettes&quot; section</li>
          <li>• Export palettes as PNG images or JSON files for use in your projects</li>
        </ul>
      </div>
    </div>
  );
}
