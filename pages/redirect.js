import { useEffect } from 'react';

const RedirectPage = () => {
  useEffect(() => {
    // Replace "my-expo-app://" with your custom Expo app scheme
    window.location.href = "nucliqv1://";
  }, []);

  return null;
};

export default RedirectPage;
