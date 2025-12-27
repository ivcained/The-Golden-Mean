/**
 * Farcaster Quick Auth API Route
 * 
 * This API provides authentication verification for Farcaster Quick Auth.
 * It verifies JWT tokens issued by Farcaster and returns user information.
 * 
 * Endpoints:
 * - GET: Verify JWT token and return user information
 */

import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Farcaster Quick Auth client instance
 */
const client = createClient();

/**
 * Determines the correct domain for JWT verification
 * 
 * Attempts to extract the domain from request headers in order of reliability:
 * 1. Origin header (most reliable for CORS requests)
 * 2. Host header
 * 3. Environment variables (fallback)
 * 
 * @param request - Next.js request object
 * @returns Domain/host string for JWT verification
 */
function getUrlHost(request: NextRequest): string {
  // First try to get the origin from the Origin header (most reliable for CORS requests)
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return url.host;
    } catch (error) {
      console.warn("Invalid origin header:", origin, error);
    }
  }

  // Fallback to Host header
  const host = request.headers.get("host");
  if (host) {
    return host;
  }

  // Final fallback to environment variables
  let urlValue: string;
  if (process.env.VERCEL_ENV === "production") {
    urlValue = process.env.NEXT_PUBLIC_URL!;
  } else if (process.env.VERCEL_URL) {
    urlValue = `https://${process.env.VERCEL_URL}`;
  } else {
    urlValue = "http://localhost:3000";
  }

  const url = new URL(urlValue);
  return url.host;
}

/**
 * GET /api/auth - Verify Farcaster Quick Auth token
 * 
 * Verifies a JWT token from Farcaster Quick Auth and returns user information.
 * This endpoint is called via `sdk.quickAuth.fetch` from the MiniApp SDK,
 * which automatically includes the Authorization header.
 * 
 * Headers:
 * - Authorization: Bearer <jwt_token> (required)
 * 
 * @returns JSON response with user info or error
 * 
 * Response Codes:
 * - 200: Success, token valid
 * - 401: Missing or invalid token
 * - 500: Server error
 * 
 * Success Response:
 * ```json
 * {
 *   "success": true,
 *   "user": {
 *     "fid": 12345,
 *     "issuedAt": 1234567890,
 *     "expiresAt": 1234567890
 *   }
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  // Extract Authorization header from request
  // When called via sdk.quickAuth.fetch in a mini app, this header is automatically included
  const authorization = request.headers.get("Authorization");

  // Ensure token is present and properly formatted
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  try {
    // Verify the JWT token with Farcaster
    // The domain must match the request domain for security
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: getUrlHost(request),
    });

    console.log("payload", payload);

    // Extract user's Farcaster ID from verified token
    const userFid = payload.sub;

    // Return verified user information
    return NextResponse.json({
      success: true,
      user: {
        fid: userFid,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
      },
    });

  } catch (e) {
    // Handle specific error types
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
    throw e;
  }
}
