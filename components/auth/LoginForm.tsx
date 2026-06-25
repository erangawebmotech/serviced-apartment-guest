"use client"

import React, { useState, useTransition } from 'react'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { LoginSchema } from '@/schemas'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { login } from '@/actions/services/login'
import Spinner from '../common/Spinner'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "customer@example.com",
            password: "secret",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);

                if (data.success) {
                    router.push('/');
                }
            });
        });
    };

    return (
        <CardWrapper headerLabel='Welcome back' backButtonLabel="Don't have an account?" backButtonHref='/register' showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 font-poppins'>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='john.doe@example.com' type='email' disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                placeholder='******'
                                                type={showPassword ? 'text' : 'password'}
                                                disabled={isPending}
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
                    <Button type='submit' className='w-full' size='lg' disabled={isPending}>
                        {isPending && (
                            <Spinner />
                        )}
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LoginForm