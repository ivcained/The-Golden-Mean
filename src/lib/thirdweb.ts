/**
 * Thirdweb Client Configuration
 * 
 * This module initializes and exports the Thirdweb client used for Web3 authentication
 * and wallet interactions throughout the application.
 */

import { createThirdwebClient } from "thirdweb";

/**
 * Thirdweb client instance for Web3 interactions
 * 
 * Creates a Thirdweb client with the client ID from environment variables.
 * The client is used for:
 * - In-app wallet authentication (Farcaster, Google, Email)
 * - Blockchain interactions
 * - User account management
 * 
 * @see https://thirdweb.com/dashboard to obtain your client ID
 */
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id",
});
