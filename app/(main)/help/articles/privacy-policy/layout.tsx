import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Review our privacy policy to understand how Serviced Apartments LK collects, uses, discloses, and protects your personal data.",
    keywords:
        "Privacy Policy, Data Protection, Personal Information, Serviced Apartments Sri Lanka, Data Usage, User Privacy",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
    openGraph: {
        title: "Privacy Policy | Serviced Apartments Sri Lanka",
        description:
            "Review our privacy policy to understand how Serviced Apartments LK collects, uses, discloses, and protects your personal data.",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
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
        title: "Privacy Policy | Serviced Apartments Sri Lanka",
        description:
            "See how we collect, store, and use your data at Serviced Apartments LK in accordance with privacy standards.",
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
