import { Button, Group, Paper, Stack } from "@mantine/core";
import { useCallback } from "react";
import { ConnectedAddress } from "@/components/App/ConnectedAddress";
import { LoggingSelect } from "@/components/App/LoggingSelect";
import { NetworkSelect } from "@/components/App/NetworkSelect";
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
  const { ephemeralAccountEnabled } = useSettings();

  const handleConnectClick = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <Paper className={classes.xmtpCard}>
      <Stack gap="xs">
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
