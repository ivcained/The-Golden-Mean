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
  getAllUserSobrietyData,
  saveUserSobrietyData,
  deleteUserSobrietyData,
  deleteAddiction,
  setActiveAddiction,
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
 * Can return all addictions or just the active one.
 * 
 * Query Parameters:
 * - fid: Farcaster ID of the user (required)
 * - all: If 'true', returns all addictions; otherwise returns only active (optional)
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
    const all = searchParams.get("all") === "true";

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

    if (all) {
      const allData = await getAllUserSobrietyData(fidNumber);
      return NextResponse.json({ data: allData, count: allData.length }, { status: 200 });
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
 * Now supports multiple addictions and setting active addiction.
 * 
 * Request Body:
 * - action: 'save' (default) or 'set_active' (optional)
 * - fid: Farcaster ID (required)
 * - For 'save' action:
 *   - startDate: Sobriety start date YYYY-MM-DD (required)
 *   - addiction: Type of addiction (required)
 *   - startTime: Start time HH:MM (optional)
 *   - customAddiction: Custom addiction name (optional)
 *   - dailyCost: Estimated daily cost (optional, default: 8)
 *   - motivation: User's motivation text (optional)
 *   - pledgeDate: Date of pledge (optional)
 *   - walletAddress: User's wallet address (optional)
 *   - authStrategy: Auth method used (optional)
 *   - id: ID of existing addiction to update (optional)
 * - For 'set_active' action:
 *   - addictionId: ID of addiction to set as active (required)
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
    const { action = 'save', fid } = body;

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    // Handle setting active addiction
    if (action === 'set_active') {
      const { addictionId } = body;
      if (!addictionId) {
        return NextResponse.json(
          { error: "Addiction ID is required for set_active action" },
          { status: 400 }
        );
      }

      const result = await setActiveAddiction(parseInt(fid, 10), addictionId);
      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to set active addiction" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Active addiction updated successfully" },
        { status: 200 }
      );
    }

    // Handle saving addiction data (default action)
    const {
      startDate,
      startTime,
      addiction,
      customAddiction,
      dailyCost,
      motivation,
      pledgeDate,
      walletAddress,
      authStrategy,
      id,
      isActive,
    } = body;

    if (!startDate || !addiction) {
      return NextResponse.json(
        { error: "Start date and addiction are required" },
        { status: 400 }
      );
    }

    const result = await saveUserSobrietyData({
      id: id || undefined,
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
      isActive: isActive !== undefined ? isActive : true,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to save data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Data saved successfully", id: result.id },
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
 * Deletes all or specific sobriety tracking data for a user.
 * Used when user wants to reset their journey or delete their account.
 * 
 * Query Parameters:
 * - fid: Farcaster ID of the user (required)
 * - addictionId: ID of specific addiction to delete (optional, if omitted deletes all)
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
    const addictionId = searchParams.get("addictionId");

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

    // Delete specific addiction if ID provided
    if (addictionId) {
      const result = await deleteAddiction(fidNumber, addictionId);
      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to delete addiction" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { success: true, message: "Addiction deleted successfully" },
        { status: 200 }
      );
    }

    // Delete all user data
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
