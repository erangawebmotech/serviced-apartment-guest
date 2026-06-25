import { Button } from "@/components/ui/button";
import React from "react";

const AboutButton = ({ label, type, onClick }: { label: string, type: string, onClick?: () => void }) => {
    return (
        <Button className={`font-poppins font-normal border description-paragraph-default
      ${type === 'default'
                ? 'border-primary text-primary hover:bg-primary hover:text-white px-6 py-7 max-[1400px]:p-5 max-[935px]:p-6'
                : type === 'host'
                    ? 'border-2 hover:bg-white hover:text-primary py-8'
                    : type === 'white-outlined' ? 'py-6 hover:bg-white hover:text-primary min-w-52'
                        : type === 'white-filled' ? 'py-6 !bg-white hover:!bg-transparent hover:!text-white text-primary  min-w-52'
                            : 'border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-7  max-[1398px]:p-5 max-[935px]:p-6'}
      rounded-full bg-transparent w-full duration-300`}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default AboutButton;
