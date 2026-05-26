'use client';
import { useReducer, useEffect, type Reducer, type Dispatch, useState } from 'react';

function usePersistedReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  localStorageKey: string
): [S, Dispatch<A>, boolean] {
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize with initialState on the server and for the initial client render.
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Hydrate state from localStorage on client-side mount.
    try {
      const stored = window.localStorage.getItem(localStorageKey);
      if (stored) {
        dispatch({ type: 'HYDRATE_STATE', state: JSON.parse(stored) } as any);
      }
    } catch (error) {
       console.error('Error hydrating from localStorage', error);
    }
    setIsHydrated(true);
  }, [localStorageKey]);


  useEffect(() => {
    // Persist state to localStorage on changes, but only after hydration is complete.
    if (isHydrated) {
      try {
        window.localStorage.setItem(localStorageKey, JSON.stringify(state));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    }
  }, [state, localStorageKey, isHydrated]);

  return [state, dispatch, isHydrated];
}

export default usePersistedReducer;
