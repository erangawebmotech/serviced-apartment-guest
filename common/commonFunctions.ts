"use server"
import { UserPayload } from "./interfaces";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { encrypt } from "./auth/cookiesOperations";
import { getPDFToDownload } from "@/service/reservation";


const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
    throw new Error("SESSION_SECRET environment variable is not defined");
}

const encodedKey = new TextEncoder().encode(secretKey);

export const getAccessToken = async (): Promise<string | null> => {
    const session = (await cookies()).get("session")?.value;

    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const userPayload = payload as unknown as UserPayload;


        return userPayload.user.access_token;
    } catch (error) {
        console.error("Error verifying access token:", error);
        return null;
    }
};


export async function setAccessToken(newAccessToken: string) {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

    if (!sessionCookie) return null;

    try {

        const { payload } = await jwtVerify(sessionCookie, encodedKey, {
            algorithms: ['HS256'],
        });

        const sessionData = payload as any;


        if (sessionData.user?.access_token) {
            sessionData.user.access_token = newAccessToken;
        } else {
            return null;
        }

        const updatedSession = await encrypt({
            user: sessionData.user,
            expires: sessionData.expires,
        });


        (await
            cookieStore).set("session", updatedSession, {
                expires: new Date(sessionData.expires),
                httpOnly: true,
            });

        return sessionData;
    } catch (error) {
        console.error("Error updating access token:", error);
        return null;
    }
}


export const getLoggedUser = async (): Promise<any> => {
    const session = (await cookies()).get("session")?.value;

    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const userPayload = payload as unknown as UserPayload;


        return userPayload?.user?.user;
    } catch (error) {
        console.error("Error verifying User:", error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    const session = (await cookies()).get("session")?.value;

    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const userPayload = payload as unknown as UserPayload;
        return userPayload.user.refresh_token;
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        return null;
    }
};

export const getUpcomingWeekend = async (): Promise<{ formattedSaturday: string; formattedSunday: string; }> => {
    const today = new Date();
    const currentDay = today.getDay();

    let saturday: Date;
    let sunday: Date;

    if (currentDay === 6) {
        saturday = new Date(today);
        sunday = new Date(today);
        sunday.setDate(saturday.getDate() + 1);
    } else if (currentDay === 0) {
        sunday = new Date(today);
        saturday = new Date(today);
        saturday.setDate(sunday.getDate() - 1);
    } else {
        const daysToSaturday = (6 - currentDay + 7) % 7;
        saturday = new Date(today);
        saturday.setDate(today.getDate() + daysToSaturday);

        sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
    }

    const formatWithOrdinal = (day: number): string => {
        const suffixes = ["th", "st", "nd", "rd"];
        const modulo10 = day % 10;
        const modulo100 = day % 100;
        const suffix = (modulo10 >= 1 && modulo10 <= 3 && !(modulo100 >= 11 && modulo100 <= 13)) ? suffixes[modulo10] : suffixes[0];
        return `${day}${suffix}`;
    };

    const formatDateWithMonth = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
        const monthDay = date.toLocaleDateString("en-US", options);
        const [month, day] = monthDay.split(" ");
        const dayWithOrdinal = formatWithOrdinal(Number(day));
        return `${month} ${dayWithOrdinal}`;
    };

    const formattedSaturday = formatDateWithMonth(saturday);
    const formattedSunday = formatDateWithMonth(sunday);

    return {
        formattedSaturday,
        formattedSunday,
    };
};


