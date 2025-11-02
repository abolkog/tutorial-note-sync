import { DataContext } from '@/context/DataContext';
import { useContext } from 'react';

export function useAppData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useAppData hook must be used in component');
  return context;
}
