import { useLocalStorage } from "@mantine/hooks";
import { type ClientOptions, type XmtpEnv } from "@xmtp/browser-sdk";
import type { Hex } from "viem";
import type { ConnectorString } from "@/hooks/useConnectWallet";

export const useSettings = () => {
  const [environment, setEnvironment] = useLocalStorage<XmtpEnv>({
    key: "XMTP_NETWORK",
    defaultValue: "dev",
    getInitialValueInEffect: false,
  });
  const [ephemeralAccountKey, setEphemeralAccountKey] =
    useLocalStorage<Hex | null>({
      key: "XMTP_EPHEMERAL_ACCOUNT_KEY",
      defaultValue: null,
      getInitialValueInEffect: false,
    });
  const [encryptionKey, setEncryptionKey] = useLocalStorage({
    key: "XMTP_ENCRYPTION_KEY",
    defaultValue: "",
    getInitialValueInEffect: false,
  });
  const [ephemeralAccountEnabled, setEphemeralAccountEnabled] = useLocalStorage(
    {
      key: "XMTP_USE_EPHEMERAL_ACCOUNT",
      defaultValue: false,
      getInitialValueInEffect: false,
    },
  );
  const [loggingLevel, setLoggingLevel] = useLocalStorage<
    ClientOptions["loggingLevel"]
  >({
    key: "XMTP_LOGGING_LEVEL",
    defaultValue: "warn",
    getInitialValueInEffect: false,
  });
  const [forceSCW, setForceSCW] = useLocalStorage<boolean>({
    key: "XMTP_FORCE_SCW",
    defaultValue: false,
    getInitialValueInEffect: false,
  });
  const [useSCW, setUseSCW] = useLocalStorage<boolean>({
    key: "XMTP_USE_SCW",
    defaultValue: false,
    getInitialValueInEffect: false,
  });
  const [blockchain, setBlockchain] = useLocalStorage<number>({
    key: "XMTP_BLOCKCHAIN",
    defaultValue: 1370, // Ramestta chain ID
    getInitialValueInEffect: false,
  });
  const [connector, setConnector] = useLocalStorage<ConnectorString>({
    key: "XMTP_CONNECTOR",
    defaultValue: "Injected",
    getInitialValueInEffect: false,
  });
  const [autoConnect, setAutoConnect] = useLocalStorage<boolean>({
    key: "XMTP_AUTO_CONNECT",
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  // Track which wallet addresses have been registered with XMTP
  // This prevents creating new installations on reconnect
  const [registeredWallets, setRegisteredWallets] = useLocalStorage<string[]>({
    key: "XMTP_REGISTERED_WALLETS",
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  // Helper to check if a wallet is registered
  const isWalletRegistered = (address: string | undefined) => {
    if (!address) return false;
    return registeredWallets.includes(address.toLowerCase());
  };

  // Helper to mark a wallet as registered
  const markWalletAsRegistered = (address: string | undefined) => {
    if (!address) return;
    const lowerAddress = address.toLowerCase();
    if (!registeredWallets.includes(lowerAddress)) {
      setRegisteredWallets([...registeredWallets, lowerAddress]);
    }
  };

  // Helper to unmark a wallet as registered (for when user wants to fully disconnect)
  const unmarkWalletAsRegistered = (address: string | undefined) => {
    if (!address) return;
    const lowerAddress = address.toLowerCase();
    setRegisteredWallets(registeredWallets.filter((w) => w !== lowerAddress));
  };

  return {
    autoConnect,
    blockchain,
    connector,
    encryptionKey,
    environment,
    ephemeralAccountEnabled,
    ephemeralAccountKey,
    forceSCW,
    loggingLevel,
    registeredWallets,
    useSCW,
    isWalletRegistered,
    markWalletAsRegistered,
    unmarkWalletAsRegistered,
    setAutoConnect,
    setBlockchain,
    setConnector,
    setEncryptionKey,
    setEnvironment,
    setEphemeralAccountEnabled,
    setEphemeralAccountKey,
    setForceSCW,
    setLoggingLevel,
    setRegisteredWallets,
    setUseSCW,
  };
};
