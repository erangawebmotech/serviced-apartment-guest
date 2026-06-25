"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CursorProps, Position, TabProps } from "@/common/interfaces";
import { navOptions } from "./NavigationOptions";
import { useRouter } from "next/navigation";

const Navigation: React.FC<{ aboutRef?: React.RefObject<HTMLDivElement| null>, footerRef?: React.RefObject<HTMLDivElement | null> }> = ({ aboutRef, footerRef }) => {
  const [revealText, setRevealText] = useState(false);
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const router = useRouter();

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setRevealText(true);
    }, 1200);

    return () => {
      clearTimeout(textTimer);
    };
  }, []);
  const handleAboutUsClick = () => {
    window.open("/about-us", "_blank");
  };


  const handleContactClick = () => {
    window.open("/contact-us", "_blank");
  };
  return (
    <div className={`border w-max h-max p-1 bg-[rgba(255,255,255,0.1)] rounded-full border-[rgba(255,255,255,0.3)] opacity-0 ${revealText ? "custom-navigation-bar" : ""}`}>
      <ul
        onMouseLeave={() => {
          setPosition((prev) => ({
            ...prev,
            opacity: 0,
          }));
        }}
        className="relative flex mx-auto p-1 rounded-full w-fit custom-navigation-bar-wrapper"
      >
        {navOptions.map((option, index) => (
          <li key={index}>
            <Link
              href={option.href}
              onClick={option.label === "About Us" ? handleAboutUsClick :
                option.label === "Contact Us" ? handleContactClick : undefined
              }
            >
              <Tab
                setPosition={setPosition}
                setActiveIndex={() => setActiveIndex(index)}
                isActive={index === activeIndex}
              >
                {option.label}
              </Tab>
            </Link>

          </li>
        ))}
        <Cursor position={position} />
      </ul>
    </div>
  );
};

const Tab: React.FC<TabProps & { isActive: boolean; setActiveIndex: () => void }> = ({
  children,
  setPosition,
  setActiveIndex,
  isActive,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={() => {
        setActiveIndex();
      }}
      animate={{
        backgroundColor: isActive ? "#EF5A60" : "transparent",
        color: isActive ? "#FFFFFF" : "#000000",
      }}
      whileHover={{
        color: "#FFFFFF",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="block z-10 relative px-2 md:px-4 py-1 md:py-2 rounded-full font-poppins font-normal text-xs md:text-sm cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const Cursor: React.FC<CursorProps> = ({ position }) => (
  <motion.li
    animate={{
      left: position.left,
      width: position.width,
      opacity: position.opacity,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 25,
    }}
    className="z-0 absolute bg-secondary rounded-full h-5 md:h-9"
  />
);

export default Navigation;
