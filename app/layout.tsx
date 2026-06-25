'use client'

import "@/styles/globals.css";
import "@/styles/animations.css";
import localFont from "next/font/local";
import { Provider } from 'react-redux';
import store from '@/store/store';
import LayoutContent from "./LayoutContent";
import { useEffect } from "react";
import { printConsoleMessage } from "@/actions/utils/consoleMessage";
import Head from "next/head";
import Script from "next/script";

const iBrand = localFont({
  src: [
    {
      path: '../public/fonts/Ibrand.ttf',
      style: 'normal'
    }
  ],
  variable: '--font-ibrand'
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  useEffect(() => {
    printConsoleMessage();
  }, []);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;


  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            link.media = 'print';
            link.onload = () => { link.media = 'all'; };
            document.head.appendChild(link);
          `,
          }}
        />

        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <link
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet"
            />
          `,
          }}
        />

        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
      </Head>
      <body className={`${iBrand.className} bg-[#f7f7f7]`}>
        <Provider store={store}>
          <LayoutContent isMobile={isMobile}>
            {children}
          </LayoutContent>
        </Provider>
      </body>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GAID}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GAID}');
  `}
      </Script>

    </html>
  );
}
