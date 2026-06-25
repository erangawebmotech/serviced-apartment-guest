import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from 'next/link';

const DynamicBreadCrumb = () => {

    return (

        <Breadcrumb className="mt-5 max-[450px]:mt-3 font-poppins">
            <BreadcrumbList className='max-[450px]:gap-[0.5] max-[450px]:text-xs'>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Filter</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default DynamicBreadCrumb