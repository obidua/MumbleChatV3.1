import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { hexToUint8Array } from "uint8array-extras";
import { useAccount, useSignMessage } from "wagmi";
import { useXMTP } from "@/contexts/XMTPContext";
import { createEOASigner, createSCWSigner } from "@/helpers/createSigner";
import { useEphemeralSigner } from "@/hooks/useEphemeralSigner";
import { useSettings } from "@/hooks/useSettings";

export const useConnectXmtp = () => {
  const navigate = useNavigate();
  const { signer: ephemeralSigner, address: ephemeralAddress } =
    useEphemeralSigner();
  const { initializing, client, initialize } = useXMTP();
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();
  const {
    encryptionKey,
    environment,
    ephemeralAccountEnabled,
    ephemeralAccountKey,
    setEphemeralAccountKey,
    loggingLevel,
    useSCW,
    autoConnect,
    setAutoConnect,
    isWalletRegistered,
    markWalletAsRegistered,
  } = useSettings();

  const connect = useCallback(() => {
    // if client is already connected, return
    if (client) {
      return;
    }

    // connect ephemeral account if enabled
    if (ephemeralAccountEnabled) {
      // Check if ephemeral wallet is already registered
      const isRegistered = isWalletRegistered(ephemeralAddress);

      void initialize({
        dbEncryptionKey: encryptionKey
          ? hexToUint8Array(encryptionKey)
          : undefined,
        env: environment,
        loggingLevel,
        signer: ephemeralSigner,
        disableAutoRegister: isRegistered,
      }).then(() => {
        // Mark ephemeral wallet as registered after successful connection
        if (ephemeralAddress) {
          markWalletAsRegistered(ephemeralAddress);
        }
      });
      setAutoConnect(true);
      return;
    }

    // if wallet is not connected or SCW is enabled but chain is not set, return
    if (!account.address || (useSCW && !account.chainId)) {
      return;
    }

    // Check if this wallet is already registered with XMTP
    const isRegistered = isWalletRegistered(account.address);

    console.log("XMTP: Wallet registration status:", {
      address: account.address,
      isRegistered,
    });

    // For Ramestta chain (1370) and other custom chains, always use EOA signer
    // SCW (Smart Contract Wallet) mode is only supported on certain chains by XMTP
    const isCustomChain = account.chainId === 1370; // Ramestta
    const shouldUseSCW = useSCW && !isCustomChain;

    console.log("Connecting to XMTP with:", {
      address: account.address,
      chainId: account.chainId,
      useSCW: shouldUseSCW,
      isCustomChain,
      disableAutoRegister: isRegistered,
    });

    void initialize({
      dbEncryptionKey: encryptionKey
        ? hexToUint8Array(encryptionKey)
        : undefined,
      env: environment,
      loggingLevel,
      signer: shouldUseSCW
        ? createSCWSigner(
            account.address,
            (message: string) => signMessageAsync({ message }),
            account.chainId,
          )
        : createEOASigner(account.address, (message: string) =>
            signMessageAsync({ message }),
          ),
      // Disable auto-registration if wallet is already registered
      // This prevents creating new installations on every reconnect
      disableAutoRegister: isRegistered,
    }).then(() => {
      // Mark wallet as registered after successful connection
      markWalletAsRegistered(account.address);
    });
    setAutoConnect(true);
  }, [
    client,
    initialize,
    setEphemeralAccountKey,
    ephemeralAccountEnabled,
    ephemeralAccountKey,
    ephemeralAddress,
    ephemeralSigner,
    encryptionKey,
    environment,
    loggingLevel,
    useSCW,
    account.address,
    account.chainId,
    signMessageAsync,
    setAutoConnect,
    isWalletRegistered,
    markWalletAsRegistered,
  ]);

  useEffect(() => {
    if (client) {
      void navigate("/conversations");
    } else if (autoConnect) {
      connect();
    }
  }, [client, navigate, autoConnect, connect]);

  return {
    client,
    loading: initializing,
    connect,
  };
};
