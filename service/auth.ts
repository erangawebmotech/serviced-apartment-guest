"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";
import { AccessType, PASSWORDRESETACTIONTYPE } from "@/common/constants";
import conf from "./apiConfig";

export async function loginUserWithEmailDetail(data: { email: string, password: string }) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/auth/sign-in/email',
        body: data,
    };
    return await callApi(apiObject);

}
export async function loginUserWithFacebook(token: string) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/auth/sign-in/facebook',
        body: {
            access_token: token,
            source: conf.platform,
        },
    };
    return await callApi(apiObject);

}

export async function loginUserWithGoogle(token: string) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/auth/sign-in/google',
        body: {
            accessToken: token,
            source: conf.platform,
        },
    };
    return await callApi(apiObject);

}
export async function requestNewOTPForRestPassword(email: string) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/auth/send-otp?email=${email}&sendOTPType=UPDATE_PASSWORD`,
        body: null,
    };
    return await callApi(apiObject);

}
export async function validateOTP({ email, otp }: { email: string; otp: number }) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/auth/validate-otp?key=${email}&otp=${otp}`,
        body: null,
    };
    return await callApi(apiObject);

}

export async function registerUserWithEmailDetail(data: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    otp: number | null;
    source?: string;
}) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/auth/sign-up/email',
        body: data,
    };
    return await callApi(apiObject);

}

export async function getNewAccessToken() {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        state: "refresh_token",
        endpoint: 'api/v1/admin/auth/get-new-token',
        body: null,
    };
    return await callApi(apiObject);

}

export async function sendOTPToEmail({ email, type, firstName, lastName }: { email: string; type: AccessType, firstName: string, lastName: string }) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/auth/send-otp?email=${email}&sendOTPType=${type}&firstName=${firstName}&lastName=${lastName}`,
        body: null,
    };
    return await callApi(apiObject);
}

export async function forgotPassword(data: { newPassword: string, email: string, otp: number, passwordActionType: PASSWORDRESETACTIONTYPE }) {
    const apiObject: ApiObject = {
        method: 'PUT',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/auth/password',
        body: data,
    };
    return await callApi(apiObject);

}