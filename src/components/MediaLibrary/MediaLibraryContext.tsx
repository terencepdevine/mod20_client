import { createContext, useContext } from 'react';
import { MediaLibraryContextType } from './types';

export const MediaLibraryContext = createContext<MediaLibraryContextType | null>(null);

export const useMediaLibraryContext = () => {
  const context = useContext(MediaLibraryContext);
  if (!context) {
    throw new Error('useMediaLibraryContext must be used within a MediaLibraryProvider');
  }
  return context;
};