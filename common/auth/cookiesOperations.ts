"use server"

import { getNewAccessToken } from "@/service/auth";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { UserPayload } from "../interfaces";

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function decryptSession(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error("Failed to decrypt session:", error);
        return null;
    }
}


export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const accessToken: string = (payload.user as UserPayload).access_token;
        const refreshToken: string = (payload.user as UserPayload).refresh_token;

        const accessTokenPayload = await verifyAccessToken(accessToken);


        if (!accessTokenPayload) {
            console.log("Access token expired, attempting to refresh...");

            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                console.log("New access token received:", newAccessToken);
                return newAccessToken;
            } else {
                console.log("Refresh failed, redirecting to login...");
                return null;
            }
        }
        return accessToken;
    } catch (error) {
        console.error("Failed to verify session:", error);
        return null;
    }
}


export async function refreshAccessToken() {
    try {
        const response = await getNewAccessToken();
        if (response?.data?.accessToken) {
            return response?.data.accessToken;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
}

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7D')
        .sign(encodedKey)
}


export async function verifyAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}


export async function createSession({ user, expires }: { user: any, expires: any }) {
    const session = await encrypt({ user, expires });
    (await cookies()).set('session', session, {
        expires,
        httpOnly: true,
    });
}

