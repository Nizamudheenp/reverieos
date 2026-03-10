import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

// Initializing the rate limit cache
const rateLimitCache = new LRUCache({
    max: 500, // Limit cache to 500 unique IPs
    ttl: 60 * 1000, // 1 minute window
});

export function proxy(request) {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const path = request.nextUrl.pathname;

    // Rate Limiting for API routes
    if (path.startsWith("/api") && !path.startsWith("/api/auth")) {
        const limit = 60; // 60 requests per minute
        const currentUsage = rateLimitCache.get(ip) || 0;

        if (currentUsage >= limit) {
            return new NextResponse(
                JSON.stringify({ error: "Too many requests, please try again later." }),
                { status: 429, headers: { "content-type": "application/json" } }
            );
        }

        rateLimitCache.set(ip, currentUsage + 1);
    }

    // Security Headers
    const response = NextResponse.next();

    // X-Frame-Options: Prevent clickjacking
    response.headers.set("X-Frame-Options", "DENY");

    // X-Content-Type-Options: Prevent MIME sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");

    // Referrer-Policy: Control how much referrer information is sent
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content-Security-Policy: Basic protection against XSS
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://lh3.googleusercontent.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://lh3.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

    response.headers.set("Content-Security-Policy", cspHeader);

    return response;
}

// Matching all routes except static assets
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
