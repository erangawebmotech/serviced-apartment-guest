import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read our Terms and Conditions to understand the rules, responsibilities, and limitations when using Serviced Apartments LK's services and website.",
  keywords:
    "Terms and Conditions, User Agreement, Serviced Apartments Sri Lanka, Booking Policy, Usage Policy, Legal Terms",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
  openGraph: {
    title: "Terms and Conditions | Serviced Apartments Sri Lanka",
    description:
      "Understand the legal agreement between you and Serviced Apartments LK, covering usage of our booking platform and property services.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-and-conditions`,
    siteName: "Serviced Apartments Sri Lanka",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/Logo_White.png`,
        width: 800,
        height: 600,
        alt: "Serviced Apartments Sri Lanka Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Serviced Apartments Sri Lanka",
    description:
      "Review the legal terms of using Serviced Apartments LK's website and services. Know your rights and responsibilities.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/Logo_White.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPolicyLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default PrivacyPolicyLayout;
