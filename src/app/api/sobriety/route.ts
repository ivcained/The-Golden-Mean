/**
 * Sobriety Data API Routes
 * 
 * This API provides endpoints for managing user sobriety tracking data.
 * All operations are tied to a user's Farcaster ID (FID).
 * 
 * Endpoints:
 * - GET: Retrieve user sobriety data
 * - POST: Create or update sobriety data
 * - DELETE: Reset/delete sobriety data
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getUserSobrietyData,
  saveUserSobrietyData,
  deleteUserSobrietyData,
  initializeDatabase,
} from "~/lib/db";

/**
 * Database initialization flag
 * Ensures database is initialized only once per server instance
 */
let dbInitialized = false;

/**
 * Ensures database is initialized before operations
 * 
 * Initializes the database tables on first request.
 * Subsequent calls do nothing (idempotent).
 */
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

/**
 * GET /api/sobriety - Fetch user sobriety data
 * 
 * Retrieves sobriety tracking data for a specific user by their FID.
 * 
 * Query Parameters:
 * - fid: Farcaster ID of the user (required)
 * 
 * @returns JSON response with user data or error
 * 
 * Response Codes:
 * - 200: Success (data found or not found)
 * - 400: Invalid or missing FID
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    const fidNumber = parseInt(fid, 10);
    if (isNaN(fidNumber)) {
      return NextResponse.json(
        { error: "Invalid FID format" },
        { status: 400 }
      );
    }

    const data = await getUserSobrietyData(fidNumber);

    if (!data) {
      return NextResponse.json(
        { data: null, message: "No data found for this user" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/sobriety error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sobriety - Save or update user sobriety data
 * 
 * Creates new sobriety tracking data or updates existing data for a user.
 * Uses upsert logic (ON CONFLICT) to handle both cases.
 * 
 * Request Body:
 * - fid: Farcaster ID (required)
 * - startDate: Sobriety start date YYYY-MM-DD (required)
 * - addiction: Type of addiction (required)
 * - startTime: Start time HH:MM (optional)
 * - customAddiction: Custom addiction name (optional)
 * - dailyCost: Estimated daily cost (optional, default: 8)
 * - motivation: User's motivation text (optional)
 * - pledgeDate: Date of pledge (optional)
 * - walletAddress: User's wallet address (optional)
 * - authStrategy: Auth method used (optional)
 * 
 * @returns JSON response with success status or error
 * 
 * Response Codes:
 * - 200: Success
 * - 400: Missing required fields
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const body = await request.json();
    const {
      fid,
      startDate,
      startTime,
      addiction,
      customAddiction,
      dailyCost,
      motivation,
      pledgeDate,
      walletAddress,
      authStrategy,
    } = body;

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    if (!startDate || !addiction) {
      return NextResponse.json(
        { error: "Start date and addiction are required" },
        { status: 400 }
      );
    }

    const result = await saveUserSobrietyData({
      fid: parseInt(fid, 10),
      startDate,
      startTime: startTime || "",
      addiction,
      customAddiction: customAddiction || "",
      dailyCost: dailyCost || 8,
      motivation: motivation || "",
      pledgeDate: pledgeDate || "",
      walletAddress: walletAddress || "",
      authStrategy: authStrategy || "",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to save data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/sobriety error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sobriety - Reset user sobriety data
 * 
 * Deletes all sobriety tracking data for a user.
 * Used when user wants to reset their journey or delete their account.
 * 
 * Query Parameters:
 * - fid: Farcaster ID of the user (required)
 * 
 * @returns JSON response with success status or error
 * 
 * Response Codes:
 * - 200: Success
 * - 400: Invalid or missing FID
 * - 500: Server error
 */
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    const fidNumber = parseInt(fid, 10);
    if (isNaN(fidNumber)) {
      return NextResponse.json(
        { error: "Invalid FID format" },
        { status: 400 }
      );
    }

    const result = await deleteUserSobrietyData(fidNumber);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to delete data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/sobriety error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
