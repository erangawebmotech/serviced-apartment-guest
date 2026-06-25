import React from "react";
import {Metadata} from "next";
import localFont from "next/font/local";
import Image from "next/image";
import banner from '@/public/about/about-us-banner.png';
import banner2 from '@/public/about/about-us-banner-2.png';
import img1 from '@/public/about/about-us-image-1.png';
import img2 from '@/public/about/about-us-image-2.png';
import img3 from '@/public/about/about-us-image-3.png';
import img4 from '@/public/about/about-us-image-4.png';
import maskBanner from '@/public/about/mask-face.jpg';
import SpaceWrapper from "@/components/common/about/spaceWrapper";

export const metadata: Metadata = {
    title: "About Us | Serviced Apartments Sri Lanka",
    description:
        "Discover how Serviced Apartments LK supports property owners and boosts Sri Lanka’s tourism industry through premium short-term rental services.",
    keywords:
        "Serviced Apartments Sri Lanka, About Us, Property Management, Hotel Booking, Short-Term Rentals, Local Tourism, Real Estate Sri Lanka, OTA Sri Lanka, Apartment Hosting, Sri Lanka Travel Platform",
    authors: [
        {
            name: "Serviced Apartments Sri Lanka",
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}`,
        },
    ],
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL || ""}`),
    openGraph: {
        title: "About Us | Serviced Apartments Sri Lanka",
        description:
            "Learn about our mission to empower property owners and grow Sri Lanka’s tourism economy through short-term rental excellence.",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/about-us`,
        siteName: "Serviced Apartments Sri Lanka",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/opengraph-image.png`,
                width: 1200,
                height: 630,
                alt: "Serviced Apartments Sri Lanka",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Serviced Apartments Sri Lanka",
        description:
            "Learn about our mission to empower property owners and grow Sri Lanka’s tourism economy through short-term rental excellence.",
        images: [`${process.env.NEXT_PUBLIC_BASE_URL || ""}/opengraph-image.png`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const iBrand = localFont({
    src: [
        {
            path: '../../../public/fonts/Ibrand.ttf',
            style: 'normal'
        }
    ],
    variable: '--font-ibrand'
});

const features = [
    {
        title: "Better Returns & Unique Experiences",
        description:
            "Property owners enjoy higher earning potential through short-term rentals, while guests benefit from affordable, comfortable, and authentic stays unlike conventional hotels.",
    },
    {
        title: "Seamless Management & Guest Services",
        description:
            "We take care of everything, from guest inquiries and bookings to cleaning, maintenance, and beyond.",
    },
    {
        title: "Professional Marketing & Wide Exposure",
        description:
            "Our team promotes properties with high-quality photography, smart pricing, and listings across leading travel platforms.",
    },
    {
        title: "Social Impact",
        description:
            "Every property supports job creation, empowers local suppliers, and contributes to vibrant communities.",
    },
    {
        title: "Trusted Experience",
        description:
            "With expertise in real estate, tourism, and hospitality, we bring confidence to owners and peace of mind to guests.",
    },
    {
        title: "All-in-One Mobile App",
        description:
            "Hosts and guests can manage and enjoy their stay via our user-friendly, fully integrated mobile app.",
    },
];


const AboutUs = () => {
    return (
        <div
            className={`  mx-auto mt-8 px-4 md:px-6  flex flex-col items-center justify-between min-h-screen text-[#3C3C3C] ${iBrand.className}`}>
            <SpaceWrapper>
                <div className="flex flex-col items-center space-y-8 text-center">
                    <h1 className={`${iBrand.className}  max-w-4xl font-medium  text-3xl sm:text-4xl md:text-5xl !leading-tight`}>
                        The <span className="text-secondary">Pioneering</span> Sri Lankan Platform Turning
                        Apartments into <span className="text-secondary">High-Performance</span> Serviced Stays for
                        Locals and Global <span className="text-secondary">Travelers</span> Alike
                    </h1>
                    <Image
                        src={banner}
                        alt="Girl with a coconut"
                        loading="eager"
                        className="w-full h-auto"
                    />
                </div>
            </SpaceWrapper>

            <SpaceWrapper>
                <div className="flex flex-col gap-10 text-sm sm:text-base">
                    <p className="font-poppins">Serviced Apartments LK is Sri Lanka’s First dedicated website for
                        short-term
                        rental listing management, built to transform residential spaces into high-performing serviced
                        accommodation including Apartments, Villas, boutique hotels and Home Stays. Founded in 2017 by a
                        young entrepreneur, the establishment was born from a clear vision: to meet the future demand of
                        Sri
                        Lanka’s growing tourism sector and to harness the untapped potential of apartment living. Since
                        then, we offer full range of serviced accommodation management services to the property owners
                        to
                        host their properties to both local and international travellers.</p>
                    <p className="font-poppins">Recognizing early the surge in apartment developments across the country
                        and
                        the limited capacity in traditional hotel infrastructure, our founder saw a powerful
                        opportunity.
                        Since 2023, we registered the trading name Serviced Apartments LK and built the First Sri Lankan
                        short term accommodation listing platform. By converting modern apartments into serviced
                        accommodation, Serviced Apartments LK set out to offer a flexible, scalable solution that meets
                        the
                        evolving needs of both travelers and property owners.</p>
                    <p className="font-poppins">Today, we operate as a fully local Online Travel Agency (OTA),
                        empowering
                        property owners while helping bridge the accommodation gap in Sri Lanka’s hospitality industry,
                        while overcoming the practical issues faced when hosting with international OTAs — with added
                        features like a fully integrated mobile app, verified listings, secured payment gateway, and
                        ongoing
                        platform improvements that make serviced accommodation management easier than ever.</p>
                </div>
            </SpaceWrapper>

            <div className="relative w-[105%]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
                    {[img1, img2, img3].map((src, i) => (
                        <Image key={i} src={src} alt="gallery" loading="lazy" className="w-full h-auto"/>
                    ))}
                </div>
            </div>


            <SpaceWrapper>
                <div className="flex flex-col justify-start items-start gap-12 w-full">
                    <div>
                        <h2 className="mb-4 text-2xl">Why Choose Us?</h2>
                        <div
                            className="gap-10 grid grid-cols-1 md:grid-cols-2 w-full font-poppins text-sm md:text-base leading-relaxed">
                            <ul className="space-y-3 pl-5 list-disc">
                                <li>
                                    <strong>100% Sri Lankan</strong> - By partnering with us or choosing to stay at our
                                    properties,
                                    you directly support the local economy, create job opportunities, and ensure your
                                    investment and
                                    spending benefits Sri Lanka.
                                </li>
                                <li>
                                    <strong>Higher Returns</strong> - Earn more with short-term rentals compared to
                                    traditional
                                    long-term leases.
                                </li>
                                <li>
                                    <strong>Hassle-Free Management</strong> - We handle everything from guest inquiries
                                    and
                                    bookings
                                    to cleaning and maintenance.
                                </li>
                                <li>
                                    <strong>Professional Marketing</strong> - High-quality photography, strategic
                                    pricing,
                                    and exposure
                                    across top travel platforms.
                                </li>
                            </ul>

                            <ul className="space-y-3 pl-5 list-disc">
                                <li>
                                    <strong>Social Impact</strong> - Every property supports job creation, empowers
                                    local
                                    suppliers, and
                                    contributes to vibrant communities, making every stay meaningful for both hosts and
                                    guests.
                                </li>
                                <li>
                                    <strong>Trusted Experience</strong> - With deep expertise in real estate, tourism,
                                    and
                                    hospitality, we
                                    offer confidence to property owners and peace of mind to guests.
                                </li>
                                <li>
                                    <strong>All-in-One Mobile App</strong> - Our fully integrated mobile app makes
                                    managing
                                    properties and
                                    booking stays easier than ever. Hosts can monitor bookings, earnings, and property
                                    performance on the go.
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </SpaceWrapper>

            <div className="relative w-[105%]">
            <div className="relative bg-primary px-6 md:px-24 py-16 w-full text-white">

                <div className="z-0 absolute inset-0">
                    <Image
                        src={maskBanner}
                        alt="Mask face"
                        className="opacity-10 w-full h-full object-cover"
                        priority
                    />
                </div>

                <div className="z-10 relative gap-10 grid lg:grid-cols-2 mx-auto max-w-6xl">

                    <div>
                        <h2 className="mb-4 text-4xl">Our Vision</h2>
                        <p className="font-poppins">To be the driving force in reshaping Sri Lanka’s tourism
                            accommodation landscape by delivering smart, scalable, and locally powered alternatives to
                            traditional hotels—creating long-term value for both travelers and property investors.</p>
                    </div>

                    <div>
                        <h2 className="mb-4 text-4xl">Our Mission</h2>
                        <p className="font-poppins">To empower property owners and enrich traveler experiences by
                            providing innovative, seamless short-term rental solutions that unlock the true value of
                            residential spaces. As a fully local establishment, we are committed to ensuring that 100%
                            of our revenue remains in Sri Lanka, directly supporting the nation’s economy. We strive for
                            operational excellence, local expertise, and sustainable growth—delivering reliable service,
                            fostering community well-being, and setting new benchmarks for hospitality in Sri Lanka.</p>
                    </div>

                </div>
            </div>
            </div>


            <SpaceWrapper>
                <div className="z-10 relative mx-auto max-w-7xl text-center">
                    <h2 className="mb-12 text-[#002640] text-3xl md:text-4xl">
                        Why Choose Serviced Apartments LK?
                    </h2>

                    <div className="gap-x-12 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-gray-800">
                        {features.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <h4 className="mb-2 text-primary text-base md:text-lg">
                                    {item.title}
                                </h4>
                                <p className="max-w-[30ch] font-poppins text-gray-600 text-sm text-center leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SpaceWrapper>
            <Image
                src={banner2}
                alt="Girl with a coconut"
                loading="eager"
            />
          <SpaceWrapper>
            <div className="space-y-8 w-full">
                <h2 className="text-3xl">Benefits for Travelers</h2>
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 font-poppins">
                    <ul className="space-y-4 pl-6 marker:text-black list-disc">
                        <li>Reserve with Confidence – Choose and book from a wide range of verified listings, ensuring
                            quality and security for your stay.
                        </li>
                        <li>Unique, Comfortable Stays – Enjoy accommodations that reflect the local culture, offering
                            comfort and authenticity beyond the ordinary hotel experience.
                        </li>
                        <li>Seamless Booking Experience – Our integrated mobile app allows instant booking, easy
                            communication with hosts, and access to all reservation details.
                        </li>
                    </ul>
                    <ul className="space-y-4 pl-6 marker:text-black list-disc">
                        <li>Reliable Service – From smooth check-ins to professionally maintained spaces, expect the
                            highest standard of comfort and care throughout your stay.
                        </li>
                        <li>Diverse Choices – Choose from a wide range of apartments, villas, boutique hotels, and home
                            stays to fit your travel style and budget.
                        </li>
                        <li>Positive Social Impact – Each stay helps support local jobs, communities, and sustainable
                            development in Sri Lanka.
                        </li>
                    </ul>
                </div>

            </div>
        </SpaceWrapper> <SpaceWrapper>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div
                    className="flex flex-col justify-center items-start space-y-8 bg-primary p-6 md:p-12 rounded-3xl text-white">
                    <h3 className="text-4xl">Our Commitment</h3>
                    <div>
                        <p className="mb-3 font-poppins">At Serviced Apartments LK, we believe in growing together—with
                            our property partners, our communities, and Sri Lanka’s tourism industry. Our platform is
                            more than just a service; it’s a movement to optimize underutilized assets, generate
                            sustainable income for property owners, and provide travelers with unique, comfortable
                            stays.</p>
                        <p className="font-poppins">Whether you own a single apartment or manage a portfolio, we provide
                            a customized and caring approach that delivers results.</p>

                    </div>
                </div>

                <div>
                    <Image src={img4} alt="temple"/>
                </div>
            </div>
        </SpaceWrapper> <SpaceWrapper>

            <div className="space-y-8 text-center">
                <h3 className="text-3xl">Join Us!</h3>
                <p className=" font-poppins font-thin text-center">Be part of a future-forward solution that’s
                    redefining accommodation in Sri Lanka. With Serviced Apartments LK, your property becomes more than
                    a space—it becomes a part of a growing success story.</p>
                <p className="font-poppins font-semibold">Serviced Apartments LK — Turning Vision into Value.</p>
            </div>
        </SpaceWrapper> <SpaceWrapper>
            <div className="space-y-8 text-center">
                <h3 className="text-3xl">Our Story</h3>
                <p className="font-poppins font-semibold">From Local Roots to Global Connections</p>
                <div className="space-y-4 font-poppins">
                    <p>Serviced Apartments LK was born from a simple conviction: that Sri Lanka’s abundant hospitality
                        and unique living spaces deserve a global stage. We set out to bridge the gap between property
                        owners yearning for sustainable income and travelers searching for comfort, convenience, and
                        meaningful experiences.</p>
                    <p>Guided by a passion for innovation and community empowerment, we created a platform where every
                        property tells a story, every stay sparks a connection, and every stakeholder benefits. Our team
                        blends deep expertise in real estate, tourism, and hospitality with a forward-thinking
                        approach—transforming underutilized spaces into thriving destinations.</p>
                    <p>From the beginning, we have championed quality, trust, and social impact. Our commitment is
                        evident in every detail—from photography and pricing to guest experiences and support for local
                        suppliers.</p>
                    <p>But our story is about more than properties and platforms. It’s about helping partners achieve
                        their goals, nurturing vibrant communities, and contributing to Sri Lanka’s tourism
                        renaissance.</p>
                    <p>Together, we’re rewriting the narrative of accommodation in Sri Lanka, one stay at a time.</p>

                </div>
            </div>
        </SpaceWrapper>
        </div>
    );
};

export default AboutUs;
