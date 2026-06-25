"use client"
import RecaptchaLoader from '@/components/common/RecaptchaLoader'
import Footer from '@/components/footer/Footer'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
           <RecaptchaLoader />
            {children}
            <Footer />
        </>
    )
}

export default layout