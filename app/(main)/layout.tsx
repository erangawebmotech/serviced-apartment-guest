import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: "Book Serviced Apartments & Hotels | Serviced Apartments Sri Lanka",
    template: "%s | Serviced Apartments Sri Lanka",
  },
  description:
    "Book luxury serviced apartments, boutique hotels, and vacation rentals across Sri Lanka. Best rates guaranteed. Explore, stay, and enjoy comfort with Serviced Apartments LK.",
  keywords:
    "Sri Lanka Hotel Booking, Serviced Apartments, Vacation Rentals, Short-Term Stay, Luxury Hotels, Boutique Apartments, Rent in Sri Lanka, Travel Sri Lanka",
  authors: {
    name: "Serviced Apartments Sri Lanka",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Serviced Apartments Sri Lanka",
    title: "Book Serviced Apartments & Hotels | Serviced Apartments Sri Lanka",
    description:
      "Discover top-rated serviced apartments and hotels in Sri Lanka for your next vacation or business stay. Seamless booking, trusted service.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Serviced Apartments Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Serviced Apartments & Hotels | Serviced Apartments Sri Lanka",
    description:
      "Stay in comfort and style. Book top-rated serviced apartments and hotels in Sri Lanka. Trusted local platform for your travel needs.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || ""}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};


const Layout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default Layout;
