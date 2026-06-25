'use client'
import React from 'react'
import SearchContainer from '../serachContainer/SearchContainer'
import Navigation from '@/components/navigation/Navigation'
import UnifiedParallaxCanvas from './UnifiedParallaxCanvas'
import Image from 'next/image'
import tower from '@/public/hero-images/lotus-tower/lotusTowerBgMobile.webp'



const ImageContainer: React.FC<{ aboutRef?: React.RefObject<HTMLDivElement | null>, footerRef?: React.RefObject<HTMLDivElement | null> }> = ({ aboutRef, footerRef }) => {


    return (
        <>
            <div className="top-0 max-[769px]:relative sticky w-full h-screen overflow-hidden">
                <div className="z-[-1] relative w-full h-screen parallax-main">
                    <div className="relative w-full h-full overflow-hidden">
                        <div className='hidden max-[536px]:flex w-screen h-screen'>
                            <Image src={tower} priority alt='Lotus Tower' />
                        </div>
                        <div className='hidden min-[537px]:flex'>
                            <UnifiedParallaxCanvas />

                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B161F] via-[transparent] to-transparent opacity-100"></div>
                </div>
                <SearchContainer />
                <div className='hidden bottom-10 z-20 fixed min-[770px]:flex flex-col justify-center items-center w-full'>
                    <Navigation aboutRef={aboutRef} footerRef={footerRef} />
                </div>
            </div>
        </>

    )
}

export default ImageContainer