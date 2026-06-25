'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Logo from "@/public/Logo.png";
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/navigation/UserAvatar';
import { useLoginModal } from '@/common/auth/handleLoginModal';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [hasSession, setHasSession] = useState<boolean>(false);
    const { handleLoginModal } = useLoginModal();

    const checkSessionStatus = async () => {

        try {
            const response = await fetch("/api/session/check", { method: "POST" });
            const result = await response.json();

            if (result.success) {
                setHasSession(result.success);

            }
        } catch (error) {
            console.error("Error checking session:", error);
        }
    };
    useEffect(() => {
        checkSessionStatus();
    }, [])

    return (
        <section className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full font-poppins">
            <div className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
                <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />
                {children}
            </div>
        </section>

    );
};

export default Layout;
