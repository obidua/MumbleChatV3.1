import { Button, Group, Switch, Text, Tooltip } from "@mantine/core";
import { useCallback } from "react";
import { useXMTP } from "@/contexts/XMTPContext";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useSettings } from "@/hooks/useSettings";

export const UseEphemeral: React.FC = () => {
  const { isConnected } = useConnectWallet();
  const { disconnect } = useXMTP();
  const {
    ephemeralAccountEnabled,
    setEphemeralAccountEnabled,
    setEphemeralAccountKey,
    setAutoConnect,
  } = useSettings();

  const handleEphemeralAccountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEphemeralAccountEnabled(event.currentTarget.checked);
  };

  const handleResetEphemeralAccount = useCallback(() => {
    // Disconnect XMTP client first
    disconnect();

    // Clear ephemeral settings
    setEphemeralAccountEnabled(false);
    setEphemeralAccountKey(null);
    setAutoConnect(false);

    // Clear IndexedDB for ephemeral account
    // This removes all XMTP data associated with the temporary wallet
    void indexedDB.deleteDatabase("xmtp");
  }, [
    disconnect,
    setEphemeralAccountEnabled,
    setEphemeralAccountKey,
    setAutoConnect,
  ]);

  return (
    <Group gap="sm" align="center" wrap="nowrap">
      <Text fw="bold" size="sm" style={{ display: "none" }}>
        Use ephemeral wallet
      </Text>
      <Tooltip
        label="Enable this option to use a temporary wallet for signing messages"
        refProp="rootRef">
        <Switch
          size="md"
          disabled={isConnected}
          checked={ephemeralAccountEnabled}
          onChange={handleEphemeralAccountChange}
          withThumbIndicator={false}
        />
      </Tooltip>
      <Button
        size="xs"
        onClick={handleResetEphemeralAccount}
        color="red.7"
        variant="outline">
        Reset
      </Button>
    </Group>
  );
};
