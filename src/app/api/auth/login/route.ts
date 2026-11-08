import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Build redirectUri from request origin — works on localhost & Vercel without NEXT_PUBLIC_APP_URL
        const origin = req.nextUrl.origin
        const redirectUri = `${origin}/api/auth/callback`
        const url = scalekit.getAuthorizationUrl(redirectUri)
        return NextResponse.redirect(url)
    } catch (error: any) {
        console.error("[auth/login] Error:", error?.message || error)
        return NextResponse.json({ message: "Login failed" }, { status: 500 })
    }
}
