"use server"

import { PASSWORDRESETACTIONTYPE } from "@/common/constants";
import { ForgotPasswordRequestOTPSchema } from "@/schemas";
import { forgotPassword, requestNewOTPForRestPassword, validateOTP } from "@/service/auth";
import * as z from "zod";

export const requestOTP = async (values: z.infer<typeof ForgotPasswordRequestOTPSchema>) => {
    const validatedFields = ForgotPasswordRequestOTPSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }
    try {
        const res = await requestNewOTPForRestPassword(values?.reqEmail ?? '');

        return { success: res?.message };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const validateEmailOTP = async (data: { email: string; otp: number }) => {
    if (!data) {
        return { error: "Something Went Wrong!" };
    }
    try {
        const res = await validateOTP(data);
        return { success: res?.message };
    } catch (error: any) {
        return { error: error.message };
    }
}

export const changePassword = async (data:{newPassword:string, email:string, otp:number, passwordActionType:PASSWORDRESETACTIONTYPE}) => {
   
    if (!data) {
        return { error: "Something Went Wrong!" };
    }
    try {
        const res = await forgotPassword(data);
        return { success: res?.message };    
    } catch (error: any) {
        return { error: error.message };
    }
};




