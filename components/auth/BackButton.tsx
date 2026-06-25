"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface Props {
    href: string,
    label: string,
}

const BackButton = ({ href, label }: Props) => {
    return (
        <Button variant="link" className='font-poppins w-full' size='sm' asChild>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}

export default BackButton