"use server"

import { LoginSchema } from "@/schemas";
import { loginUserWithEmailDetail, loginUserWithFacebook, loginUserWithGoogle } from "@/service/auth";
import * as z from "zod";
import { createSession } from "@/common/auth/cookiesOperations";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    try {
        const res = await loginUserWithEmailDetail(values);
        const user = res?.data;
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        await createSession({ user, expires });

        return { success: res.message };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const FacebookLogin = async (token: string) => {

    try {
        const res = await loginUserWithFacebook(token);
        const user = res?.data;
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days


        await createSession({ user, expires });

        return { success: res.message };
    } catch (error: any) {
        return { error: error.message };
    }
};
export const GoogleLogin = async (token: string) => {

    try {
        const res = await loginUserWithGoogle(token);
        const user = res?.data;
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days


        await createSession({ user, expires });

        return { success: res.message };
    } catch (error: any) {
        return { error: error.message };
    }
};









