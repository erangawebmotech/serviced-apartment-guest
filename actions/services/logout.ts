"use server"
import { cookies } from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('session');
        return { success: "Logged out successfully" };

    } catch (error: any) {
        return { error: error.message };
    }
};