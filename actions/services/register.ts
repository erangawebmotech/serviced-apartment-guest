"use server"

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { registerUserWithEmailDetail, sendOTPToEmail } from "@/service/auth";
import { createSession } from "@/common/auth/cookiesOperations";
import conf from "@/service/apiConfig";



let data: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    otp: number | null;
    source?: string;
} = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    otp: null,
};

// let hashedPassword: string | null = null;

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { firstName, lastName, email, password } = values;

    try {

        // hashedPassword = await bcrypt.hash(password, 10);
        // hashedPassword = password;
        data = {
            firstName,
            lastName,
            email,
            password: password,
            otp: null,
        };

        const response = await sendOTPToEmail({
            firstName: firstName,
            lastName: lastName,
            email: email,
            type: "CUSTOMER_EMAIL_SIGN_UP",
        });

        return { success: response.message };
    } catch (error: any) {
        return { error: error.message };
    }


};


export const registerUser = async (otp: number) => {
    if (!otp) {
        return { error: "OTP is required!" };
    }
    data.otp = otp;
    data.source = conf.platform;

    try {
        const res = await registerUserWithEmailDetail(data);
        const user = res?.data;
        const expires = new Date(Date.now() + 1000000000000 * 1000);

        await createSession({ user, expires });

        return { success: res.message };
    } catch (error: any) {
        return { error: error.message };
    }
    

}

