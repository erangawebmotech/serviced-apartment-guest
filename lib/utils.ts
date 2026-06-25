import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface ApiObject {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  authentication?: boolean;
  urlencoded?: boolean;
  arrayBufferType?: boolean;
  multipart?: boolean;
  isWithoutPrefix?: boolean;
  endpoint: string;
  body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  state?: string;
  isBasicAuth?: boolean;
  tokenRenewed?: boolean;
}
