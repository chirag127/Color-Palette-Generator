import { create } from 'zustand';
import { generateRandomPalette, generateHarmonyPalette, HarmonyType } from '../lib/colors';
import { SavedPalette, savePalette, getSavedPalettes, deletePalette, isPaletteSaved } from '../lib/storage';

export interface PaletteState {
  // Current palette state
  currentPalette: string[];
  seedColor: string;
  harmonyType: HarmonyType;
  isGenerating: boolean;
  
  // Saved palettes state
  savedPalettes: SavedPalette[];
  
  // Copy feedback state
  copiedColor: string | null;
  
  // Actions
  generateRandom: () => void;
  generateFromSeed: (seedColor?: string, harmony?: HarmonyType) => void;
  setSeedColor: (color: string) => void;
  setHarmonyType: (harmony: HarmonyType) => void;
  loadPalette: (colors: string[]) => void;
  
  // Saved palettes actions
  savePalette: () => SavedPalette | null;
  deletePalette: (paletteId: number) => void;
  loadSavedPalettes: () => void;
  isPaletteSaved: () => boolean;
  
  // Copy actions
  copyColor: (color: string) => void;
  clearCopiedColor: () => void;
}

export const usePaletteStore = create<PaletteState>((set, get) => ({
  // Initial state
  currentPalette: [],
  seedColor: '#3B82F6',
  harmonyType: 'analogous',
  isGenerating: false,
  savedPalettes: [],
  copiedColor: null,

  // Actions
  generateRandom: () => {
    set({ isGenerating: true });
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const newPalette = generateRandomPalette();
      set({ 
        currentPalette: newPalette,
        isGenerating: false 
      });
    }, 100);
  },

  generateFromSeed: (seedColor?: string, harmony?: HarmonyType) => {
    const state = get();
    const colorToUse = seedColor || state.seedColor;
    const harmonyToUse = harmony || state.harmonyType;
    
    set({ isGenerating: true });
    
    try {
      // Simulate a small delay for better UX
      setTimeout(() => {
        const newPalette = generateHarmonyPalette(colorToUse, harmonyToUse);
        set({ 
          currentPalette: newPalette,
          seedColor: colorToUse,
          harmonyType: harmonyToUse,
          isGenerating: false 
        });
      }, 100);
    } catch (error) {
      console.error('Error generating palette from seed:', error);
      set({ isGenerating: false });
    }
  },

  setSeedColor: (color: string) => {
    set({ seedColor: color });
  },

  setHarmonyType: (harmony: HarmonyType) => {
    set({ harmonyType: harmony });
  },

  loadPalette: (colors: string[]) => {
    set({ currentPalette: colors });
  },

  // Saved palettes actions
  savePalette: () => {
    const state = get();
    if (state.currentPalette.length === 0) {
      return null;
    }

    try {
      const savedPalette = savePalette(state.currentPalette);
      const updatedSavedPalettes = getSavedPalettes();
      set({ savedPalettes: updatedSavedPalettes });
      return savedPalette;
    } catch (error) {
      console.error('Error saving palette:', error);
      return null;
    }
  },

  deletePalette: (paletteId: number) => {
    try {
      deletePalette(paletteId);
      const updatedSavedPalettes = getSavedPalettes();
      set({ savedPalettes: updatedSavedPalettes });
    } catch (error) {
      console.error('Error deleting palette:', error);
    }
  },

  loadSavedPalettes: () => {
    try {
      const savedPalettes = getSavedPalettes();
      set({ savedPalettes });
    } catch (error) {
      console.error('Error loading saved palettes:', error);
      set({ savedPalettes: [] });
    }
  },

  isPaletteSaved: () => {
    const state = get();
    if (state.currentPalette.length === 0) {
      return false;
    }
    return isPaletteSaved(state.currentPalette);
  },

  // Copy actions
  copyColor: (color: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(color).then(() => {
        set({ copiedColor: color });
        
        // Clear the copied state after 2 seconds
        setTimeout(() => {
          set({ copiedColor: null });
        }, 2000);
      }).catch((error) => {
        console.error('Failed to copy color:', error);
      });
    } else {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = color;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        set({ copiedColor: color });
        setTimeout(() => {
          set({ copiedColor: null });
        }, 2000);
      } catch (error) {
        console.error('Failed to copy color:', error);
      }
    }
  },

  clearCopiedColor: () => {
    set({ copiedColor: null });
  }
}));
