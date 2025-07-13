'use client';

import { useEffect, useState } from 'react';
import { Trash2, Eye, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePaletteStore } from '../store/paletteStore';
import { SavedPalette, exportPaletteAsJSON } from '../lib/storage';

export default function SavedPalettesPage() {
  const {
    savedPalettes,
    loadSavedPalettes,
    deletePalette,
    loadPalette,
  } = usePaletteStore();

  const [selectedPalette, setSelectedPalette] = useState<SavedPalette | null>(null);

  useEffect(() => {
    loadSavedPalettes();
  }, [loadSavedPalettes]);

  const handleDeletePalette = (paletteId: number) => {
    if (confirm('Are you sure you want to delete this palette?')) {
      deletePalette(paletteId);
      if (selectedPalette?.id === paletteId) {
        setSelectedPalette(null);
      }
    }
  };

  const handleLoadPalette = (palette: SavedPalette) => {
    loadPalette(palette.colors);
    // Navigate back to main page
    window.location.href = '/';
  };

  const handleExportPalette = (palette: SavedPalette) => {
    exportPaletteAsJSON(palette.colors, `palette-${palette.id}.json`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Generator
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Saved Palettes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {savedPalettes.length} saved palette{savedPalettes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {savedPalettes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No saved palettes yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start creating and saving palettes to see them here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your First Palette
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Palette Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPalette?.id === palette.id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedPalette(palette)}
                >
                  {/* Color Preview */}
                  <div className="flex h-24">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Palette Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(palette.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadPalette(palette);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Load palette"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportPalette(palette);
                          }}
                          className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          title="Export as JSON"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePalette(palette.id);
                          }}
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete palette"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Color Codes */}
                    <div className="flex flex-wrap gap-1">
                      {palette.colors.map((color, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Palette Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedPalette ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Palette Details
                </h3>

                {/* Large Color Preview */}
                <div className="flex rounded-lg overflow-hidden mb-4 h-32">
                  {selectedPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Palette Info */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Created
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedPalette.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Colors
                    </label>
                    <div className="space-y-2 mt-1">
                      {selectedPalette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <div
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => handleLoadPalette(selectedPalette)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Eye size={16} />
                    Load in Generator
                  </button>
                  <button
                    onClick={() => handleExportPalette(selectedPalette)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Download size={16} />
                    Export JSON
                  </button>
                  <button
                    onClick={() => handleDeletePalette(selectedPalette.id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Palette
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a palette to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
