import { StaticImageData } from 'next/image';
import React from 'react';

const TrustedClientImage = ({ href }: { href: StaticImageData }) => {
    return (
        <div
            className="rounded-full w-14 h-14 max-[1440px]:w-12 max-[1440px]:h-12 max-[875px]:w-10 max-[875px]:h-10"
            style={{
                backgroundImage: `url(${href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
    );
};

export default TrustedClientImage;
