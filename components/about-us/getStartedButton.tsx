'use client'
import React from 'react'
const GetStartedButton = () => {
    const handleNavigation = () => {
        window.open(`${process.env.NEXT_PUBLIC_HOST_URL}`, '_blank');
    }
    return (
        <button className="bg-secondary hover:bg-red-500 mt-4 px-5 py-2.5 rounded-lg font-medium text-white text-sm transition duration-300" onClick={handleNavigation}>
            Get Started
        </button>
    )
}

export default GetStartedButton