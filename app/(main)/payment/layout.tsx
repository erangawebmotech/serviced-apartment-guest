import { Metadata } from 'next';
import React from 'react';

export const metadata:Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: "Payment Success",
  description: "Payment success Page",
  openGraph:{
    images: "/icon.png"
}
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <section className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full">
        <div className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
          {children}
        </div>
      </section>
    </>
  );
};

export default Layout;
