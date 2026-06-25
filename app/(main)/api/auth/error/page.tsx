import React from "react"
import Logo from "@/public/icon.png"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { handleFacebookLogin } from "@/components/auth/AuthModalSocials"

const AuthErrorPage = () => {
    return (
        <div className="flex justify-center items-center bg-white px-4 py-8 min-h-screen font-poppins">
            <div className="space-y-6 w-full max-w-md text-center">

                <div className="flex justify-center items-center mb-4 h-16">
                    <Image src={Logo} alt="Serviced Apartments" className="w-20 h-auto" />
                </div>

                <h1 className="font-semibold text-gray-900 text-2xl">
                    Email is Required to Register in Serviced Apartments
                </h1>

                <p className="text-gray-600 text-sm">
                    Please add an email to your Facebook account and try again. We need your email to complete the sign-up process.
                </p>

                <div>
                    <Button
                        onClick={handleFacebookLogin}
                        className="inline-block bg-primary hover:bg-blue-900 mt-4 px-6 py-2 rounded-lg text-white transition"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AuthErrorPage
