"use client"
import React from 'react'
import { ReactLenis } from '@/components/common/SmoothScroll'
import Navbar from '@/components/navigation/Navbar'
import Link from 'next/link'
import Image from 'next/image'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <header >
                <Navbar />
            </header>
            <ReactLenis root>
                {children}
            </ReactLenis>
            <Link
                href="https://ebadge.bestweb.lk/api/v1/clicked/servicedapartments.lk/BestWeb/2025/Rate_Us"
                target="_blank"
                className="bottom-4 left-6 z-[100] fixed w-auto h-32"
            >
                <Image
                    src="https://ebadge.bestweb.lk/eBadgeSystem/domainNames/servicedapartments.lk/BestWeb/2025/Rate_Us/image.png"
                    alt="logo"
                    width={160}
                    height={40}
                    className="w-auto h-32"
                    loading="eager"
                />

            </Link>

        </>
    )
}

export default MainLayout