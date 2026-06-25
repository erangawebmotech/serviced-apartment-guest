"use client"
import React, { useEffect, useState } from 'react'

const LocationDescription = ({ paragraph }: { paragraph: string }) => {
    const [description, setDescription] = useState<string>(paragraph)

    useEffect(() => {
        setDescription(paragraph);
    }, [paragraph])

    return (
        <div className='description-paragraph-default h-[50%]'>
            <p className='font-poppins'>
                {description ? description : `Are you seeking an advanced solution to manage your property across multiple platforms, or are you interested in partnering with us for full-service management?
Serviced Apartments LK has partnered with the top online property agencies across the world, to connect with millions of guests who are looking for a property just like yours`}
            </p>
        </div>
    )
}

export default LocationDescription
