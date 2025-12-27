/**
 * Community Features and Utilities
 * 
 * This module provides types, utilities, and sample data for the anonymous
 * community support features of the Dhab recovery application.
 */

/**
 * Represents a reaction (emoji) on a community post
 */
export interface Reaction {
  /** The emoji character used for the reaction */
  emoji: string;
  /** Number of users who added this reaction */
  count: number;
  /** Whether the current user has reacted with this emoji */
  userReacted: boolean;
}

/**
 * Represents a comment on a community post
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** Anonymous identifier of the comment author */
  anonymousId: string;
  /** Text content of the comment */
  content: string;
  /** Unix timestamp when comment was created */
  timestamp: number;
  /** Number of times this comment has been flagged */
  flagCount: number;
  /** Whether the current user has flagged this comment */
  flaggedByUser: boolean;
}

/**
 * Represents a community support post
 */
export interface Post {
  /** Unique identifier for the post */
  id: string;
  /** Anonymous identifier of the post author */
  anonymousId: string;
  /** Text content of the post */
  content: string;
  /** Unix timestamp when post was created */
  timestamp: number;
  /** Optional milestone badge text */
  milestone?: string;
  /** Array of reactions on this post */
  reactions: Reaction[];
  /** Array of comments on this post */
  comments: Comment[];
  /** Number of times this post has been flagged */
  flagCount: number;
  /** Whether the current user has flagged this post */
  flaggedByUser: boolean;
}

/**
 * Threshold for automatic content moderation
 * 
 * Content (posts/comments) with this many flags will be hidden from view
 * to maintain a supportive and safe community environment.
 */
export const FLAG_THRESHOLD = 3;

/**
 * Generates a consistent anonymous identifier from a seed string
 * 
 * Creates a pseudonymous identifier in the format "AdjectiveNounNN" (e.g., "BravePhoenix42")
 * using a simple hash function. The same seed will always produce the same identifier,
 * allowing users to have consistent anonymity across sessions while protecting their identity.
 * 
 * This is used for:
 * - Anonymous community posting
 * - Comment attribution
 * - Maintaining identity consistency
 * 
 * @param seed - Input string to hash (typically includes FID, addiction, and date)
 * @returns Anonymous identifier in format "AdjectiveNounNumber"
 * 
 * @example
 * ```ts
 * generateAnonymousId("fid-12345-Alcohol-2024-01-15")
 * // Returns: "BravePhoenix42" (consistent for this seed)
 * ```
 */
export const generateAnonymousId = (seed: string): string => {
  // Simple hash function to generate consistent pseudorandom values
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash | 0; // Convert to 32-bit integer
  }
  
  // Arrays of positive, recovery-focused words
  const adjectives = [
    "Brave",
    "Strong",
    "Calm",
    "Wise",
    "Kind",
    "Bold",
    "Free",
    "Pure",
    "True",
    "Hope",
  ];
  const nouns = [
    "Phoenix",
    "Eagle",
    "Lion",
    "Star",
    "Wave",
    "Light",
    "Path",
    "Soul",
    "Heart",
    "Mind",
  ];
  
  // Select words based on hash value
  const adj = adjectives[Math.abs(hash) % adjectives.length];
  const noun = nouns[Math.abs(hash >> 8) % nouns.length];
  const num = Math.abs(hash % 100);
  
  return `${adj}${noun}${num}`;
};

/**
 * Formats a Unix timestamp as a relative time string
 * 
 * Converts timestamps to human-readable relative time
 * (e.g., "2 days ago", "5 hours ago", "Just now")
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time string
 * 
 * @example
 * ```ts
 * formatTimeAgo(Date.now() - 7200000) // "2 hours ago"
 * formatTimeAgo(Date.now() - 30000)   // "Just now"
 * ```
 */
export const formatTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

/**
 * Returns the default set of reaction emojis
 * 
 * Provides the standard emoji reactions available on community posts,
 * all initialized with zero counts and not reacted by user.
 * 
 * @returns Array of default Reaction objects
 */
export const getDefaultReactions = (): Reaction[] => [
  { emoji: "👍", count: 0, userReacted: false },
  { emoji: "❤️", count: 0, userReacted: false },
  { emoji: "👏", count: 0, userReacted: false },
  { emoji: "💪", count: 0, userReacted: false },
];

/**
 * Returns sample community posts for demonstration
 * 
 * Provides example posts to show users what the community feed looks like.
 * These are used when no real posts are available or for initial onboarding.
 * 
 * @returns Array of sample Post objects with realistic content and reactions
 */
export const getSamplePosts = (): Post[] => [
  {
    id: "1",
    anonymousId: "SoberCC",
    content:
      "The idea of never drinking again still frightens me, at the same time I never want to drink again. Will just keep at it, one day after the next. I feel free right now! And like I'm on the right path.",
    timestamp: Date.now() - 86400000 * 2,
    reactions: [
      { emoji: "👍", count: 17, userReacted: false },
      { emoji: "😐", count: 1, userReacted: false },
      { emoji: "🎉", count: 8, userReacted: false },
      { emoji: "❤️", count: 22, userReacted: false },
    ],
    comments: [],
    flagCount: 0,
    flaggedByUser: false,
  },
  {
    id: "2",
    anonymousId: "JohnSmith_99",
    content:
      "I've officially made it to 6 months sober. It hasn't been easy, but every morning waking up without a hangover makes it worth it.",
    milestone: "🎉 Milestone Reached!",
    timestamp: Date.now() - 7200000,
    reactions: [
      { emoji: "👏", count: 45, userReacted: false },
      { emoji: "💪", count: 12, userReacted: false },
    ],
    comments: [],
    flagCount: 0,
    flaggedByUser: false,
  },
  {
    id: "3",
    anonymousId: "AliceW",
    content:
      "Just checking in. Had a rough craving today but went for a run instead. Feeling much better now. Stay strong everyone!",
    timestamp: Date.now() - 18000000,
    reactions: [{ emoji: "❤️", count: 8, userReacted: false }],
    comments: [],
    flagCount: 0,
    flaggedByUser: false,
  },
];
