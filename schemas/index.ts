import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string({ required_error: "Email is required" }).min(1, "Email is Required").email("Please enter a valid email address"),
    password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});
export const ForgotPasswordRequestOTPSchema = z.object({
    reqEmail: z.string({ required_error: "Email is required" }).min(1, "Email is Required").email("Please enter a valid email address"),
});
export const confirmChangePasswordSchema = z.object({
    newConfirmPassword: z.string({ required_error: "Password is required" }).min(6, "Password is need to be at least 6 characters"),
    confirmPassword: z.string({ required_error: "Confirm Password is required" }).min(6, "Password is need to be at least 6 characters"),
}).refine((data) => data.newConfirmPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const RegisterSchema = z.object({
    firstName: z.string({ required_error: "First name is required" }).min(1, "First name is required"),
    lastName: z.string({ required_error: "Last name is required" }).min(1, "Last name is required"),
    email: z.string({ required_error: "Email is required" }).email("Please enter a valid email address"),
    password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
    confirmPassword: z.string({ required_error: "Please confirm your password" }).min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
