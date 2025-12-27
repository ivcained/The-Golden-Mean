/**
 * Home Page Component
 * 
 * This is the landing page for the Dhab recovery application.
 * It generates metadata for Farcaster Frame/MiniApp integration
 * and renders the main App component.
 * 
 * Features:
 * - Farcaster Frame/MiniApp configuration
 * - Open Graph metadata for social sharing
 * - Automatic revalidation every 5 minutes
 */

import { Metadata } from "next";
import App from "./app";
import { METADATA } from "~/lib/utils";

/**
 * Farcaster Frame configuration
 * 
 * Defines how the app appears and launches within Farcaster
 */
const frame = {
  version: "next",
  imageUrl: METADATA.bannerImageUrl,
  button: {
    title: "Open",
    action: {
      type: "launch_frame",
      name: METADATA.name,
      url: METADATA.homeUrl,
      splashImageUrl: METADATA.iconImageUrl,
      splashBackgroundColor: METADATA.splashBackgroundColor
    }
  }
};

/**
 * Revalidation interval in seconds
 * Page will be regenerated every 5 minutes for ISR
 */
export const revalidate = 300;

/**
 * Generate page metadata
 * 
 * Creates metadata including Farcaster Frame configuration
 * for proper rendering within the Farcaster ecosystem.
 * 
 * @returns Metadata object with Frame configuration
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: METADATA.name,
    openGraph: {
      title: METADATA.name,
      description: METADATA.description,
      images: [METADATA.bannerImageUrl],
      url: METADATA.homeUrl,
      siteName: METADATA.name
    },
    other: {
      "fc:frame": JSON.stringify(frame),
      "fc:miniapp": JSON.stringify(frame),
    }
  };
}

/**
 * Home Page
 * 
 * Root page of the application that renders the main App component.
 * 
 * @returns App component
 */
export default function Home() {
  
  return (<App />);
}
