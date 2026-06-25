"use client"
import { RequestWhatsappChat } from '@/lib/whatsapp'
import React, { ReactNode } from 'react'

const RequestWhatsappWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div onClick={() => { RequestWhatsappChat.greeting() }} className='cursor-pointer'>
            {children}
        </div>
    )
}

export default RequestWhatsappWrapper