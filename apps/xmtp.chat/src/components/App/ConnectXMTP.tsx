import { Anchor, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useCallback } from "react";
import { Link } from "react-router";
import { ConnectedAddress } from "@/components/App/ConnectedAddress";
import { LoggingSelect } from "@/components/App/LoggingSelect";
import { NetworkSelect } from "@/components/App/NetworkSelect";
import { useXMTP } from "@/contexts/XMTPContext";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useConnectXmtp } from "@/hooks/useConnectXmtp";
import { useEphemeralSigner } from "@/hooks/useEphemeralSigner";
import { useSettings } from "@/hooks/useSettings";
import classes from "./ConnectXMTP.module.css";

export type ConnectXMTPProps = {
  onDisconnectWallet: () => void;
};

export const ConnectXMTP = ({ onDisconnectWallet }: ConnectXMTPProps) => {
  const { isConnected, address } = useConnectWallet();
  const { address: ephemeralAddress } = useEphemeralSigner();
  const { connect, loading } = useConnectXmtp();
  const { error } = useXMTP();
  const { ephemeralAccountEnabled } = useSettings();

  const handleConnectClick = useCallback(() => {
    connect();
  }, [connect]);

  const isInstallationLimitError = error && (
    error.message.includes("already registered 10/10 installations") ||
    error.message.includes("Maximum XMTP installations")
  );

  return (
    <Paper className={classes.xmtpCard}>
      <Stack gap="xs">
        {error && (
          <Stack gap="xs">
            <Text size="sm" c="red" ta="center">
              {isInstallationLimitError
                ? "Maximum installations (10/10) reached. Please revoke old installations to continue."
                : error.message.includes("Multiple create operations detected")
                  ? "Identity already exists. Database cleared. Please try again."
                  : `Error: ${error.message}`}
            </Text>
            {isInstallationLimitError && (
              <Group justify="center">
                <Anchor component={Link} to="/inbox-tools" size="sm" fw={600}>
                  → Manage Installations
                </Anchor>
              </Group>
            )}
          </Stack>
        )}
        <Stack gap="md" className={classes.settingsSection}>
          <NetworkSelect />
          <LoggingSelect />
        </Stack>
        <Group
          justify="space-between"
          align="center"
          className={classes.actions}>
          <ConnectedAddress
            size="sm"
            address={address ?? ephemeralAddress}
            onClick={onDisconnectWallet}
          />
          <Group gap="xs" align="center">
            <Button
              className={classes.connectButton}
              disabled={!isConnected && !ephemeralAccountEnabled}
              onClick={handleConnectClick}
              loading={loading}>
              Connect to MumbleChat
            </Button>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
};
