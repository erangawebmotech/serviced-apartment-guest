import { FacebookLogin, GoogleLogin } from "@/actions/services/login"
import NextAuth from "next-auth"
import Facebook from "next-auth/providers/facebook"
import Google from "next-auth/providers/google"

const handleFacebookLogin = async (token: string) => {
    await FacebookLogin(token).then((res) => {
    }).catch((error) => {
        console.log(error)
    })
}
const handleGoogleLogin = async (token: string) => {
    await GoogleLogin(token).then((res) => {
    }).catch((error) => {
        console.log(error)
    })
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
            authorization: {
                params: {
                    display: "popup",
                    auth_type: "reauthenticate",
                    scope: "email",
                }
            }
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            authorization: {
                display: "popup",
                auth_type: "reauthenticate",
                scope: "email",
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {

            if (!user?.email) {
                return false
            }
            if (account?.provider === "google") {
                await handleGoogleLogin(account?.access_token!)
                return true;
            } else if (account?.provider === "facebook") {
                await handleFacebookLogin(account?.access_token!)
                return true;
            } else {
                return false
            }

        }
    }

})