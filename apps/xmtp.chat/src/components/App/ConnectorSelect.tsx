import { Box, Grid, Image, Text } from "@mantine/core";
import { AccountCard } from "@/components/App/AccountCard";
import {
  useConnectWallet,
  type ConnectorString,
} from "@/hooks/useConnectWallet";
import { useSettings } from "@/hooks/useSettings";
import { CoinbaseWallet } from "@/icons/CoinbaseWallet";
import { InjectedWallet } from "@/icons/InjectedWallet";
import { MetamaskWallet } from "@/icons/MetamaskWallet";
import { RamaPayWallet } from "@/icons/RamaPayWallet";
import { WalletConnectWallet } from "@/icons/WalletConnectWallet";
import classes from "./ConnectorSelect.module.css";

// Get custom icon for known wallets that may not provide good icons via EIP-6963
const getWalletIcon = (wallet: { name: string; icon?: string }) => {
  const nameLower = wallet.name.toLowerCase();
  
  // RamaPay wallet - use custom high-quality icon
  if (nameLower.includes("ramapay") || nameLower.includes("rama")) {
    return <RamaPayWallet />;
  }
  
  // Use EIP-6963 provided icon if available
  if (wallet.icon) {
    return (
      <Image
        src={wallet.icon}
        alt={wallet.name}
        w={32}
        h={32}
        radius="sm"
        style={{ objectFit: "contain" }}
      />
    );
  }
  
  // Fallback to generic injected icon
  return <InjectedWallet />;
};

export const ConnectorSelect: React.FC = () => {
  const { isConnected, loading, detectedWallets, connectById } =
    useConnectWallet();
  const { connector, setConnector, ephemeralAccountEnabled, useSCW } =
    useSettings();

  const handleWalletConnect = (connectorName: ConnectorString) => () => {
    setConnector(connectorName);
  };

  const handleWalletById = (walletId: string, walletName: string) => () => {
    setConnector(walletName as ConnectorString);
  };

  const isDisabled = isConnected || loading || ephemeralAccountEnabled;

  // Filter wallets: get injected wallets from EIP-6963 discovery
  const injectedWallets = detectedWallets.filter(
    (w) =>
      w.type === "injected" &&
      w.name !== "Injected" &&
      !w.name.toLowerCase().includes("coinbase") &&
      !w.name.toLowerCase().includes("walletconnect"),
  );

  // Check if specific SDK wallets are available
  const hasCoinbase = detectedWallets.some(
    (w) => w.name === "Coinbase Wallet",
  );
  const hasMetaMask = detectedWallets.some((w) => w.name === "MetaMask");
  const hasWalletConnect = detectedWallets.some(
    (w) => w.name === "WalletConnect",
  );

  // Fallback injected if no specific wallets detected
  const hasGenericInjected =
    detectedWallets.some((w) => w.name === "Injected") &&
    injectedWallets.length === 0;

  return (
    <Grid gutter={8} className={classes.root}>
      {/* Show all detected injected wallets from EIP-6963 */}
      {injectedWallets.map((wallet) => (
        <Grid.Col span={{ base: 12, md: 6 }} key={wallet.id}>
          <AccountCard
            selected={connector === wallet.name}
            disabled={isDisabled}
            icon={getWalletIcon(wallet)}
            label={wallet.name}
            onClick={handleWalletById(wallet.id, wallet.name)}
          />
        </Grid.Col>
      ))}

      {/* Fallback: Generic injected if no specific wallets detected */}
      {hasGenericInjected && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountCard
            selected={connector === "Injected"}
            disabled={isDisabled}
            icon={<InjectedWallet />}
            label="Browser Wallet"
            onClick={handleWalletConnect("Injected")}
          />
        </Grid.Col>
      )}

      {/* SDK Wallets */}
      {hasCoinbase && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountCard
            selected={connector === "Coinbase Wallet"}
            disabled={isDisabled}
            icon={<CoinbaseWallet />}
            label="Coinbase Wallet"
            onClick={handleWalletConnect("Coinbase Wallet")}
          />
        </Grid.Col>
      )}

      {hasMetaMask && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountCard
            selected={connector === "MetaMask"}
            disabled={isDisabled || useSCW}
            icon={<MetamaskWallet />}
            label="MetaMask"
            onClick={handleWalletConnect("MetaMask")}
          />
        </Grid.Col>
      )}

      {hasWalletConnect && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountCard
            selected={connector === "WalletConnect"}
            disabled={isDisabled}
            icon={<WalletConnectWallet />}
            label="WalletConnect"
            onClick={handleWalletConnect("WalletConnect")}
          />
        </Grid.Col>
      )}

      {/* Show message if no wallets detected */}
      {detectedWallets.length === 0 && (
        <Grid.Col span={12}>
          <Box
            p="md"
            style={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.5)",
            }}>
            <Text size="sm">No wallets detected</Text>
            <Text size="xs" mt="xs">
              Please install a wallet extension like MetaMask, Trust Wallet, or
              RamaPay
            </Text>
          </Box>
        </Grid.Col>
      )}
    </Grid>
  );
};
