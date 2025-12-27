/**
 * Database Operations and Models
 * 
 * This module provides all database operations for the Dhab recovery application,
 * including user sobriety tracking and community features. It uses Vercel Postgres
 * for data persistence.
 * 
 * Main features:
 * - User sobriety data management (CRUD operations)
 * - Community posts, comments, and reactions
 * - Content flagging and moderation
 * - Anonymous user interaction tracking
 */

import { sql } from "@vercel/postgres";

/**
 * User sobriety tracking data model
 * 
 * Stores all information related to a user's recovery journey,
 * including start date, addiction type, progress tracking, and authentication details.
 */
export interface UserSobrietyData {
  /** Farcaster ID - unique identifier for the user */
  fid: number;
  /** Date when sobriety journey started (YYYY-MM-DD format) */
  startDate: string;
  /** Time when sobriety started (HH:MM format, optional) */
  startTime: string;
  /** Type of addiction being tracked */
  addiction: string;
  /** Custom addiction name if not in predefined list */
  customAddiction?: string;
  /** Estimated daily cost of the addiction in USD */
  dailyCost: number;
  /** Personal motivation or reason for recovery */
  motivation?: string;
  /** Date when user made their sobriety pledge */
  pledgeDate?: string;
  /** User's wallet address for Web3 features */
  walletAddress?: string;
  /** Authentication method used (farcaster, google, email) */
  authStrategy?: string;
  /** Timestamp when record was created */
  createdAt?: Date;
  /** Timestamp when record was last updated */
  updatedAt?: Date;
}

/**
 * Community post data model
 * 
 * Represents a post made by a user in the community support forum.
 */
export interface CommunityPost {
  /** Unique post identifier */
  id: string;
  /** Anonymous identifier of the post author */
  anonymousId: string;
  /** Addiction category this post relates to */
  addiction: string;
  /** Text content of the post */
  content: string;
  /** Optional milestone badge (e.g., "30 days sober") */
  milestone?: string;
  /** Unix timestamp when post was created */
  timestamp: number;
  /** JSON string containing reaction data */
  reactions: string;
  /** Number of times post has been flagged */
  flagCount: number;
  /** Timestamp when record was created */
  createdAt?: Date;
}

/**
 * Community comment data model
 * 
 * Represents a comment on a community post.
 */
export interface CommunityComment {
  /** Unique comment identifier */
  id: string;
  /** ID of the post this comment belongs to */
  postId: string;
  /** Anonymous identifier of the comment author */
  anonymousId: string;
  /** Text content of the comment */
  content: string;
  /** Unix timestamp when comment was created */
  timestamp: number;
  /** Number of times comment has been flagged */
  flagCount: number;
  /** Timestamp when record was created */
  createdAt?: Date;
}

/**
 * Community reaction data model
 * 
 * Represents an emoji reaction on a community post.
 */
export interface CommunityReaction {
  /** Unique reaction identifier */
  id: string;
  /** ID of the post this reaction belongs to */
  postId: string;
  /** Anonymous identifier of the user who reacted */
  anonymousId: string;
  /** Emoji character used for the reaction */
  emoji: string;
  /** Timestamp when reaction was created */
  createdAt?: Date;
}

// ============================================
// User Sobriety Database Functions
// ============================================

/**
 * Initializes the user sobriety database table
 * 
 * Creates the user_sobriety table if it doesn't exist.
 * This function is idempotent and safe to call multiple times.
 * 
 * @returns Promise with success status and optional error
 */
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_sobriety (
        fid INTEGER PRIMARY KEY,
        start_date VARCHAR(10) NOT NULL,
        start_time VARCHAR(5),
        addiction VARCHAR(255) NOT NULL,
        custom_addiction VARCHAR(255),
        daily_cost DECIMAL(10, 2) DEFAULT 8.00,
        motivation TEXT,
        pledge_date VARCHAR(10),
        wallet_address VARCHAR(42),
        auth_strategy VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return { success: false, error };
  }
}

/**
 * Retrieves user sobriety data by Farcaster ID
 * 
 * Fetches all sobriety tracking information for a specific user.
 * 
 * @param fid - Farcaster ID of the user
 * @returns Promise resolving to user data or null if not found
 */
export async function getUserSobrietyData(
  fid: number
): Promise<UserSobrietyData | null> {
  try {
    const result = await sql`
      SELECT
        fid,
        start_date as "startDate",
        start_time as "startTime",
        addiction,
        custom_addiction as "customAddiction",
        daily_cost as "dailyCost",
        motivation,
        pledge_date as "pledgeDate",
        wallet_address as "walletAddress",
        auth_strategy as "authStrategy",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM user_sobriety
      WHERE fid = ${fid}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as UserSobrietyData;
  } catch (error) {
    console.error("Failed to get user sobriety data:", error);
    return null;
  }
}

/**
 * Saves or updates user sobriety data
 * 
 * Inserts new user data or updates existing data if the FID already exists.
 * Uses ON CONFLICT to perform upsert operation. Preserves existing wallet
 * address and auth strategy if not provided in update.
 * 
 * @param data - User sobriety data to save
 * @returns Promise with success status and optional error
 */
export async function saveUserSobrietyData(
  data: UserSobrietyData
): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`
      INSERT INTO user_sobriety (
        fid, start_date, start_time, addiction, custom_addiction,
        daily_cost, motivation, pledge_date, wallet_address, auth_strategy, updated_at
      ) VALUES (
        ${data.fid},
        ${data.startDate},
        ${data.startTime || null},
        ${data.addiction},
        ${data.customAddiction || null},
        ${data.dailyCost || 8},
        ${data.motivation || null},
        ${data.pledgeDate || null},
        ${data.walletAddress || null},
        ${data.authStrategy || null},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (fid)
      DO UPDATE SET
        start_date = ${data.startDate},
        start_time = ${data.startTime || null},
        addiction = ${data.addiction},
        custom_addiction = ${data.customAddiction || null},
        daily_cost = ${data.dailyCost || 8},
        motivation = ${data.motivation || null},
        pledge_date = ${data.pledgeDate || null},
        wallet_address = COALESCE(${
          data.walletAddress || null
        }, user_sobriety.wallet_address),
        auth_strategy = COALESCE(${
          data.authStrategy || null
        }, user_sobriety.auth_strategy),
        updated_at = CURRENT_TIMESTAMP
    `;

    return { success: true };
  } catch (error) {
    console.error("Failed to save user sobriety data:", error);
    return { success: false, error };
  }
}

/**
 * Deletes user sobriety data
 * 
 * Removes all sobriety tracking data for a user. This is typically
 * used when a user wants to reset their journey or delete their account.
 * 
 * @param fid - Farcaster ID of the user
 * @returns Promise with success status and optional error
 */
export async function deleteUserSobrietyData(
  fid: number
): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`DELETE FROM user_sobriety WHERE fid = ${fid}`;
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user sobriety data:", error);
    return { success: false, error };
  }
}

/**
 * Updates only the pledge date and motivation
 * 
 * Used when a user makes or updates their sobriety pledge.
 * Updates only these specific fields without affecting other data.
 * 
 * @param fid - Farcaster ID of the user
 * @param pledgeDate - Date of the pledge (YYYY-MM-DD format)
 * @param motivation - Optional motivation text
 * @returns Promise with success status and optional error
 */
export async function updatePledgeDate(
  fid: number,
  pledgeDate: string,
  motivation?: string
): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`
      UPDATE user_sobriety 
      SET pledge_date = ${pledgeDate}, 
          motivation = ${motivation || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE fid = ${fid}
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to update pledge date:", error);
    return { success: false, error };
  }
}

/**
 * Updates the daily cost estimate
 * 
 * Allows users to update their estimated daily cost of their addiction,
 * which is used to calculate money saved during recovery.
 * 
 * @param fid - Farcaster ID of the user
 * @param dailyCost - New daily cost in USD
 * @returns Promise with success status and optional error
 */
export async function updateDailyCost(
  fid: number,
  dailyCost: number
): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`
      UPDATE user_sobriety 
      SET daily_cost = ${dailyCost},
          updated_at = CURRENT_TIMESTAMP
      WHERE fid = ${fid}
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to update daily cost:", error);
    return { success: false, error };
  }
}

// ============================================
// Community Posts Database Functions
// ============================================

/**
 * Initializes all community-related database tables
 * 
 * Creates tables for posts, comments, reactions, and flags if they don't exist.
 * Sets up foreign key relationships and constraints for data integrity.
 * This function is idempotent and safe to call multiple times.
 * 
 * Tables created:
 * - community_posts: User posts with content and metadata
 * - community_comments: Comments on posts
 * - community_reactions: Emoji reactions on posts
 * - community_flags: Content moderation flags
 * 
 * @returns Promise with success status and optional error
 */
export async function initializeCommunityTables() {
  try {
    // Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(50) PRIMARY KEY,
        anonymous_id VARCHAR(100) NOT NULL,
        addiction VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        milestone VARCHAR(100),
        timestamp BIGINT NOT NULL,
        flag_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS community_comments (
        id VARCHAR(50) PRIMARY KEY,
        post_id VARCHAR(50) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        anonymous_id VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        flag_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Reactions table
    await sql`
      CREATE TABLE IF NOT EXISTS community_reactions (
        id VARCHAR(100) PRIMARY KEY,
        post_id VARCHAR(50) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        anonymous_id VARCHAR(100) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, anonymous_id, emoji)
      )
    `;

    // Flags table (to track who flagged what)
    await sql`
      CREATE TABLE IF NOT EXISTS community_flags (
        id VARCHAR(100) PRIMARY KEY,
        target_type VARCHAR(10) NOT NULL,
        target_id VARCHAR(50) NOT NULL,
        anonymous_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(target_type, target_id, anonymous_id)
      )
    `;

    return { success: true };
  } catch (error) {
    console.error("Failed to initialize community tables:", error);
    return { success: false, error };
  }
}

/**
 * Creates a new community post
 * 
 * Inserts a new post into the community feed. Posts are associated with
 * an addiction category and authored by an anonymous user.
 * 
 * @param post - Post data including id, anonymousId, addiction, content, etc.
 * @returns Promise with success status and optional error
 */
export async function createCommunityPost(post: {
  id: string;
  anonymousId: string;
  addiction: string;
  content: string;
  milestone?: string;
  timestamp: number;
}): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`
      INSERT INTO community_posts (id, anonymous_id, addiction, content, milestone, timestamp)
      VALUES (${post.id}, ${post.anonymousId}, ${post.addiction}, ${
      post.content
    }, ${post.milestone || null}, ${post.timestamp})
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to create community post:", error);
    return { success: false, error };
  }
}

/**
 * Retrieves community posts for a specific addiction
 * 
 * Fetches the most recent posts related to a specific addiction type,
 * limited to 100 posts, ordered by newest first.
 * 
 * @param addiction - The addiction category to filter by
 * @returns Promise resolving to array of community posts
 */
export async function getCommunityPosts(
  addiction: string
): Promise<CommunityPost[]> {
  try {
    const result = await sql`
      SELECT
        id,
        anonymous_id as "anonymousId",
        addiction,
        content,
        milestone,
        timestamp,
        flag_count as "flagCount",
        created_at as "createdAt"
      FROM community_posts
      WHERE addiction = ${addiction}
      ORDER BY timestamp DESC
      LIMIT 100
    `;
    return result.rows as CommunityPost[];
  } catch (error) {
    console.error("Failed to get community posts:", error);
    return [];
  }
}

/**
 * Retrieves all comments for a specific post
 * 
 * Fetches comments ordered chronologically (oldest first) to maintain
 * conversation flow.
 * 
 * @param postId - The post ID to get comments for
 * @returns Promise resolving to array of comments
 */
export async function getPostComments(
  postId: string
): Promise<CommunityComment[]> {
  try {
    const result = await sql`
      SELECT
        id,
        post_id as "postId",
        anonymous_id as "anonymousId",
        content,
        timestamp,
        flag_count as "flagCount",
        created_at as "createdAt"
      FROM community_comments
      WHERE post_id = ${postId}
      ORDER BY timestamp ASC
    `;
    return result.rows as CommunityComment[];
  } catch (error) {
    console.error("Failed to get post comments:", error);
    return [];
  }
}

/**
 * Adds a comment to a post
 * 
 * Inserts a new comment on a community post. Comments are anonymous
 * and associated with the post via postId.
 * 
 * @param comment - Comment data including id, postId, anonymousId, content, etc.
 * @returns Promise with success status and optional error
 */
export async function addPostComment(comment: {
  id: string;
  postId: string;
  anonymousId: string;
  content: string;
  timestamp: number;
}): Promise<{ success: boolean; error?: unknown }> {
  try {
    await sql`
      INSERT INTO community_comments (id, post_id, anonymous_id, content, timestamp)
      VALUES (${comment.id}, ${comment.postId}, ${comment.anonymousId}, ${comment.content}, ${comment.timestamp})
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false, error };
  }
}

/**
 * Retrieves all reactions for a post
 * 
 * Aggregates reactions by emoji type, counting how many users reacted
 * with each emoji and listing their anonymous IDs.
 * 
 * @param postId - The post ID to get reactions for
 * @returns Promise resolving to array of reaction summaries with counts
 */
export async function getPostReactions(
  postId: string
): Promise<{ emoji: string; count: number; users: string[] }[]> {
  try {
    const result = await sql`
      SELECT emoji, COUNT(*) as count, ARRAY_AGG(anonymous_id) as users
      FROM community_reactions
      WHERE post_id = ${postId}
      GROUP BY emoji
    `;
    return result.rows.map((row) => ({
      emoji: row.emoji,
      count: Number(row.count),
      users: row.users as string[],
    }));
  } catch (error) {
    console.error("Failed to get post reactions:", error);
    return [];
  }
}

/**
 * Toggles a reaction on a post
 * 
 * Adds a reaction if it doesn't exist, or removes it if it does.
 * Ensures users can only react once with each emoji type.
 * 
 * @param postId - The post ID to react to
 * @param anonymousId - Anonymous identifier of the reacting user
 * @param emoji - Emoji character to react with
 * @returns Promise with success status and whether reaction was added (true) or removed (false)
 */
export async function togglePostReaction(
  postId: string,
  anonymousId: string,
  emoji: string
): Promise<{ success: boolean; added: boolean; error?: unknown }> {
  try {
    const reactionId = `${postId}-${anonymousId}-${emoji}`;

    // Check if reaction exists
    const existing = await sql`
      SELECT id FROM community_reactions WHERE id = ${reactionId}
    `;

    if (existing.rows.length > 0) {
      // Remove reaction
      await sql`DELETE FROM community_reactions WHERE id = ${reactionId}`;
      return { success: true, added: false };
    } else {
      // Add reaction
      await sql`
        INSERT INTO community_reactions (id, post_id, anonymous_id, emoji)
        VALUES (${reactionId}, ${postId}, ${anonymousId}, ${emoji})
      `;
      return { success: true, added: true };
    }
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
    return { success: false, added: false, error };
  }
}

/**
 * Flags content for moderation
 * 
 * Records a flag from a user on either a post or comment. Users can only
 * flag each piece of content once. Increments the flag count on the content.
 * Content with FLAG_THRESHOLD or more flags should be hidden.
 * 
 * @param targetType - Type of content being flagged ("post" or "comment")
 * @param targetId - ID of the content being flagged
 * @param anonymousId - Anonymous identifier of the flagging user
 * @returns Promise with success status and whether content was already flagged
 */
export async function flagContent(
  targetType: "post" | "comment",
  targetId: string,
  anonymousId: string
): Promise<{ success: boolean; alreadyFlagged: boolean; error?: unknown }> {
  try {
    const flagId = `${targetType}-${targetId}-${anonymousId}`;

    // Check if already flagged
    const existing = await sql`
      SELECT id FROM community_flags WHERE id = ${flagId}
    `;

    if (existing.rows.length > 0) {
      return { success: true, alreadyFlagged: true };
    }

    // Add flag
    await sql`
      INSERT INTO community_flags (id, target_type, target_id, anonymous_id)
      VALUES (${flagId}, ${targetType}, ${targetId}, ${anonymousId})
    `;

    // Update flag count
    if (targetType === "post") {
      await sql`
        UPDATE community_posts SET flag_count = flag_count + 1 WHERE id = ${targetId}
      `;
    } else {
      await sql`
        UPDATE community_comments SET flag_count = flag_count + 1 WHERE id = ${targetId}
      `;
    }

    return { success: true, alreadyFlagged: false };
  } catch (error) {
    console.error("Failed to flag content:", error);
    return { success: false, alreadyFlagged: false, error };
  }
}

/**
 * Checks if a user has flagged specific content
 * 
 * Determines whether a user has already flagged a post or comment,
 * used to prevent duplicate flags and update UI state.
 * 
 * @param targetType - Type of content ("post" or "comment")
 * @param targetId - ID of the content
 * @param anonymousId - Anonymous identifier of the user
 * @returns Promise resolving to true if user has flagged this content
 */
export async function hasUserFlagged(
  targetType: "post" | "comment",
  targetId: string,
  anonymousId: string
): Promise<boolean> {
  try {
    const flagId = `${targetType}-${targetId}-${anonymousId}`;
    const result = await sql`
      SELECT id FROM community_flags WHERE id = ${flagId}
    `;
    return result.rows.length > 0;
  } catch (error) {
    console.error("Failed to check flag status:", error);
    return false;
  }
}
