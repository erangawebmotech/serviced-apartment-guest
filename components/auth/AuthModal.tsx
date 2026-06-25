"use client";
import React, { useEffect, useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmChangePasswordSchema, ForgotPasswordRequestOTPSchema, LoginSchema, RegisterSchema } from "@/schemas";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { login } from "@/actions/services/login";
import Spinner from "../common/Spinner";
import { HiEye, HiEyeOff } from "react-icons/hi";
import '@/styles/auth-modal.css'
import AuthModalSocials from "./AuthModalSocials";
import { Checkbox } from "../ui/checkbox";
import { register, registerUser } from "@/actions/services/register";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { changePassword, requestOTP, validateEmailOTP } from "@/actions/services/forgotPassword";
import { PASSWORDRESETACTIONTYPE } from "@/common/constants";
import { useLenis } from "lenis/react";
import { getReservationSummaryDetails } from "@/actions/services/getReservationDetails";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    activeTab?: 'login' | 'register',
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange, activeTab }) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [registerError, setRegisterError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [registerSuccess, setRegisterSuccess] = useState<string | undefined>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showChangePasswordFields, setShowChangePasswordFields] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegPasswordConfirm, setShowRegPasswordConfirm] = useState(false);
    const [otp, setOtp] = useState<string>("");
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
    const [passwordResetComplete, setPasswordResetComplete] = useState<string>('');
    const lenis = useLenis()
    const router = useRouter();

    useEffect(() => {

        const checkSessionStatus = async () => {
            if (success && !isForgotPassword || passwordResetComplete) {
                onOpenChange(false);
                lenis?.start()

                try {
                    const response = await fetch("/api/session/check", { method: "POST" });
                    const result = await response.json();

                    const hasPendingReservation = JSON.parse(sessionStorage.getItem('hasPendingReservation') || 'false');
                    if (hasPendingReservation) {
                        return;
                    }
                    if (result.success && !hasPendingReservation) {
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Error checking session:", error);
                }
            }
        };

        checkSessionStatus();
    }, [success, onOpenChange, passwordResetComplete]);

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
                if (data.success) {
                    const pendingReservation = JSON.parse(sessionStorage.getItem('pendingReservation') || '{}');
                    const hasPendingReservation = JSON.parse(sessionStorage.getItem('hasPendingReservation') || 'false');

                    if (hasPendingReservation) {
                        handlePendingReservation(pendingReservation);
                    }
                }
            });
        });
    };

    const handlePendingReservation = async (pendingReservation: any) => {
        await getReservationSummaryDetails(pendingReservation).then((res) => {
            if (res?.error) {
                throw res.errors;
            }

            if (res) {
                sessionStorage.removeItem('pendingReservation');
                sessionStorage.setItem('hasPendingReservation', JSON.stringify(false))
                sessionStorage.setItem('reservation-summary', JSON.stringify(res))
                sessionStorage.setItem('reservation-details', JSON.stringify(pendingReservation))
                router.push(`/${res?.data?.property?.type?.toLowerCase() || "hotel"}/${res?.data?.property?.slug || ""}/reserve`);
            }
        }).catch((err) => {
            console.log(err)
            // toast({
            //     description: err.message,
            //     className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
            //     duration: 3000,
            // });

        })
    }

    const handleRequestOTP = (values: z.infer<typeof ForgotPasswordRequestOTPSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            requestOTP(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);

                if (data.success) {
                    setIsOTPSent(true);
                }

            });
        });
    };
    useEffect(() => {
        if (showChangePasswordFields) {
            forgotPasswordRequestOTPForm.reset();
        }
    }, [showChangePasswordFields]);

    const handleForgotPassword = async (values: z.infer<typeof confirmChangePasswordSchema>) => {
        setError("");
        setSuccess("");

        const payload = {
            newPassword: values.newConfirmPassword,
            otp: otp ? Number(otp) : 0,
            email: verifiedEmail || "",
            passwordActionType: 'RESET_PASSWORD' as PASSWORDRESETACTIONTYPE
        }
        await changePassword(payload).then((response) => {
            setError(response.error);
            setSuccess(response.success);
            setIsValidating(false)
            setIsOTPSent(false);
            setOtp("")

            if (response.success) {
                startTransition(() => {
                    login({ email: payload.email, password: payload.newPassword }).then((data) => {
                        setError(data.error);
                        setSuccess(data.success);
                        if (data.success) {
                            setPasswordResetComplete(data.success)
                        }
                    });
                });
            }
        }).catch((error) => {
            console.error(error)
        }).finally(() => {

        })
    };

    const onRegisterSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setRegisterError("");
        setRegisterSuccess("");

        startTransition(() => {
            register(values).then((data) => {
                setRegisterError(data.error);
                setRegisterSuccess(data.success);
                if (!data.error) {
                    setIsOTPSent(true);
                }
            });
        });
    };

    const loginForm = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const forgotPasswordRequestOTPForm = useForm<z.infer<typeof ForgotPasswordRequestOTPSchema>>({
        resolver: zodResolver(ForgotPasswordRequestOTPSchema),
        defaultValues: {
            reqEmail: "",
        },
        mode: 'onChange',
    });
    const confirmChangePasswordForm = useForm<z.infer<typeof confirmChangePasswordSchema>>({
        resolver: zodResolver(confirmChangePasswordSchema),
        defaultValues: {
            newConfirmPassword: "",
            confirmPassword: "",
        },
        mode: 'onChange',
    });


    const registerForm = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


    const handleChange = async (value: string) => {
        if (value.match(REGEXP_ONLY_DIGITS)) {
            setOtp(value);


            if (!isForgotPassword) {
                if (value.length === 6) {
                    setIsValidating(true)
                    await validateEmailOTP({ email: registerForm.getValues('email'), otp: Number(value) }).then(async (response) => {
                        setRegisterError(response.error);
                        setRegisterSuccess(response.success);
                        setIsValidating(false)
                        setIsOTPSent(false);
                        if (response.success) {
                            setIsOTPSent(false);
                            await registerUser(Number(value)).then(async (res) => {
                                if (res?.error) {
                                    setRegisterSuccess('')

                                    setRegisterError(res.error);
                                    setIsValidating(false)
                                    setIsOTPSent(false);
                                    setOtp('')
                                    return;
                                }

                                setOtp("")
                                setIsValidating(false)
                                setIsOTPSent(false);
                                if (res) {
                                    onOpenChange(false);

                                    try {
                                        const response = await fetch("/api/session/check", { method: "POST" });
                                        const result = await response.json();
                                        if (result.success) {
                                            window.location.reload();
                                        }
                                    } catch (error) {
                                        console.error("Error checking session:", error);
                                    }
                                }
                            })
                        } else {
                            setOtp("")
                        }
                    })


                }
            } else if (isForgotPassword) {
                if (value.length === 6) {
                    setIsValidating(true)
                    await validateEmailOTP({ email: forgotPasswordRequestOTPForm.getValues('reqEmail'), otp: Number(value) }).then((response) => {
                        setError(response.error);
                        setSuccess(response.success);
                        setIsValidating(false)
                        setIsOTPSent(false);
                        if (response.success) {
                            setIsOTPSent(false);
                            setShowChangePasswordFields(true);
                            setVerifiedEmail(forgotPasswordRequestOTPForm.getValues("reqEmail"));
                            forgotPasswordRequestOTPForm.reset();
                            confirmChangePasswordForm.reset();
                        } else {
                            setOtp("")
                        }
                    })
                }

            }

        }
    };

    useEffect(() => {
        if (isOpen) {
            lenis?.stop()
        } else {
            lenis?.start()
        }
    }, [isOpen])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
                <DialogContent className="max-[415px]:max-w-xs max-[530px]:max-w-sm font-poppins" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="max-[530px]:text-base">Welcome to Serviced Apartments</DialogTitle>
                        <DialogDescription className="max-[530px]:text-xs">
                            If you don’t have an account yet, feel free to register and join us.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue={activeTab || "login"}>
                        <TabsList className="grid grid-cols-2 bg-primary w-full text-white">
                            <TabsTrigger value="login" className="font-normal max-[530px]:text-sm">
                                Login
                            </TabsTrigger>
                            <TabsTrigger value="register" className="font-normal max-[530px]:text-sm">
                                Register
                            </TabsTrigger>
                        </TabsList>


                        <TabsContent value="login">
                            {
                                !isForgotPassword ? (
                                    <Card>
                                        <CardContent className="max-[530px]:p-3 py-10">
                                            <Form {...loginForm}>
                                                <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6 font-poppins">
                                                    <div className="space-y-4">
                                                        <FormField
                                                            control={loginForm.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        <span className="max-[530px]:text-xs">
                                                                            Email
                                                                            <span className="text-red-600"> *</span>
                                                                        </span>
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="john.doe@example.com"
                                                                            type="email"
                                                                            disabled={isPending}
                                                                            className="max-[530px]:text-xs"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={loginForm.control}
                                                            name="password"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        <span className="max-[530px]:text-xs">
                                                                            Password
                                                                            <span className="text-red-600"> *</span>
                                                                        </span></FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <Input
                                                                                {...field}
                                                                                placeholder="******"
                                                                                type={showPassword ? "text" : "password"}
                                                                                disabled={isPending}
                                                                                className="max-[530px]:text-xs"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setShowPassword(!showPassword)}
                                                                                className="right-0 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                            >
                                                                                {showPassword ? <HiEye /> : <HiEyeOff />}
                                                                            </button>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormError message={error} />
                                                    <FormSuccess message={success} />


                                                    <div className="flex justify-end items-center !m-0 !p-0">
                                                        <Button onClick={() => { setIsForgotPassword(true) }} className="bg-transparent hover:bg-transparent shadow-none text-primary text-xs text-right hover:underline">
                                                            Forgot Password?
                                                        </Button>
                                                    </div>


                                                    <Button type="submit" className="w-full max-[530px]:text-xs" size="lg" disabled={isPending}>
                                                        {isPending && <Spinner />}
                                                        Continue
                                                    </Button>
                                                </form>
                                            </Form>

                                            <AuthModalSocials />
                                        </CardContent>


                                    </Card>
                                ) : (
                                    <Card className="shadow-none max-[530px]:p-0 pt-5">
                                        <CardContent className="p-3">

                                            {
                                                !showChangePasswordFields ? (
                                                    <Form {...forgotPasswordRequestOTPForm}>
                                                        <form onSubmit={forgotPasswordRequestOTPForm.handleSubmit(handleRequestOTP)} className="space-y-6 max-[530px]:space-y-5 font-poppins">

                                                            <FormField
                                                                control={forgotPasswordRequestOTPForm.control}
                                                                name="reqEmail"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            <span className="max-[530px]:text-xs">
                                                                                Email
                                                                                <span className="text-red-600"> *</span>
                                                                            </span>
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                placeholder="serviced.apartments@example.com"
                                                                                type="email"
                                                                                className="max-[530px]:text-xs"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormError message={error} />
                                                            <FormSuccess message={success} />
                                                            <Button type="submit" className="flex items-center gap-2 w-full max-[530px]:text-xs" size="lg" disabled={isPending}>
                                                                {isPending && (<Spinner />)}
                                                                Change Password
                                                            </Button>


                                                        </form>
                                                    </Form>
                                                ) : (
                                                    <Form {...confirmChangePasswordForm}>
                                                        <form onSubmit={confirmChangePasswordForm.handleSubmit(handleForgotPassword)} className="space-y-6 max-[530px]:space-y-5 font-poppins">
                                                            <FormField
                                                                control={confirmChangePasswordForm.control}
                                                                name="newConfirmPassword"
                                                                render={({ field }) => (
                                                                    <FormItem className="hidden">
                                                                        <FormLabel>
                                                                            <span className="max-[530px]:text-xs">
                                                                                New Password <span className="text-red-600">*</span>
                                                                            </span>
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    {...field}
                                                                                    placeholder="******"
                                                                                    type={showNewPassword ? "text" : "password"}
                                                                                    disabled={isPending}
                                                                                    className="max-[530px]:text-xs"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                                    className="right-0 z-10 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                                >
                                                                                    {showNewPassword ? <HiEye /> : <HiEyeOff />}
                                                                                </button>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={confirmChangePasswordForm.control}
                                                                name="newConfirmPassword"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            <span className="max-[530px]:text-xs">
                                                                                New Password <span className="text-red-600">*</span>
                                                                            </span>
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    {...field}
                                                                                    placeholder="******"
                                                                                    type={showNewPassword ? "text" : "password"}
                                                                                    disabled={isPending}
                                                                                    className="max-[530px]:text-xs"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                                    className="right-0 z-10 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                                >
                                                                                    {showNewPassword ? <HiEye /> : <HiEyeOff />}
                                                                                </button>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={confirmChangePasswordForm.control}
                                                                name="confirmPassword"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            <span className="max-[530px]:text-xs">
                                                                                Confirm Password
                                                                                <span className="text-red-600"> *</span>
                                                                            </span>
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    {...field}
                                                                                    placeholder="******"
                                                                                    type={showConfirmNewPassword ? "text" : "password"}
                                                                                    disabled={isPending}
                                                                                    className="max-[530px]:text-xs"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                                                    className="right-0 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                                >
                                                                                    {showConfirmNewPassword ? <HiEye /> : <HiEyeOff />}
                                                                                </button>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormError message={error} />
                                                            <FormSuccess message={success} />
                                                            <Button type="submit" className="flex items-center gap-2 w-full max-[530px]:text-xs" size="lg" disabled={isPending}>
                                                                {isPending && (<Spinner />)}
                                                                Confirm
                                                            </Button>


                                                        </form>
                                                    </Form>
                                                )
                                            }
                                            <p className="flex justify-center items-center gap-2 text-xs text-right">
                                                Remembered your password?{" "}
                                                <Button onClick={() => { setIsForgotPassword(false) }} className="bg-transparent hover:bg-transparent shadow-none p-0 text-primary text-xs hover:underline">
                                                    Go back to login
                                                </Button>
                                            </p>

                                            <AuthModalSocials />
                                        </CardContent>
                                    </Card>
                                )
                            }
                        </TabsContent>

                        <TabsContent value="register">
                            <Card className="max-[530px]:h-max max-h-[75vh] overflow-y-auto">
                                <CardContent className="space-y-6 max-[530px]:p-3 py-10">
                                    <Form {...registerForm}>
                                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6 font-poppins">
                                            <div className="space-y-4 max-[530px]:text-xs">

                                                <div>
                                                    <FormField
                                                        control={registerForm.control}
                                                        name="firstName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    <span className="max-[530px]:text-xs">
                                                                        Legal name
                                                                        <span className="text-red-600"> *</span>
                                                                    </span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="First name"
                                                                        className="placeholder:font-light placeholder:text-slate-400 max-[530px]:text-xs"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={registerForm.control}
                                                        name="lastName"
                                                        render={({ field }) => (
                                                            <FormItem className="mt-2">
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Last name"
                                                                        className="placeholder:font-light placeholder:text-slate-400 max-[530px]:text-xs"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <p className="mt-1 text-gray-500 text-xs">
                                                    Make sure this matches the name on your government ID.
                                                </p>
                                                {/* <p className="mt-1 text-gray-500 text-xs">
                                                    Make sure this matches the name on your government ID. If you go by another name, you
                                                    can add a <Link href="#" className="text-secondary" onClick={() => {
                                                        setIsDialogOpen(true)
                                                    }}>preferred first name</Link>.
                                                </p> */}
                                                <div>
                                                    <FormField
                                                        control={registerForm.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    <span className="max-[530px]:text-xs">
                                                                        Email
                                                                        <span className="text-red-600"> * </span>
                                                                    </span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="example@example.com"
                                                                        type="email"
                                                                        className="placeholder:font-light placeholder:text-slate-400 max-[530px]:text-xs"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={registerForm.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    <span className="max-[530px]:text-xs">
                                                                        Password
                                                                        <span className="text-red-600"> * </span>
                                                                    </span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <div className="relative mt-1">
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Enter password"
                                                                            type={showRegPassword ? "text" : "password"}
                                                                            disabled={isPending}
                                                                            className="placeholder:font-light placeholder:text-slate-400 max-[530px]:text-xs"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowRegPassword(!showRegPassword)}
                                                                            className="right-0 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                        >
                                                                            {showRegPassword ? <HiEye /> : <HiEyeOff />}
                                                                        </button>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={registerForm.control}
                                                        name="confirmPassword"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    <span className="max-[530px]:text-xs">
                                                                        Confirm password
                                                                        <span className="text-red-600"> * </span>
                                                                    </span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <div className="relative mt-1">
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Confirm password"
                                                                            type={showRegPasswordConfirm ? "text" : "password"}
                                                                            disabled={isPending}
                                                                            className="placeholder:font-light placeholder:text-slate-400 max-[530px]:text-xs"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowRegPasswordConfirm(!showRegPasswordConfirm)}
                                                                            className="right-0 absolute inset-y-0 flex items-center px-2 text-primary"
                                                                        >
                                                                            {showRegPasswordConfirm ? <HiEye /> : <HiEyeOff />}
                                                                        </button>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <CardDescription className="text-xs">
                                                        <div className="flex items-center max-[530px]:items-start space-x-2 mt-3">
                                                            <Checkbox id="terms" />
                                                            <label
                                                                htmlFor="terms"
                                                                className="peer-disabled:opacity-70 font-normal text-xs leading-normal peer-disabled:cursor-not-allowed"
                                                            >
                                                                I don’t want marketing messages from Serviced Apartments.
                                                            </label>
                                                        </div>
                                                    </CardDescription>
                                                </div>

                                                <FormError message={registerError} />
                                                <FormSuccess message={registerSuccess} />

                                                <div className="max-[530px]:text-xs text-center">
                                                    <Button type="submit" className="w-full max-[530px]:text-xs" size="lg" disabled={isPending} >
                                                        {isPending && <Spinner />}
                                                        Agree and continue
                                                    </Button>

                                                </div>
                                            </div>



                                            <AuthModalSocials />
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>

                    <DialogFooter>

                    </DialogFooter>
                </DialogContent>
            </Dialog >

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='font-poppins'>
                    <DialogHeader>
                        <DialogTitle>Preferred First Name</DialogTitle>
                    </DialogHeader>

                    <div>
                        <div>
                            <Input id="password" placeholder="Preferred First Name (optional)" type="text" className="mt-3 mb-2" />
                        </div>

                        <DialogDescription className="mb-3 text-xs">
                            This is how your first name will appear to Hosts and guests.
                        </DialogDescription>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)} className="w-full font-normal" size={"lg"}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isOTPSent} onOpenChange={setIsOTPSent} >
                <DialogContent className="flex flex-col justify-center items-center max-[400px]:max-w-xs max-[530px]:max-w-sm font-poppins">
                    <DialogHeader>
                        <DialogTitle className="font-semibold text-gray-900 max-[530px]:text-base text-lg">
                            Verify Your Email
                        </DialogTitle>
                        <p className="text-gray-600 max-[530px]:text-xs text-sm">
                            Please enter the 6-digit code we sent to your email address. Didn't receive it?
                            <button
                                className="ml-1 font-normal text-secondary hover:underline"
                            // onClick={handleResendOTP}
                            // disabled={isResending}
                            >
                                Resend Code
                            </button>
                        </p>
                    </DialogHeader>
                    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={(e) => handleChange(e)} value={otp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                            <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                            <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                        </InputOTPGroup>
                        <InputOTPSeparator className="max-[400px]:hidden" />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                            <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                            <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                        </InputOTPGroup>
                    </InputOTP>
                    {
                        isValidating && <p>validating...</p>
                    }

                </DialogContent>
            </Dialog>


        </>

    );
};

export default AuthModal;
