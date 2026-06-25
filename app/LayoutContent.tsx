import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { closeLoginModal } from '@/store/reducers/loginModal';
import { useLenis } from "lenis/react";
import CookieConsentDrawer from '@/components/ui/CookieConsentDrawer';
import Script from 'next/script';

interface FilterDetails {
  propertyTypes?: Set<string>;
  highlights?: Set<string>;
  amenities?: Set<string>;
  bedTypes?: Set<string>;
}

interface RootState {
  loginModal: {
    loginModal: boolean
    modalType: 'login' | 'register'
  }
  filters: FilterDetails;
}

export default function LayoutContent({ children, isMobile }: { children: React.ReactNode, isMobile: boolean }) {
  const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });
  const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), { ssr: false });
  const dispatch = useDispatch();
  const lenis = useLenis();
  const isLoginModalOpen = useSelector((state: RootState) => state?.loginModal?.loginModal);
  const authModalType = useSelector((state: RootState) => state.loginModal?.modalType);

  const closeModal = useCallback((open: boolean) => {
    if(open) return;
    if (!open && !isMobile) {
      lenis?.start();
    }

    if (!isLoginModalOpen) return;
    dispatch(closeLoginModal());
  }, [dispatch, isLoginModalOpen, lenis, isMobile]);


  return (
    <>
      {children}
      <Toaster />
      <AuthModal isOpen={isLoginModalOpen} onOpenChange={closeModal} activeTab={authModalType || 'login'} />
      <CookieConsentDrawer />
    </>
  );
}
