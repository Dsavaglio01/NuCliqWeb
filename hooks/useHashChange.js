// useHashChange.js
import { useEffect, useState } from 'react';

function useHashChange() {
  const [hash, setHash] = useState(''); // Start with empty hash

  useEffect(() => {
    // Check if window exists (browser environment)
    if (typeof window !== 'undefined') {
      setHash(window.location.hash); // Set initial hash if window is defined

      const handleHashChange = () => {
        setHash(window.location.hash);
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render (client-side)

  return hash;
}

export default useHashChange;
