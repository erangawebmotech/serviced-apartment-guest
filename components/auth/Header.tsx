import React from "react";
import Image from "next/image";
import icon from "@/public/icon.png"



interface Props {
    label: string
}

const Header = ({ label }: Props) => {
    return (
        <div className="flex flex-col items-center gap-y-4 w-full">
            <Image src={icon} alt="Serviced Apartments Logo" height={100} loading="lazy"/>
            <p className="text-muted-foreground text-sm">
                {label}
            </p>
        </div>
    )
}

export default Header
