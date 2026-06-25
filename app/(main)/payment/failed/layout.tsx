import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    title: "Payment Failed",
    description: "Payment Failed Page",
    openGraph: {
        images: "/icon.png"
    }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
