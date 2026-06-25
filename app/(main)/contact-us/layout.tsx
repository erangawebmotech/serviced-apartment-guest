'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navigation/Navbar';
import Script from 'next/script';

const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <Script strategy="beforeInteractive" src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`} />
            <section className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full font-poppins">
                <div className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
                    <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />
                    {children}

                </div>

            </section>
            <Footer />
        </>

    );
};

export default Layout;
