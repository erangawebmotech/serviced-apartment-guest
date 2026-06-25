import { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const timeout = setTimeout(() => {
                navigator.serviceWorker
                    .register('/service-worker.js', { scope: '/' })
                    .then(() => console.log('Service worker registered!'))
                    .catch((error) => console.error('Service worker registration failed:', error));
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, []);

    return <Component {...pageProps} />;
}