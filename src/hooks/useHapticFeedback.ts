import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'error' | 'light' | 'heavy') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      switch (type) {
        case 'success':
          navigator.vibrate([20, 30, 20]);
          break;
        case 'warning':
          navigator.vibrate([30, 50, 30]);
          break;
        case 'error':
          navigator.vibrate([50, 100, 50, 100, 50]);
          break;
        case 'light':
          navigator.vibrate(10);
          break;
        case 'heavy':
          navigator.vibrate([40, 20, 40]);
          break;
        default:
          navigator.vibrate(20);
      }
    }
  }, []);

  return triggerHaptic;
};
