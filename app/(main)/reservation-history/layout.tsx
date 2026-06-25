"use client"
import Footer from '@/components/footer/Footer';
import React from 'react';


const Layout = ({ children }: { children: React.ReactNode }) => {
    return <>
        {children}
        <Footer />
    </>;
};

export default Layout;
