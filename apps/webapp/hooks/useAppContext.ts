import { useContext } from 'react';
import { CustomAppContext } from '@/components/app-context';

export const useAppContext = () => useContext(CustomAppContext);
