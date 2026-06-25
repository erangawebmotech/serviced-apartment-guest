import { PRIVACY_STATEMENTS } from '@/common/data'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import image from '@/public/favicon.ico'

const page = () => {
    return (

        <div>
            <Card className="flex flex-col gap-10 bg-transparent shadow-none mt-10 p-10 rounded-lg">
                <h1 className='font-semibold text-2xl'>Privacy Policy</h1>
                {PRIVACY_STATEMENTS.map((section, index) => (

                    <div key={index}>
                        <h2 className="mb-2 font-medium text-base">{index + 1}. {section?.title}</h2>
                        <p className="text-gray-600 text-sm">{section?.description}</p>
                        {
                            section?.subDetails && (
                                <ul className="flex flex-col gap-2 mt-2 pl-5 text-gray-600 text-sm list-disc list-inside">
                                    {section?.subDetails?.map((detail, i) => (
                                        <li key={i} className='flex items-start gap-2'>{<Image src={image} alt='serviced apartments logo' className='saturate-0 w-4'/>}{detail}</li>
                                    ))}
                                </ul>
                            )
                        }
                        <p className="mt-2 text-gray-600 text-sm">{section?.additionalDetails}</p>
                    </div>

                ))}
            </Card>
        </div>


    )
}

export default page