"use server";

import { cookies } from "next/headers";
import { decryptSession } from "@/common/auth/cookiesOperations";

export async function hasValidSession(): Promise<boolean> {
    try {
        const sessionCookie = (await cookies()).get("session");
        if (!sessionCookie) {
            console.log("No session cookie found");
            return false;
        }

        const session = await decryptSession(sessionCookie.value);
        if (!session) {
            console.log("Invalid or expired session");
            return false;
        }

        console.log("Session is valid");
        return true;
    } catch (error) {
        console.error("Error while validating session:", error);
        return false;
    }
}
