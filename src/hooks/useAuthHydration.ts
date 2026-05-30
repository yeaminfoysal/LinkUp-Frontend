import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

export const useAuthHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if store has already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    // Otherwise, listen to the hydration completion
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return () => {
      unsubFinish();
    };
  }, []);

  return hydrated;
};

export default useAuthHydration;
