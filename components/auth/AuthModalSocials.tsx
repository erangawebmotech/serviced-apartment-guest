'use client'
import Link from 'next/link';
import { signIn } from "next-auth/react";

declare global {
    interface Window {
        gapi: any;
    }
}

export const handleFacebookLogin = async () => {
    try {
        const result = await signIn('facebook', {
            redirect: false,
            callbackUrl: '/auth/callback/facebook'
        })

        if (result?.url) {
            const popup = window.open(
                result.url,
                'FacebookLogin',
                'width=600,height=700'
            )

            const checkPopup = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkPopup)
                    window.location.reload()
                }
            }, 500)
        }
    } catch (error) {
        console.error('Login failed:', error)
    }
}



const AuthModalSocials = () => {
    // const [googleAuth, setGoogleAuth] = useState<any>(null);

    // useEffect(() => {
    //     const loadGoogleScript = () => {
    //         const script = document.createElement('script');
    //         script.src = 'https://apis.google.com/js/platform.js';
    //         script.async = true;
    //         script.onload = () => {
    //             window.gapi.load('auth2', () => {
    //                 const authInstance = window.gapi.auth2.init({
    //                     client_id: process.env.AUTH_CLIENT_ID,
    //                 });
    //                 setGoogleAuth(authInstance);
    //             });
    //         };
    //         document.body.appendChild(script);
    //     };

    //     loadGoogleScript();
    // }, []);

    const handleGoogleSignIn = async () => {
        // if (!googleAuth) {
        //     console.warn('Google API is not initialized yet.');
        //     return;
        // }

        // try {
        //     const googleUser = await googleAuth.signIn();
        //     const accessToken = googleUser.getAuthResponse().access_token;
        // } catch (error: any) {
        //     if (error.error === 'popup_closed_by_user') {
        //         console.warn('The sign-in popup was closed by the user.');
        //     } else {
        //         console.error('Google Sign-In Error:', error);
        //     }
        // }


        try {
            const result = await signIn('google', {
                redirect: false,
                callbackUrl: '/auth/callback/google'
            })

            if (result?.url) {
                const popup = window.open(
                    result.url,
                    'googleLogin',
                    'width=600,height=700'
                )

                const checkPopup = setInterval(() => {
                    if (popup?.closed) {
                        clearInterval(checkPopup)
                        window.location.reload()
                    }
                }, 500)
            }
        } catch (error) {
            console.error('Login failed:', error)
        }

    };



    return (
        <>
            <div className="flex justify-between items-center mt-5 w-full">
                <div className="flex-grow border-gray-300 border-t"></div>
                <p className="px-3 text-gray-500 text-sm">or use one of these options</p>
                <div className="flex-grow border-gray-300 border-t"></div>
            </div>

            {/* <div className="flex justify-center items-center gap-3 mt-3 w-full">
                <div className="login-socials">
                    <button onClick={handleGoogleSignIn} className="flex justify-center items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg text-white">
                        <svg
                            viewBox="0 0 262 262"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid"
                            aria-hidden="true"
                            focusable="false"
                            width="24"
                            height="24"
                            role="img"
                        >
                            <path
                                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                fill="#4285F4"
                            ></path>
                            <path
                                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                fill="#34A853"
                            ></path>
                            <path
                                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                fill="#FBBC05"
                            ></path>
                            <path
                                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                fill="#EB4335"
                            ></path>
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                <div className="login-socials">
                    <Link href="/facebook-login" passHref>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            role="img"
                            focusable="false"
                            width="24"
                            height="24"
                        >
                            <path fill="#1877F2" d="M32 0v32H0V0z"></path>
                            <path
                                fill="#FFF"
                                d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"
                            ></path>
                        </svg>
                    </Link>
                </div>
            </div> */}

            <div className="flex justify-center items-center gap-3 mt-3 w-full">
                <div className="login-socials" onClick={handleGoogleSignIn}>

                    <svg
                        viewBox="0 0 262 262"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid"
                        aria-hidden="true"
                        focusable="false"
                        width="24"
                        height="24"
                        role="img"
                    >
                        <path
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                            fill="#4285F4"
                        ></path>
                        <path
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                            fill="#34A853"
                        ></path>
                        <path
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                            fill="#FBBC05"
                        ></path>
                        <path
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                            fill="#EB4335"
                        ></path>
                    </svg>
                </div>
                <div className="login-socials" onClick={handleFacebookLogin}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        role="img"
                        focusable="false"
                        width="24"
                        height="24"
                    >
                        <path fill="#1877F2" d="M32 0v32H0V0z"></path>
                        <path
                            fill="#FFF"
                            d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"
                        ></path>
                    </svg>

                </div>
            </div>

            <div className="mt-5">
                <div className="flex-grow border-gray-300 border-t"></div>

                <p className="mt-3 text-xs text-center">
                    By signing in or creating an account, you agree with our{' '}
                    <Link href="/help/articles/terms-and-conditions" target="_blank" rel="noopener noreferrer" passHref className="text-secondary">
                        Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/help/articles/privacy-policy" target="_blank" rel="noopener noreferrer" passHref className="text-secondary">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </>
    );
};

export default AuthModalSocials;