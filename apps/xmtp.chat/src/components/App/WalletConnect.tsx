import { Group, Paper, Stack } from "@mantine/core";
import { BlockchainSelect } from "@/components/App/BlockchainSelect";
import { ConnectorSelect } from "@/components/App/ConnectorSelect";
import { ConnectWallet } from "@/components/App/ConnectWallet";
import { UseEphemeral } from "@/components/App/UseEphemeral";
import { UseSCW } from "@/components/App/UseSCW";
import classes from "./WalletConnect.module.css";

export const WalletConnect = () => {
  return (
    <Paper className={classes.walletCard}>
      <Stack gap={0}>
        <Group
          gap="sm"
          align="center"
          justify="center"
          flex={1}
          className={classes.optionsRow}>
          <UseSCW />
          <BlockchainSelect />
        </Group>
        <ConnectorSelect />
        <Group
          align="center"
          justify="space-between"
          flex={1}
          className={classes.actionsRow}>
          <UseEphemeral />
          <ConnectWallet />
        </Group>
      </Stack>
    </Paper>
  );
};
