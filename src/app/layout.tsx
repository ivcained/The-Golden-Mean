/**
 * Root Layout Component
 * 
 * This is the root layout for the entire Next.js application.
 * It provides:
 * - HTML document structure
 * - Global CSS imports
 * - Application metadata for SEO and social sharing
 * - Provider wrappers for all pages
 */

import type { Metadata } from "next";


import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { METADATA } from "~/lib/utils";

/**
 * Page metadata for SEO and social sharing
 * 
 * Includes Open Graph tags for rich previews on social media platforms
 */
export const metadata: Metadata = {
  title: METADATA.name,
    openGraph: {
      title: METADATA.name,
      description: METADATA.description,
      images: [METADATA.bannerImageUrl],
      url: METADATA.homeUrl,
      siteName: METADATA.name
    },
};

/**
 * Root Layout
 * 
 * Wraps all pages with the necessary HTML structure and providers.
 * This layout is shared across all routes in the application.
 * 
 * @param children - Page content to render
 * @returns Complete HTML document with providers
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
