export interface SavedPalette {
  id: number;
  colors: string[];
  createdAt: string;
}

export interface AppData {
  theme: 'light' | 'dark';
  palettes: SavedPalette[];
}

const STORAGE_KEY = 'color_palette_app_data';

/**
 * Gets the current app data from localStorage
 */
export function getAppData(): AppData {
  if (typeof window === 'undefined') {
    return { theme: 'light', palettes: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { theme: 'light', palettes: [] };
    }

    const parsed = JSON.parse(data) as AppData;
    return {
      theme: parsed.theme || 'light',
      palettes: parsed.palettes || []
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { theme: 'light', palettes: [] };
  }
}

/**
 * Saves app data to localStorage
 */
export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Saves a new palette to localStorage
 */
export function savePalette(colors: string[]): SavedPalette {
  const appData = getAppData();
  
  const newPalette: SavedPalette = {
    id: Date.now(),
    colors: [...colors],
    createdAt: new Date().toISOString()
  };

  appData.palettes.push(newPalette);
  saveAppData(appData);
  
  return newPalette;
}

/**
 * Gets all saved palettes from localStorage
 */
export function getSavedPalettes(): SavedPalette[] {
  const appData = getAppData();
  return appData.palettes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Deletes a palette from localStorage
 */
export function deletePalette(paletteId: number): void {
  const appData = getAppData();
  appData.palettes = appData.palettes.filter(palette => palette.id !== paletteId);
  saveAppData(appData);
}

/**
 * Checks if a palette is already saved
 */
export function isPaletteSaved(colors: string[]): boolean {
  const savedPalettes = getSavedPalettes();
  return savedPalettes.some(palette => 
    palette.colors.length === colors.length &&
    palette.colors.every((color, index) => color.toLowerCase() === colors[index].toLowerCase())
  );
}

/**
 * Gets the saved theme preference
 */
export function getSavedTheme(): 'light' | 'dark' {
  const appData = getAppData();
  return appData.theme;
}

/**
 * Saves the theme preference
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  const appData = getAppData();
  appData.theme = theme;
  saveAppData(appData);
}

/**
 * Exports a palette as JSON
 */
export function exportPaletteAsJSON(colors: string[], filename?: string): void {
  const data = {
    palette: colors,
    exportedAt: new Date().toISOString(),
    format: 'hex'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `color-palette-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Clears all saved data (for debugging/reset purposes)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
