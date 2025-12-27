/**
 * Wallet Address Utilities
 * 
 * This module provides utility functions for formatting and displaying
 * blockchain wallet addresses in a user-friendly format.
 */

/**
 * Truncates a wallet address for display purposes
 * 
 * Formats a long blockchain address by showing the first 14 and last 12 characters,
 * with ellipsis in between. This makes addresses more readable in the UI while
 * still maintaining identifiability.
 * 
 * @param address - The full wallet address to truncate
 * @returns Truncated address string in format "0x1234567890...567890abcdef"
 *          or empty string if address is falsy
 * 
 * @example
 * ```ts
 * truncateAddress("0x1234567890abcdef1234567890abcdef12345678")
 * // Returns: "0x1234567890ab...ef12345678"
 * ```
 */
export const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 14)}...${address.slice(-12)}`;
};
