import { useContext } from 'react';
import { CustomAppContext } from '@/components/context/AppContext';

export const useAppContext = () => useContext(CustomAppContext);
