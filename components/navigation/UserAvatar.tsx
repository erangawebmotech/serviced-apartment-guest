import React, { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    HoverCard,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { logout } from "@/actions/services/logout";
import { ExternalLink, LogOut } from 'lucide-react';
import { getLoggedUser } from '@/common/commonFunctions';
import { useRouter } from 'next/navigation';

const UserAvatar = () => {
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState<string>("");
    const [nameInitials, setNameInitials] = useState<string>("");
    const router = useRouter();
    const handleLogout = async () => {
        const response = await logout();

        if (response.success) {
            window.location.reload();
        } else {
            console.error(response.error);
        }
    };

    useEffect(() => {
        getUser();
    }, [])




    const getUser = async () => {
        const response = await getLoggedUser();
        if (response) {
            setUser(response);
            const { firstName, lastName } = response;
            const formattedFullName = `${firstName ?? ''} ${lastName ?? ''}`;
            setFullName(formattedFullName);
            const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            setNameInitials(initials);
        }
    }
    return (
        <Menubar className="bg-transparent focus:!bg-transparent shadow-none border-none w-min">
            <MenubarMenu>
                <MenubarTrigger className="bg-transparent w-min">
                    <HoverCard>
                        <HoverCardTrigger asChild className="bg-transparent cursor-pointer">
                            <Avatar>
                                <AvatarImage src={user?.file?.smallPath} />
                                <AvatarFallback className='flex flex-col justify-center items-center bg-secondary w-full h-full font-poppins text-white text-center'>{nameInitials}</AvatarFallback>
                            </Avatar>

                        </HoverCardTrigger>

                    </HoverCard>
                </MenubarTrigger>
                <MenubarContent className="-top-2 -right-10 absolute font-poppins">

                    <MenubarItem className="px-5 cursor-pointer">
                        <div className="flex items-center">
                            <span className="font-semibold text-sm text-left">{fullName}</span>
                        </div>
                    </MenubarItem>
                    <MenubarItem className="px-5 cursor-pointer" onClick={() => { router.push('/reservation-history') }}>
                        <div className="flex items-center">
                            <ExternalLink className="opacity-70 mr-2 w-4 h-4" />{" "}
                            <span className="text-muted-foreground text-xs">
                                My Reservations
                            </span>
                        </div>
                    </MenubarItem>
                    <MenubarItem className="px-5 cursor-pointer" onClick={handleLogout}>
                        <div className="flex items-center">
                            <LogOut className="opacity-70 mr-2 w-4 h-4" />{" "}
                            <span className="text-muted-foreground text-xs">
                                Logout
                            </span>
                        </div>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>

    )
}

export default UserAvatar