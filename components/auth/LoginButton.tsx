"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    children: React.ReactNode,
    mode?: "modal" | "redirect",
    asChild?: boolean,
}

const LoginButton: React.FC<Props> = ({ children, mode = "redirect"  }) => {

    const router = useRouter();
    const onClick = () => {
        router.push('/login');
    }

    if (mode === 'modal') {
        return (
            <span>
                Implement Modal
            </span>
        )
    }

    return (
        <span className='cursor-pointer' onClick={onClick}>
            {children}
        </span>
    )
}

export default LoginButton