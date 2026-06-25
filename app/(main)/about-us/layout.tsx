'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navigation/Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {


    return (
        <>
            <section >
                <div >
                    <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />
                    {children}

                </div>

            </section>
            <Footer />
        </>

    );
};

export default Layout;
