import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")

        // Build redirect URI from request origin so it works on any environment
        // (localhost, Vercel preview URLs, production — no NEXT_PUBLIC_APP_URL needed)
        const origin = req.nextUrl.origin
        const redirectUri = `${origin}/api/auth/callback`

        if (!code) {
            return NextResponse.json({ message: "Authorization code not found" }, { status: 400 })
        }

        const session = await scalekit.authenticateWithCode(code, redirectUri)

        if (!session?.accessToken) {
            return NextResponse.json({ message: "Failed to get access token" }, { status: 500 })
        }

        const response = NextResponse.redirect(origin)

        response.cookies.set("access_token", session.accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60,   // FIX: seconds (not milliseconds) → 24 hours
            secure: true,
            path: "/",
            sameSite: "lax",
        })

        return response

    } catch (error: any) {
        console.error("[auth/callback] Error:", error?.message || error)
        const origin = req.nextUrl.origin
        // Redirect to home with error flag instead of crashing
        return NextResponse.redirect(`${origin}?auth_error=1`)
    }
}
