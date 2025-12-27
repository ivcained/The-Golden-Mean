/**
 * Utility Functions and Application Metadata
 * 
 * This module provides utility functions for styling and application metadata
 * used throughout the Dhab recovery application.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Application metadata configuration
 * 
 * Contains all the metadata used for:
 * - Farcaster MiniApp configuration
 * - Open Graph meta tags
 * - Application branding
 */
export const METADATA = {
  /** Application display name */
  name: "Dhab",
  /** Short description for meta tags and sharing */
  description: "A Decentralized Anonymous Recovery App",
  /** Banner image URL for social media sharing */
  bannerImageUrl: "https://i.imgur.com/2bsV8mV.png",
  /** App icon URL */
  iconImageUrl: "https://i.imgur.com/brcnijg.png",
  /** Application home URL, defaults to production URL if not set */
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://dhab-weld.vercel.app/",
  /** Background color for splash screen */
  splashBackgroundColor: "#FFFFFF",
};

/**
 * Combines and merges Tailwind CSS classes
 * 
 * This utility function combines multiple class names and merges conflicting
 * Tailwind CSS classes intelligently, ensuring the last class takes precedence.
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged class name string
 * 
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4"
 * cn("text-red-500", condition && "text-blue-500") // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
