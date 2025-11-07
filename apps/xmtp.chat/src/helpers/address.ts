/**
 * Shortens an address or ID to a more readable format
 * @param address - Full address/ID string
 * @param startLength - Number of characters to show at start (default: 6)
 * @param endLength - Number of characters to show at end (default: 4)
 * @returns Shortened address in format: 0x874...4543
 */
export const shortenAddress = (
  address: string,
  startLength = 6,
  endLength = 4,
): string => {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Shortens a hex ID (without 0x prefix)
 * @param id - Full ID string
 * @param startLength - Number of characters to show at start (default: 6)
 * @param endLength - Number of characters to show at end (default: 4)
 * @returns Shortened ID in format: 874abc...4543
 */
export const shortenId = (
  id: string,
  startLength = 6,
  endLength = 4,
): string => {
  return shortenAddress(id, startLength, endLength);
};
