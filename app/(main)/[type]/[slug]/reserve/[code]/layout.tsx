"use client"
import Footer from '@/components/footer/Footer'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}

export default layout