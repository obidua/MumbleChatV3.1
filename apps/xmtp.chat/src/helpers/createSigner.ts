import type { Signer } from "@xmtp/browser-sdk";
import { isHex, toBytes, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/**
 * Normalizes a signature to ensure it's in the correct format for XMTP
 * Some wallets may return signatures with or without 0x prefix, or in different formats
 * XMTP expects v to be 27 or 28 (not 0 or 1)
 */
const normalizeSignature = (signature: string): Uint8Array => {
  // Ensure signature has 0x prefix
  let normalizedSig = signature;
  if (!normalizedSig.startsWith("0x")) {
    normalizedSig = `0x${normalizedSig}`;
  }

  // Validate it's a valid hex string
  if (!isHex(normalizedSig)) {
    console.error("Invalid signature format received:", signature);
    throw new Error("Invalid signature format from wallet");
  }

  const bytes = toBytes(normalizedSig);

  // Standard ECDSA signature should be 65 bytes (r: 32, s: 32, v: 1)
  if (bytes.length !== 65) {
    console.warn(
      `Unexpected signature length: ${bytes.length} bytes (expected 65)`,
    );
    return bytes;
  }

  // Normalize the v value (recovery id)
  // Some wallets return v as 0 or 1, but XMTP expects 27 or 28
  const v = bytes[64];
  if (v === 0 || v === 1) {
    console.log(`Normalizing signature v value from ${v} to ${v + 27}`);
    bytes[64] = v + 27;
  } else if (v !== 27 && v !== 28) {
    // Some wallets might return v as 27+chainId*2+35 (EIP-155)
    // Try to extract the recovery bit
    const recoveryBit = (v - 35) % 2;
    if (recoveryBit === 0 || recoveryBit === 1) {
      console.log(
        `Normalizing EIP-155 signature v value from ${v} to ${27 + recoveryBit}`,
      );
      bytes[64] = 27 + recoveryBit;
    } else {
      console.warn(`Unusual v value in signature: ${v}`);
    }
  }

  return bytes;
};

export const createEphemeralSigner = (privateKey: Hex): Signer => {
  const account = privateKeyToAccount(privateKey);
  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: account.address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      const signature = await account.signMessage({
        message,
      });
      return toBytes(signature);
    },
  };
};

export const createEOASigner = (
  address: `0x${string}`,
  signMessage: (message: string) => Promise<string> | string,
): Signer => {
  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      console.log("EOA Signer: Requesting signature for message...");
      try {
        const signature = await signMessage(message);
        console.log("EOA Signer: Received signature, normalizing...");
        return normalizeSignature(signature);
      } catch (error) {
        console.error("EOA Signer: Failed to sign message:", error);
        throw error;
      }
    },
  };
};

export const createSCWSigner = (
  address: `0x${string}`,
  signMessage: (message: string) => Promise<string> | string,
  chainId: number = 1,
): Signer => {
  console.log("Creating SCW signer with chain ID:", chainId);
  return {
    type: "SCW",
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      console.log("SCW Signer: Requesting signature for message...");
      try {
        const signature = await signMessage(message);
        console.log("SCW Signer: Received signature, normalizing...");
        return normalizeSignature(signature);
      } catch (error) {
        console.error("SCW Signer: Failed to sign message:", error);
        throw error;
      }
    },
    getChainId: () => BigInt(chainId),
  };
};
