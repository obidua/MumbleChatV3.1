import { useCallback, useMemo } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";

export type ConnectorString =
  | "Injected"
  | "Coinbase Wallet"
  | "MetaMask"
  | "WalletConnect"
  | string; // Allow dynamic wallet names from EIP-6963

export interface DetectedWallet {
  id: string;
  name: string;
  icon?: string;
  type: "injected" | "sdk" | "walletConnect";
}

export const useConnectWallet = () => {
  const account = useAccount();
  const { connect, isPending: connectLoading } = useConnect();
  const connectors = useConnectors();
  const { disconnect, isPending: disconnectLoading } = useDisconnect();

  // Detect all available wallets from EIP-6963 and configured connectors
  const detectedWallets = useMemo<DetectedWallet[]>(() => {
    const wallets: DetectedWallet[] = [];
    const seenNames = new Set<string>();

    connectors.forEach((connector) => {
      // Skip duplicates
      if (seenNames.has(connector.name.toLowerCase())) {
        return;
      }
      seenNames.add(connector.name.toLowerCase());

      // Determine type based on connector
      let type: DetectedWallet["type"] = "injected";
      if (connector.name === "WalletConnect") {
        type = "walletConnect";
      } else if (
        connector.name === "Coinbase Wallet" ||
        connector.name === "MetaMask"
      ) {
        type = "sdk";
      }

      wallets.push({
        id: connector.id,
        name: connector.name,
        icon: connector.icon,
        type,
      });
    });

    return wallets;
  }, [connectors]);

  // Get only injected wallets (browser extensions)
  const injectedWallets = useMemo(
    () =>
      detectedWallets.filter(
        (w) =>
          w.type === "injected" &&
          w.name !== "Coinbase Wallet" &&
          w.name !== "MetaMask" &&
          w.name !== "WalletConnect",
      ),
    [detectedWallets],
  );

  const connectWallet = useCallback(
    (connectorName: ConnectorString) => () => {
      const connector = connectors.find((c) => c.name === connectorName);
      if (!connector) {
        throw new Error(`Connector ${connectorName} not found`);
      }
      connect({ connector });
    },
    [connectors, connect],
  );

  const connectById = useCallback(
    (connectorId: string) => {
      const connector = connectors.find((c) => c.id === connectorId);
      if (!connector) {
        throw new Error(`Connector with id ${connectorId} not found`);
      }
      connect({ connector });
    },
    [connectors, connect],
  );

  return {
    account,
    connect: connectWallet,
    connectById,
    disconnect,
    isConnected: !!account.address,
    loading: connectLoading || disconnectLoading,
    address: account.address,
    chainId: account.chainId,
    detectedWallets,
    injectedWallets,
    connectors,
  };
};
