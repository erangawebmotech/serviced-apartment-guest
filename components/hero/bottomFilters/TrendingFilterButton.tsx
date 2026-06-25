import { Button } from '@/components/ui/button'
import Image from 'next/image';
import React from 'react'
import defaultIcon from '@/public/shared/Logo-white.png'

const TrendingFilterButton = ({ id, icon, label, className = '', style = {}, onClick }:
    { id: number, icon: string, label: string, href: string, className?: string, style?: React.CSSProperties, onClick: (id: number) => void }) => {
    return (
        <Button
            className={`flex flex-col items-center justify-center text-center gap-2 max-[426px]:gap-1 bg-transparent mix-blend-multiply font-poppins max-w-24 ${className} hover:bg-transparent custom-trending-filter-item`}
            onClick={() => { onClick(id) }}
            style={style}
        >
            <Image src={icon || defaultIcon} alt={label} width={28} height={28} className="max-[426px]:!text-md mix-blend-multiply" />
            <span className="font-normal max-[426px]:text-[10px] max-[916px]:text-[10px] max-[970px]:text-xs text-sm" aria-hidden="true">{label}</span>
        </Button>
    )
}

export default TrendingFilterButton
