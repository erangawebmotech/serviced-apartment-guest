 import React, { ReactNode } from "react";

interface TemplateWrapperProps {
    children: ReactNode;
}

const SpaceWrapper: React.FC<TemplateWrapperProps> = ({ children }) => {
    return (
        <div
            className="relative flex flex-col items-center bg-[#F7F7F7]
                 p-10 max-[1440px]:px-10 max-[435px]:px-3
                 max-[672px]:px-5 w-full font-poppins"
        >
            <div
                className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5
                   max-[1450px]:px-10 max-[1730px]:px-32
                   w-full h-full"
            >
                {children}
            </div>
        </div>
    );
};

export default SpaceWrapper;
