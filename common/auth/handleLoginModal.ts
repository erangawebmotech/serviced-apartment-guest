"use client";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginModal, openLoginModal } from "@/store/reducers/loginModal";
import { useLenis } from "lenis/react";
export const useLoginModal = () => {
    const dispatch = useDispatch();
    const loginModal = useSelector((state: { loginModal: boolean }) => state.loginModal);
    const lenis = useLenis();

    const handleLoginModal = ({ open = false, type = 'login' }: { open?: boolean, type?: 'login' | 'register' }) => {
        if (open) {
            lenis?.stop();
            dispatch(openLoginModal(type));
        } 
        else {
            dispatch(closeLoginModal());
        }
    };
    return { loginModal, handleLoginModal };
}; 