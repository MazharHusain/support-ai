import { cookies } from "next/headers";
import { scalekit } from "./scalekit";

export async function getSession() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("access_token")?.value

        // No token → not logged in
        if (!token) {
            return null
        }

        // validateToken throws ScalekitValidateTokenFailureException
        // when token is expired or invalid — we catch it and return null
        const result: any = await scalekit.validateToken(token)

        if (!result?.sub) {
            return null
        }

        const user = await scalekit.user.getUser(result.sub)
        return user

    } catch (error: any) {
        // Token expired or invalid — treat as logged out, do NOT crash
        console.warn("[getSession] Token validation failed:", error?.message || error)
        return null
    }
}
