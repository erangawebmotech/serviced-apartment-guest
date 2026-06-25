"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Logo from "@/public/Logo.png";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { useLoginModal } from "@/common/auth/handleLoginModal";
import { useRouter } from "next/navigation";

const Navbar = ({ className }: { className?: string }) => {
    const [hasSession, setHasSession] = useState(false);
    const [open, setIsOpen] = useState(false);
    const { handleLoginModal } = useLoginModal();
    const router = useRouter()

    useEffect(() => {
        checkSessionStatus();
    }, [])


    const checkSessionStatus = async () => {
        try {
            const response = await fetch("/api/session/check", { method: "POST" });
            const result = await response.json();
            setHasSession(result.success);
        } catch (error) {
            console.error("Error checking session:", error);
        }
    }


    return (
        <>
            <nav className={`top-0 left-0 z-[20] fixed flex justify-between items-center navbar-container-main w-screen
                 ${className ?? 'px-20 max-[769px]:px-5 bg-white bg-opacity-5 backdrop-blur-lg  h-16'}`}>


                <Image loading="lazy" src={Logo} alt="Serviced Apartments Logo" width={150} onClick={() => router.push('/')} className="cursor-pointer" />

                <div className="max-[769px]:hidden flex gap-2">
                    <div className="flex gap-2">
                        <Button className="bg-primary hover:bg-transparent bg-opacity-5 border border-primary border-opacity-50 rounded-2xl font-poppins text-primary">
                            <Link href={process.env.NEXT_PUBLIC_HOST_URL || ''} target="_blank" rel="noopener noreferrer" passHref className="max-[1441px]:text-xs text-sm">
                                Become a Host
                            </Link>
                        </Button>
                    </div>

                    {
                        !hasSession &&
                        <div className="flex gap-2">
                            <Button className="bg-secondary hover:bg-secondary bg-opacity-80 hover:bg-opacity-90 backdrop-blur-xl border border-red-300 rounded-2xl w-20 max-[1441px]:w-20 font-poppins text-white hover:scale-[1.02] transition-transform duration-100" onClick={(e) => {
                                handleLoginModal({ open: true })
                            }}>
                                Login
                            </Button>


                        </div>
                    }
                    {
                        hasSession && (
                            <UserAvatar />
                        )
                    }
                </div>


                <div className="hidden max-[769px]:flex justify-center items-center">
                    {!hasSession ? (
                        <Button className="flex flex-col justify-center items-center bg-transparent mr-3 border-2 border-primary rounded-full w-9 h-9 text-primary hover:text-white" onClick={() => { handleLoginModal({ open: true }) }}>
                            <User className="" />
                        </Button>
                    ) : (
                        <UserAvatar />
                    )}
                    <Sheet open={open} onOpenChange={() => setIsOpen(!open)}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="p-0" onClick={() => setIsOpen(true)}>
                                <Menu style={{ width: '30px', height: '30px', color: `${className ? '#012B4C':'#fff'}` }} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[50vw] max-[535px]:w-[90vw] overflow-x-hidden overflow-y-auto font-poppins"
                        >
                            <SheetHeader>
                                <SheetTitle className="font-semibold text-lg text-left">Navigation</SheetTitle>
                            </SheetHeader>

                            <ul className="flex flex-col items-start gap-4 my-4 text-gray-600 text-sm">

                                <li onClick={() => setIsOpen(false)}>
                                    <Link href="/" className="block hover:text-secondary" >
                                        Home
                                    </Link>
                                </li>
                                <li onClick={() => setIsOpen(false)}>
                                    <Link href="/about-us" className="block hover:text-secondary">
                                        About Us
                                    </Link>
                                </li>
                                <li onClick={() => setIsOpen(false)}>
                                    <Link href="/contact-us" className="block hover:text-secondary" >
                                        Contact Us
                                    </Link>
                                </li>
                                <li onClick={() => setIsOpen(false)}>
                                    <Link href={`${process.env.NEXT_PUBLIC_HOST_URL}`} target="_blank" className="block hover:text-secondary" >
                                        Become a Host
                                    </Link>
                                </li>

                            </ul>
                        </SheetContent>
                    </Sheet>
                </div>

            </nav>

        </>

    );
};

export default Navbar;