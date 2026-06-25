import { COOKIES_POLICY } from '@/common/data';
import { Card } from '@/components/ui/card';
import { Metadata } from 'next';
import React from 'react'
import { Mail, Phone, MapPin } from "lucide-react"
export const metadata: Metadata = {
    title: "Cookies Policy",
    description:
        "Understand how Serviced Apartments LK uses cookies to improve your browsing experience and personalize content.",
    keywords:
        "Cookies Policy, Cookie Usage, Website Cookies, User Tracking, Data Collection, Serviced Apartments Sri Lanka, Online Privacy",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
    openGraph: {
        title: "Cookies Policy | Serviced Apartments Sri Lanka",
        description:
            "Learn how Serviced Apartments LK uses cookies to enhance your experience and ensure smooth website functionality.",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/cookies-policy`,
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
        title: "Cookies Policy | Serviced Apartments Sri Lanka",
        description:
            "See how cookies are used by Serviced Apartments LK to deliver a personalized and optimized browsing experience.",
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}/Logo_White.png`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const CONTACT_ICONS = [Mail, Phone, MapPin]
const page = () => {
    return (
         <div>
            <Card className="flex flex-col gap-10 bg-transparent shadow-none mt-10 p-10 rounded-lg">
                <div>
                    <h1 className="mb-1 font-bold text-2xl">{COOKIES_POLICY.title}</h1>
                    <p className="mb-6 text-gray-500 text-sm">Effective Date : {COOKIES_POLICY.effectiveDate}</p>
                    <p className="mb-6 leading-relaxed">{COOKIES_POLICY.intro}</p>
                </div>

                {COOKIES_POLICY.sections.map((section, i) => (
                    <section key={i} className="mb-8">
                        <h2 className="mb-2 font-semibold text-lg">{section.heading}</h2>

                        {section.content && (
                            <p className="mb-2 leading-relaxed">{section.content}</p>
                        )}

                        {section.list && (
                            <ul className="space-y-1 pl-6 list-disc">
                                {section.heading === "Contact Us" ? (
                                    section.list.map((item, j) => {
                                        const Icon = CONTACT_ICONS[j] || null
                                        let href = "#"
                                        if (j === 0) href = `mailto:${item}`
                                        else if (j === 1) href = `tel:${item.replace(/\\s+/g, "")}`
                                        else if (j === 2) href = `https://www.google.com/maps/search/${encodeURIComponent(item)}`

                                        return (
                                            <li key={j} className="flex items-center gap-2 list-none">
                                                {Icon && <Icon className="w-4 h-4 text-gray-600" />}
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item}
                                                </a>
                                            </li>
                                        )
                                    })
                                ) : (
                                    section.list.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2">
                                            <span className="inline-block bg-gray-400 rounded-full w-2 h-2" />
                                            {item}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}

                        {section.subSections && (
                            <div className="space-y-4">
                                {section.subSections.map((sub, k) => (
                                    <div key={k}>
                                        <h3 className="mb-1 font-medium text-base">{sub.subHeading}</h3>
                                        <p className="text-sm leading-relaxed">{sub.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {section.footer && (
                            <p className="mt-2 text-sm italic">{section.footer}</p>
                        )}
                    </section>
                ))}
            </Card>
        </div>
    )
}

export default page