import { Mail, MapPin } from 'lucide-react';
import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaFacebookF, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa6';
import Link from 'next/link';
import ContactUsForm from './contactUsForm';
import RequestWhatsappWrapper from './RequestWhatsappWrapper';
const ContactUsPage = () => {
    return (
        <>
            <div className='mt-8'>
                <h1 className="font-bold text-primary text-4xl md:text-5xl text-center">
                    Get In Touch
                </h1>
                <div className="py-16">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
                        <div className="gap-16 grid lg:grid-cols-2">

                            <div className="shadow-md p-8 border rounded-lg">
                                <h2 className="mb-4 font-bold text-gray-900 text-3xl">Let's Talk!</h2>
                                <p className="mb-8 text-gray-600">
                                    Get in touch with us using the enquiry form or contact details below.
                                </p>

                                <ContactUsForm />
                            </div>


                            <div className="space-y-8">
                                <div className="shadow-md p-6 border rounded-lg">
                                    <h3 className="mb-6 font-semibold text-gray-900 text-xl">Quick Contact</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                                                <FaWhatsapp className="w-5 h-5 text-primary" />
                                            </div>
                                            <RequestWhatsappWrapper>
                                                <div className="text-gray-500 text-sm">WhatsApp</div>
                                                <span className="text-gray-900">+94 77 003 3848</span>
                                            </RequestWhatsappWrapper>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-sm">Email</div>
                                                <a className="text-gray-900" href='mailto:support@servicedapartments.lk'>support@servicedapartments.lk</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex justify-center items-center bg-blue-100 rounded-full min-w-10 min-h-10">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-sm">Headquater</div>
                                                <address className="text-gray-900 not-italic">Bank of Ceylon Mw, Level 35, West Tower, World Trade Center, 00100</address>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="mb-4 font-semibold text-gray-900 text-lg">Follow us</h4>
                                        <div className="flex space-x-3">
                                            <Link className="flex justify-center items-center bg-primary hover:bg-blue-900 rounded-md w-10 h-10 transition-colors cursor-pointer" href={"https://web.facebook.com/ServicedApartmentsLK"} target="_blank" aria-label="Facebook">
                                                <FaFacebookF className="w-5 h-5 text-white" />
                                            </Link>
                                            <Link className="flex justify-center items-center bg-primary hover:bg-blue-900 rounded-md w-10 h-10 transition-colors cursor-pointer" href={"https://www.instagram.com/servicedapartments.lk"} target="_blank" aria-label="Instagram">
                                                <FaInstagram className="w-5 h-5 text-white" />
                                            </Link>
                                            <Link className="flex justify-center items-center bg-primary hover:bg-blue-900 rounded-md w-10 h-10 transition-colors cursor-pointer" href={"https://www.linkedin.com/company/seyka-holdings/"} target="_blank" aria-label="LinkedIn">
                                                <FaLinkedin className="w-5 h-5 text-white" />
                                            </Link>
                                            <Link className="flex justify-center items-center bg-primary hover:bg-blue-900 rounded-md w-10 h-10 transition-colors cursor-pointer" href={"https://www.tiktok.com/@servicedapartmentslk"} target="_blank" aria-label="TikTOk">
                                                <FaTiktok className="w-5 h-5 text-white" />
                                            </Link>
                                            <Link className="flex justify-center items-center bg-primary hover:bg-blue-900 rounded-md w-10 h-10 transition-colors cursor-pointer" href={"https://www.youtube.com/@SeykaHoldings"} target="_blank" aria-label="YouTube">
                                                <FaYoutube className="w-5 h-5 text-white" />
                                            </Link>
                                        </div>
                                    </div>

                                </div>

                                <div className="relative shadow-xl border rounded-lg w-full h-[400px] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg rotate-2 transform"></div>
                                    <div className="relative flex justify-center items-center bg-primary/20 rounded-lg w-full h-full">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.644677313145!2d79.8436284776273!3d6.933003011619617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259441372d9a5%3A0xb23c254ff2858b2a!2sSEYKA%20HOLDINGS!5e0!3m2!1sen!2slk!4v1749200745992!5m2!1sen!2slk"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Media Makeup Location"
                                            className="absolute inset-0"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUsPage