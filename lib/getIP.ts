import { headers } from "next/headers";

export function getClientIP() {
    const headersList = headers();

    const forwardedFor = headersList.get("x-forwarded-for") || "";
    const realIP = headersList.get("x-real-ip") || ""
   
    if (forwardedFor) {
        console.log("Forwarded for: ", forwardedFor)
        if (forwardedFor === "::1") {
            return "127.0.0.1"
        }
        return forwardedFor.split(",")[0].trim()
    } 

    if (realIP) {
        return realIP.trim()
    }

    return null 
}