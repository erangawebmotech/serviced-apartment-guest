import React, { useEffect } from "react";
import AboutButton from "../common/about/AboutButton";
import Image from "next/image";
import logo from '@/public/Logo_White.png'
import { FaFacebookF, } from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa6";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { useRouter } from "next/navigation";


const Footer: React.FC<{ footerRef?: React.RefObject<HTMLDivElement | null> }> = ({ footerRef }) => {
    const router = useRouter();
    useEffect(() => {
        const interval = setInterval(() => {
            const popup = document.querySelector(".aioa-widget-container, .aioa-modal-wrapper, #aioa_accessibility_settings");
            if (popup && !popup.hasAttribute("data-lenis-prevent")) {
                popup.setAttribute("data-lenis-prevent", "");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleFindStay = () => {
        // router.push('/feature/filter-page')
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const queryParams: Record<string, any> = {
            destination: '',
            place_id: undefined,
            checkin: today.toISOString(),
            checkout: tomorrow.toISOString(),
            no_adults: '1',
            no_rooms: '1',
            no_children: '0',
            pets: false.toString(),
        };

        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== "")
        );

        const params = new URLSearchParams(filteredParams).toString();

        router.push(`/search-results?${params}`);
    }

    const handleBecomeHost = () => {
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
        window.open(hostUrl, '_blank');
    }
    return (
        <>
            <footer className="sticky bg-primary max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 pt-20 pb-12 text-white" ref={footerRef}>

                <div className="flex flex-col justify-center items-center mx-auto max-w-[80%]">
                    <h2 className="w-[35%] max-[1275px]:w-[60%] max-[1600px]:w-[50%] max-[1822px]:w-[40%] max-[769px]:w-full max-[856px]:w-[80%] max-[1100px]:text-5xl text-6xl text-center">
                        Experience Comfort In Every Stay
                    </h2>

                    <div className="flex max-[580px]:flex-col gap-5 my-10 max-sm:w-full text-center">
                        <AboutButton label={"FIND YOUR STAY"} type={"white-outlined"} onClick={handleFindStay} />
                        <AboutButton label={"BECOME HOST"} type={"white-filled"} onClick={handleBecomeHost} />
                    </div>


                    <div className="max-[805px]:hidden flex flex-wrap justify-center items-center my-10 w-full font-poppins">
                        <ul className="flex justify-around gap-10 w-max font-light text-base">
                            <li><Link href="/" className="block mb-2 hover:text-secondary">Home</Link></li>
                            <li><Link href="/about-us" target="_blank" className="block mb-2 hover:text-secondary">About Us</Link></li>
                            <li><Link href="/contact-us" target="_blank" className="block mb-2 hover:text-secondary">Contact Us</Link></li>
                            {/* <li><Link href="#" className="block mb-2 hover:text-secondary">What We Do</Link></li> */}
                            {/* <li><Link href="#" className="block mb-2 hover:text-secondary">Donate</Link></li> */}
                            <li><Link href="/help/articles/privacy-policy" className="block mb-2 hover:text-secondary" target="_blank">Privacy Policy</Link></li>
                            <li><Link href="/help/articles/terms-and-conditions" className="block mb-2 hover:text-secondary" target="_blank">Terms and Conditions</Link></li>
                            <li><Link href="/sitemap.xml" className="block mb-2 hover:text-secondary" target="_blank">Site Map</Link></li>
                        </ul>
                    </div>

                    <div className="min-[806px]:hidden flex flex-wrap justify-between mt-10 mb-10 w-full font-poppins">
                        <div className="mb-6 w-full">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="font-normal text-base">Navigation</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="font-normal">
                                            <li><Link href="/" className="block mb-2 hover:text-secondary">Home</Link></li>
                                            <li><Link href="/about-us" target="_blank" className="block mb-2 hover:text-secondary">About Us</Link></li>
                                            <li><Link href="/contact-us" target="_blank" className="block mb-2 hover:text-secondary">Contact Us</Link></li>
                                            {/* <li><a href="#" className="block mb-2 hover:text-secondary">What We Do</a></li>
                                        <li><a href="#" className="block mb-2 hover:text-secondary">Donate</a></li> */}
                                            <li><Link href="/help/articles/privacy-policy" className="block mb-2 hover:text-secondary" target="_blank">Privacy Policy</Link></li>
                                            <li><Link href="/help/articles/terms-and-conditions" className="block mb-2 hover:text-secondary" target="_blank">Terms and Conditions</Link></li>
                                            <li><Link href="/sitemap.xml" className="block mb-2 hover:text-secondary" target="_blank">Site Map</Link></li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                    </div>



                    <div className="bg-white/20 mt-5 mb-10 w-full h-[1px]"> </div>

                    <div className="flex lg:flex-row flex-col justify-between items-center gap-10 lg:gap-0 mt-8 w-full font-poppins text-sm text-center">
                        <Image
                            loading="lazy"
                            src={logo}
                            alt="Serviced Apartments Logo"
                            width={200}
                            className="mb-4 sm:mb-0 max-[768px]:w-[150]"
                        />

                        <div>
                            <p className="mb-4 sm:mb-0 font-light max-[768px]:text-sm text-lg tracking-wide">
                                © {new Date().getFullYear()} Serviced Apartments. All Rights Reserved.
                            </p>
                            <p className="mt-3 sm:mb-0 font-light text-sm max-[768px]:text-sm tracking-wide">
                                Developed By <Link href={'https://webmotech.com'} target="_blank">Webmotech</Link>
                            </p>
                        </div>



                        <div className="flex justify-center sm:justify-start gap-4">
                            <Link className="hover:bg-white p-2 border rounded-full hover:text-primary duration-300 cursor-pointer" href={"https://web.facebook.com/ServicedApartmentsLK"} target="_blank" aria-label="Facebook">
                                <FaFacebookF className="w-5 h-5" />
                            </Link>
                            <Link className="hover:bg-white p-2 border rounded-full hover:text-primary duration-300 cursor-pointer" href={"https://www.instagram.com/servicedapartments.lk"} target="_blank" aria-label="Instagram">
                                <FaInstagram className="w-5 h-5" />
                            </Link>
                            <Link className="hover:bg-white p-2 border rounded-full hover:text-primary duration-300 cursor-pointer" href={"https://www.linkedin.com/company/seyka-holdings/"} target="_blank" aria-label="LinkedIn">
                                <FaLinkedin className="w-5 h-5" />
                            </Link>
                            <Link className="hover:bg-white p-2 border rounded-full hover:text-primary duration-300 cursor-pointer" href={"https://www.tiktok.com/@servicedapartmentslk"} target="_blank" aria-label="TikTok">
                                <FaTiktok className="w-5 h-5" />
                            </Link>
                            <Link className="hover:bg-white p-2 border rounded-full hover:text-primary duration-300 cursor-pointer" href={"https://www.youtube.com/@SeykaHoldings"} target="_blank" aria-label="YouTube">
                                <FaYoutube className="w-5 h-5" />
                            </Link>
                        </div>


                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;