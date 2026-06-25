"use server"

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import conf from "./apiConfig";
import * as constants from "@/common/constants";
import { ApiObject } from "@/lib/utils";
import { cookies } from "next/headers";
import { getAccessToken, getRefreshToken, setAccessToken } from "@/common/commonFunctions";
import { logout } from "@/actions/services/logout";
import { refreshAccessToken } from "@/common/auth/cookiesOperations";


export const callApi = async (apiObject: ApiObject): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
    let body = {};

    const method = apiObject.method ? apiObject.method.toLowerCase() : "get";

    // Retrieve CSRF token from cookies on the server side
    const csrfToken = (await cookies()).get(constants.CSRF_TOKEN_KEY)?.value;
    body = ["post", "put", "patch", "delete"].includes(method)
        ? apiObject.body
        : {};

    const headers = {
        "Content-Type": apiObject.urlencoded
            ? "application/x-www-form-urlencoded"
            : apiObject.arrayBufferType
                ? "application/pdf"
                : apiObject.multipart
                    ? "multipart/form-data"
                    : "application/json",
        "Content-Disposition":
            apiObject.arrayBufferType && "attachment; filename=template.xlsx",
        responseType: apiObject.arrayBufferType ? "arraybuffer" : "json",
        "X-CSRF-Token": csrfToken || "",
        Authorization: "",
        VerifyCode: undefined,
    };



    if (apiObject.authentication) {
        const access_token = await getAccessToken();
        const refresh_token = await getRefreshToken();
        if (access_token && apiObject.state !== "refresh_token") {

            headers.Authorization = `Bearer ${access_token || null}`;
        } else if (refresh_token && apiObject.state === "refresh_token") {

            headers.Authorization = `Bearer ${refresh_token || null}`;
        }
    }
    if (apiObject.isBasicAuth) {
        headers.Authorization = `Basic ${constants.BASIC_AUTH}`;
    }

    let url = '';
    if (apiObject.isWithoutPrefix) {
        url = apiObject.endpoint;
    } else {
        url = `${conf.serverUrl}/${apiObject.endpoint}`;
    }
    let result;

    console.log('API:: ', apiObject)
    try {
        let response;
        if (method === "get") {
            response = await axios.get(url, { headers, responseType: apiObject.arrayBufferType ? "arraybuffer" : "json" });
        } else if (method === "post") {
            response = await axios.post(url, body, { headers })
        } else if (method === "put") {
            response = await axios.put(url, body, { headers });
        } else if (method === "patch") {
            response = await axios.patch(url, body, { headers });
        } else if (method === "delete") {
            response = await axios.delete(url, { headers });
        }

        if (apiObject.arrayBufferType) {
            result = response?.data;
        } else {
            result = {
                ...response?.data,
            };
        }

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const response = error?.response;
            const data = response?.data;
            if (response) {
                if (response?.status === 401) {
                    result = {
                        success: false,
                        status: 401,
                        data: error?.response,
                        message: data?.error?.error_message || "Access is denied.",
                    };
                } else if (response.status === 403) {
                    result = {
                        success: false,
                        status: 403,
                        data: error?.response,
                        message: data?.error?.error_message || "Please login or signup.",
                    };
                } else if (response?.status === 400) {
                    result = {
                        success: false,
                        status: 400,
                        data: data,
                        message: data?.error?.error_message || 'Bad request',
                    };
                } else if (response?.status === 417) {
                    result = {
                        success: false,
                        status: 417,
                        data: data,
                        message: data?.error?.error_message || "Oops! Something went wrong.",
                    };
                } else {

                    result = {
                        success: false,
                        status: response.status,
                        data,
                        message: data?.error?.error_message || "Sorry, something went wrong",
                    };
                }
            } else {
                result = {
                    success: false,
                    status: 403,
                    data: error?.response,
                    message: data?.error?.error_message || "Please login or signup.",
                };
            }
        } else {
            result = {
                success: false,
                status: 400,
                data: null,
                message: "Something went wrong.",
            };
        }

        throw result;
    }
    return result;

};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];
const processQueue = (error: unknown = null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (!originalRequest) {
            return Promise.reject(error);
        }
        if (error.response?.status === 400) {
            return Promise.reject(error);
        }
        if ((error.response?.status !== 401 && error.response?.status !== 403) && originalRequest._retry) {
            return Promise.reject(error);
        }
        if (error.response?.status === 403) {
            processQueue(null)
            await logout()
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                return axios(originalRequest);
            }).catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;


        try {
            const accessToken = await refreshAccessToken();
            await setAccessToken(accessToken!);

            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] =
                    `Bearer ${accessToken}`;
            }

            processQueue(null, accessToken);

            return axios(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            await logout()
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }

    }
);