'use server'

import { hasValidSession } from "@/actions/utils/checkSession";
import { NextResponse } from "next/server";

export async function POST() {
    const isValidSession = await hasValidSession();
    // if (isValidSession) {
    //     return NextResponse.json({ success: true });
    // } else {
    //     return NextResponse.json({ success: false }, { status: 401 });
    // }
    return NextResponse.json({ success: isValidSession });
}
