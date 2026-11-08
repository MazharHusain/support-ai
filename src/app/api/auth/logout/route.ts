import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        cookieStore.delete("access_token")
        const origin = req.nextUrl.origin
        return NextResponse.redirect(origin)
    } catch (error: any) {
        console.error("[auth/logout] Error:", error?.message || error)
        return NextResponse.json({ message: "Logout failed" }, { status: 500 })
    }
}
