import Image from 'next/image';
import React from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const OptionButton = ({ active, option, onClick }: { active: boolean; option: string | StaticImport; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={`about-option-button rounded-full border-4 overflow-hidden cursor-pointer
      transition duration-300 ease-in-out transform
      ${active ? 'border-primary z-[5] scale-110' : 'z-[1] scale-100'}
      hover:scale-105 hover:border-primary`}
    >
      <Image
        src={option}
        alt="serviced apartments locations"
        width={80}
        height={80}
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
    </div>
  );
};

export default OptionButton;
