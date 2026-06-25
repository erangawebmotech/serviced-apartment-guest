import ContactUsPage from '@/components/contactUs/ContactUsPage'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: 'Contact Us | Serviced Apartments Sri Lanka',
  description:
    'Get in touch with Serviced Apartments LK for inquiries, partnerships, or support. We’re here to help you find the perfect short-term rental solution in Sri Lanka.',
  keywords:
    'Contact Serviced Apartments Sri Lanka, Property Management Support, Short-Term Rentals Help, Hotel Booking Inquiries, Sri Lanka Travel Support',
  authors: {
    name: 'Serviced Apartments Sri Lanka',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}`,
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL || ''}`),
  openGraph: {
    title: 'Contact Us | Serviced Apartments Sri Lanka',
    description:
      'Need help or have questions? Reach out to Serviced Apartments LK for quick assistance and expert guidance.',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/contact-us`,
    siteName: 'Serviced Apartments Sri Lanka',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Serviced Apartments Sri Lanka',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Serviced Apartments Sri Lanka',
    description:
      'Get in touch with Serviced Apartments LK for inquiries, bookings, or assistance with your stay in Sri Lanka.',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || ''}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <ContactUsPage />
  )
}

export default page