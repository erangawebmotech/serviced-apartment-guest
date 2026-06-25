'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import Link from 'next/link';
import { sendMessage } from '@/actions/services/contactUS';
import Spinner from '../common/Spinner';
import { toast } from '@/hooks/use-toast';
import { getCaptchaToken } from '@/actions/utils/captcha';


const ContactUsForm = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contactNo: formData.contactNumber,
            description: formData.message
        };
        const token = await getCaptchaToken();
        await sendMessage({ data, token }).then((res) => {
            if (res.error) {
                toast({
                    description: res.errors.message,
                    className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                    duration: 3000,
                });
                console.error('Error sending message:', res.errors.message);
            } else {
                toast({
                    description: res.message,
                    className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                    duration: 3000,
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    contactNumber: '',
                    message: ''
                });
            }
        }).catch((error) => {
            console.error('Unexpected error:', error);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };
 
    return (

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                        First Name
                    </label>
                    <Input
                        name="firstName"
                        value={formData.firstName}
                        required
                        onChange={handleInputChange}
                        className="border border-gray-400 w-full"
                        placeholder="Enter your first name"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                        Last Name
                    </label>
                    <Input
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border border-gray-400 w-full"
                        placeholder="Enter your last name"
                    />
                </div>
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Email
                </label>
                <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Contact Number
                </label>
                <Input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full"
                    placeholder="+1 123 456 7890"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Message
                </label>
                <Textarea
                    name="message"
                    placeholder="Type your message here..."
                    value={formData.message}
                    required
                    onChange={handleInputChange}
                    rows={4}
                    className="border border-gray-400 w-full"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="communication" className="mt-1" />
                    <label htmlFor="communication" className="text-gray-600 text-sm">
                        I agree to receive other communication messages.
                    </label>
                </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
                We value your privacy and are committed to keeping your personal information safe, as outlined in our{' '}
                <Link
                    href="/help/articles/privacy-policy"
                    target="_blank"
                    className="font-semibold text-secondary hover:underline"
                >
                    Privacy Policy
                </Link>
                . By reaching out, you’re giving us the opportunity to stay connected. From time to time, we may share updates about new features, services, or helpful resources we think might interest you. You can opt out anytime — no pressure, no spam.
            </p>

            <Button
                className="flex justify-center items-center gap-2 bg-primary hover:bg-blue-900 px-8 py-6 w-full sm:w-auto text-white"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Spinner />
                        Submitting
                    </>
                ) : (
                    'Send Message'
                )}
            </Button>

        </form>
    )
}

export default ContactUsForm