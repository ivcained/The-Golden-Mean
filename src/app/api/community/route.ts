/**
 * Community API Routes
 * 
 * This API provides endpoints for managing community features including
 * posts, comments, reactions, and content moderation.
 * 
 * Endpoints:
 * - GET: Fetch posts, comments, or reactions
 * - POST: Create posts, add comments, toggle reactions, or flag content
 */

import { NextRequest, NextResponse } from "next/server";
import {
  initializeCommunityTables,
  createCommunityPost,
  getCommunityPosts,
  getPostComments,
  addPostComment,
  getPostReactions,
  togglePostReaction,
  flagContent,
  hasUserFlagged,
} from "~/lib/db";

/**
 * Database tables initialization flag
 * Ensures tables are initialized only once per server instance
 */
let tablesInitialized = false;

/**
 * Ensures community tables are initialized before operations
 * 
 * Initializes the community-related database tables on first request.
 * Subsequent calls do nothing (idempotent).
 */
async function ensureTablesExist() {
  if (!tablesInitialized) {
    await initializeCommunityTables();
    tablesInitialized = true;
  }
}

/**
 * GET /api/community - Fetch community data
 * 
 * Retrieves posts, comments, or reactions based on query parameters.
 * 
 * Query Parameters:
 * - addiction: Addiction type to filter posts (required)
 * - postId: Specific post ID (optional, for comments/reactions)
 * - action: "comments" or "reactions" (optional, requires postId)
 * 
 * Behaviors:
 * 1. With addiction only: Returns all posts with their comments and reactions
 * 2. With postId + action=comments: Returns comments for specific post
 * 3. With postId + action=reactions: Returns reactions for specific post
 * 
 * @returns JSON response with posts/comments/reactions or error
 * 
 * Response Codes:
 * - 200: Success
 * - 400: Missing required parameters
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  try {
    await ensureTablesExist();

    const { searchParams } = new URL(request.url);
    const addiction = searchParams.get("addiction");
    const postId = searchParams.get("postId");
    const action = searchParams.get("action");

    if (!addiction) {
      return NextResponse.json(
        { error: "Addiction parameter is required" },
        { status: 400 }
      );
    }

    // Handle specific action requests for a post
    if (postId && action === "comments") {
      const comments = await getPostComments(postId);
      return NextResponse.json({ comments });
    }

    if (postId && action === "reactions") {
      const reactions = await getPostReactions(postId);
      return NextResponse.json({ reactions });
    }

    // Get all posts for addiction with full details
    const posts = await getCommunityPosts(addiction);

    // Enrich each post with its comments and reactions
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const comments = await getPostComments(post.id);
        const reactions = await getPostReactions(post.id);
        return {
          ...post,
          comments,
          reactions,
        };
      })
    );

    return NextResponse.json({ posts: postsWithDetails });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/community - Perform community actions
 * 
 * Handles various community interactions based on the action parameter.
 * 
 * Request Body (all actions):
 * - action: Action type (required)
 * 
 * Action: "create_post"
 * - id: Unique post ID (required)
 * - anonymousId: Anonymous user ID (required)
 * - addiction: Addiction category (required)
 * - content: Post text content (required)
 * - timestamp: Unix timestamp (required)
 * - milestone: Optional milestone badge text
 * 
 * Action: "add_comment"
 * - id: Unique comment ID (required)
 * - postId: Post to comment on (required)
 * - anonymousId: Anonymous user ID (required)
 * - content: Comment text (required)
 * - timestamp: Unix timestamp (required)
 * 
 * Action: "toggle_reaction"
 * - postId: Post to react to (required)
 * - anonymousId: Anonymous user ID (required)
 * - emoji: Emoji character (required)
 * 
 * Action: "flag"
 * - targetType: "post" or "comment" (required)
 * - targetId: ID of content to flag (required)
 * - anonymousId: Anonymous user ID (required)
 * 
 * @returns JSON response with success status or error
 * 
 * Response Codes:
 * - 200: Success
 * - 400: Invalid action or missing required fields
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    await ensureTablesExist();

    const body = await request.json();
    const { action } = body;

    // Create a new post
    if (action === "create_post") {
      const { id, anonymousId, addiction, content, milestone, timestamp } =
        body;

      if (!id || !anonymousId || !addiction || !content || !timestamp) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const result = await createCommunityPost({
        id,
        anonymousId,
        addiction,
        content,
        milestone,
        timestamp,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to create post" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Add a comment
    if (action === "add_comment") {
      const { id, postId, anonymousId, content, timestamp } = body;

      if (!id || !postId || !anonymousId || !content || !timestamp) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const result = await addPostComment({
        id,
        postId,
        anonymousId,
        content,
        timestamp,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to add comment" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Toggle reaction
    if (action === "toggle_reaction") {
      const { postId, anonymousId, emoji } = body;

      if (!postId || !anonymousId || !emoji) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const result = await togglePostReaction(postId, anonymousId, emoji);

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to toggle reaction" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, added: result.added });
    }

    // Flag content
    if (action === "flag") {
      const { targetType, targetId, anonymousId } = body;

      if (!targetType || !targetId || !anonymousId) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Check if already flagged
      const alreadyFlagged = await hasUserFlagged(
        targetType,
        targetId,
        anonymousId
      );

      if (alreadyFlagged) {
        return NextResponse.json({
          success: true,
          alreadyFlagged: true,
        });
      }

      const result = await flagContent(targetType, targetId, anonymousId);

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to flag content" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        alreadyFlagged: false,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in community POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
