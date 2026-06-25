import Image, { StaticImageData } from 'next/image';
import React from 'react';

const LocationCard = ({ name, href, alt, onClick, isSelected }: { name: string, href: StaticImageData, alt: string, onClick: () => void, isSelected: boolean }) => {

    return (
        <div
            className={`relative max-[1440px]:w-[300px] max-[1440px]:h-[130px] max-[1440px]:m-1 shadow-md hover:shadow-lg m-2 rounded-xl w-[300px] h-[200px] max-[400px]:w-full transition-shadow duration-300 overflow-hidden ${isSelected ? 'border-secondary border-2' : ''}`}
            onClick={onClick}
        >
            <span className="top-2 right-2 z-10 absolute bg-white bg-opacity-10 shadow-md backdrop-blur-md px-3 py-1 border border-white rounded-lg font-poppins text-white max-[400px]:text-xs text-base tracking-wide">
                {name}
            </span>

            <div className="relative w-full h-full">
                <Image
                    loading="lazy"
                    src={href}
                    alt={alt}
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition-transform duration-300 ease-out"
                />
            </div>

            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="p-4 text-white">
                    <p className="font-poppins text-sm pointer-events-none">{alt}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
