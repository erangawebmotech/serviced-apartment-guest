'use client';
import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkCookieConsent = () => {
        const cookies = document.cookie.split(';');
        const consentCookie = cookies.find(cookie =>
          cookie.trim().startsWith('cookie-consent=')
        );

        if (!consentCookie) {
          setShowDrawer(true);
        }

        setIsLoading(false);
      };

      setTimeout(checkCookieConsent, 300); 
    }
  }, []);

  const acceptCookies = () => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    document.cookie = `cookie-consent=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    setShowDrawer(false);
  };

  const rejectCookies = () => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    document.cookie = `cookie-consent=rejected; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    setShowDrawer(false);
  };

  const closeDrawerTemporarily = () => {
    setShowDrawer(false);
  };

  return {
    showDrawer,
    isLoading,
    acceptCookies,
    rejectCookies,
    closeDrawerTemporarily,
  };
};
