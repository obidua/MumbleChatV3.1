import {
  ActionIcon,
  Badge,
  Box,
  Button,
  CopyButton,
  Group,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { Client, type SafeInstallation, type Signer } from "@xmtp/browser-sdk";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useSignMessage } from "wagmi";
import { WalletConnect } from "@/components/App/WalletConnect";
import { InstallationTable } from "@/components/InboxTools/InstallationTable";
import { createEOASigner, createSCWSigner } from "@/helpers/createSigner";
import { isValidInboxId } from "@/helpers/strings";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useEphemeralSigner } from "@/hooks/useEphemeralSigner";
import { useMemberId } from "@/hooks/useMemberId";
import { useSettings } from "@/hooks/useSettings";
import { ContentLayout } from "@/layouts/ContentLayout";
import classes from "./InboxTools.module.css";

// MumbleChat icons
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconServer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const IconFolder = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const InboxTools: React.FC = () => {
  const {
    account,
    address,
    isConnected,
    disconnect,
    loading: walletLoading,
  } = useConnectWallet();
  const { address: ephemeralAddress, signer: ephemeralSigner } =
    useEphemeralSigner();
  const { signMessageAsync } = useSignMessage();
  const {
    inboxId,
    memberId,
    setMemberId,
    error: memberIdError,
  } = useMemberId();
  const [installations, setInstallations] = useState<SafeInstallation[]>([]);
  const [selectedInstallationIds, setSelectedInstallationIds] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(false);
  const {
    useSCW,
    ephemeralAccountEnabled,
    setEphemeralAccountEnabled,
  } = useSettings();
  const [active, setActive] = useState(0);

  // Always use dev environment for MumbleChat
  const environment = "dev" as const;

  const handleFindInstallations = useCallback(async () => {
    if (!isValidInboxId(inboxId)) {
      return;
    }
    setLoading(true);
    setInstallations([]);
    setSelectedInstallationIds([]);
    try {
      const inboxState = await Client.inboxStateFromInboxIds(
        [inboxId],
        environment,
      );
      setInstallations(
        inboxState[0].installations.sort(
          (a, b) =>
            Number(b.clientTimestampNs ?? 0) - Number(a.clientTimestampNs ?? 0),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [inboxId, environment]);

  const handleRevokeInstallations = useCallback(
    async (installationIds: Uint8Array[]) => {
      let signer: Signer;
      if (ephemeralAccountEnabled) {
        if (!ephemeralAddress) {
          console.error("Ephemeral wallet not connected");
          return;
        }
        signer = ephemeralSigner;
      } else {
        if (!address) {
          console.error("Wallet not connected");
          return;
        }
        if (useSCW && !account.chainId) {
          console.error("Smart contract wallet chain ID not set");
          return;
        }
        signer = useSCW
          ? createSCWSigner(
              address,
              (message: string) => signMessageAsync({ message }),
              account.chainId,
            )
          : createEOASigner(address, (message: string) =>
              signMessageAsync({ message }),
            );
      }
      setLoading(true);
      try {
        await Client.revokeInstallations(
          signer,
          inboxId,
          installationIds,
          environment,
        );
      } finally {
        setLoading(false);
      }
      void handleFindInstallations();
    },
    [
      environment,
      address,
      account.chainId,
      useSCW,
      signMessageAsync,
      inboxId,
      handleFindInstallations,
      ephemeralAccountEnabled,
      ephemeralAddress,
    ],
  );

  const handleDisconnectWallet = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      setEphemeralAccountEnabled(false);
    }
    setMemberId("");
    setInstallations([]);
    setSelectedInstallationIds([]);
  }, [
    isConnected,
    disconnect,
    setEphemeralAccountEnabled,
    setMemberId,
    setInstallations,
    setSelectedInstallationIds,
  ]);

  useEffect(() => {
    if (!isValidInboxId(inboxId)) {
      setInstallations([]);
      setSelectedInstallationIds([]);
    }
  }, [inboxId]);

  useEffect(() => {
    setInstallations([]);
    setSelectedInstallationIds([]);
  }, [environment]);

  useEffect(() => {
    if (isConnected || ephemeralAccountEnabled) {
      setActive(1);
    } else {
      setActive(0);
    }
  }, [isConnected, ephemeralAccountEnabled]);

  const truncatedAddress = address ?? ephemeralAddress;
  const displayAddress = truncatedAddress
    ? `${truncatedAddress.slice(0, 6)}...${truncatedAddress.slice(-4)}`
    : "";

  return (
    <>
      <ContentLayout
        loading={loading}
        className={classes.container}
        title={
          <Group justify="space-between" align="center" flex={1}>
            <Group gap="sm" align="center">
              <Box className={classes.headerIcon}>
                <IconShield />
              </Box>
              <Text className={classes.title}>
                Installation Management
              </Text>
            </Group>
            <Badge
              className={classes.networkBadge}
              leftSection={<span className={classes.networkDot} />}>
              MumbleChat Network
            </Badge>
          </Group>
        }
        headerClassName={classes.header}
        footer={
          <Group justify="space-between" p="md" flex={1} className={classes.footer}>
            <Text size="sm" c="dimmed">
              {selectedInstallationIds.length > 0
                ? `${selectedInstallationIds.length} installation(s) selected`
                : "Select installations to revoke"}
            </Text>
            <Button
              className={classes.revokeButton}
              disabled={selectedInstallationIds.length === 0}
              onClick={() => {
                const installationBytes = installations
                  .filter((installation) =>
                    selectedInstallationIds.includes(installation.id),
                  )
                  .map((installation) => installation.bytes);
                void handleRevokeInstallations(installationBytes);
              }}>
              🗑️ Revoke Selected
            </Button>
          </Group>
        }>
        <Box className={classes.stepper}>
          <Stepper
            active={active}
            onStepClick={setActive}
            color="teal"
            styles={{
              step: { padding: "8px 0" },
              stepLabel: { color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 },
              stepDescription: { color: "rgba(255, 255, 255, 0.5)" },
              separator: { background: "rgba(10, 255, 241, 0.2)" },
              separatorActive: { background: "linear-gradient(90deg, #10b981, #0aFFF1)" },
              stepIcon: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(10, 255, 241, 0.3)",
              },
            }}>
            <Stepper.Step
              label="Connect your wallet"
              description="Link your wallet to manage installations"
              allowStepSelect={false}
              loading={walletLoading}
              completedIcon="✓">
              <Box className={classes.card} mt="lg">
                <WalletConnect />
              </Box>
            </Stepper.Step>
            <Stepper.Step
              label="Manage installations"
              description="View and revoke device connections"
              allowStepSelect={false}
              completedIcon="✓">
              <Stack gap="lg" py="md">
                {/* Connected Wallet Card */}
                <Box className={classes.walletCard}>
                  <Group justify="space-between" align="center">
                    <Group gap="md">
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <Text size="lg">🔗</Text>
                      </Box>
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">Connected Wallet</Text>
                        <Group gap="xs">
                          <Text className={classes.addressBadge}>
                            {displayAddress}
                          </Text>
                          <CopyButton value={truncatedAddress ?? ""}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? "Copied!" : "Copy address"}>
                                <ActionIcon
                                  variant="subtle"
                                  size="sm"
                                  onClick={copy}
                                  style={{ color: "rgba(10, 255, 241, 0.7)" }}>
                                  {copied ? "✓" : "📋"}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </Stack>
                    </Group>
                    <Button
                      variant="subtle"
                      size="xs"
                      className={classes.disconnectBtn}
                      onClick={handleDisconnectWallet}>
                      Disconnect
                    </Button>
                  </Group>
                </Box>

                {/* Input Section */}
                <Box className={classes.inputSection}>
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Text size="sm" fw={500} c="white">
                        Enter an address or inbox ID
                      </Text>
                      {memberIdError && (
                        <Badge color="red" variant="light" size="sm">
                          {memberIdError}
                        </Badge>
                      )}
                    </Group>
                    <TextInput
                      size="md"
                      placeholder="0x... or inbox ID"
                      error={!!memberIdError}
                      value={memberId}
                      onChange={(event) => {
                        setMemberId(event.target.value);
                      }}
                      styles={{
                        input: {
                          background: "rgba(0, 0, 0, 0.3)",
                          border: "1px solid rgba(10, 255, 241, 0.2)",
                          color: "#ffffff",
                          borderRadius: "8px",
                        },
                      }}
                    />
                    <Group justify="space-between" align="center">
                      <Button
                        className={classes.secondaryButton}
                        onClick={() => {
                          setMemberId(address ?? ephemeralAddress);
                        }}>
                        📍 Use wallet address
                      </Button>
                      <Button
                        className={classes.primaryButton}
                        disabled={!isValidInboxId(inboxId)}
                        onClick={() => {
                          void handleFindInstallations();
                        }}>
                        🔍 Find installations
                      </Button>
                    </Group>
                  </Stack>
                </Box>

                {/* Installations Section */}
                <Box className={classes.installationsSection}>
                  <Group className={classes.installationsTitle}>
                    <IconServer />
                    <Title order={5} c="white">Installations</Title>
                    {installations.length > 0 && (
                      <Badge className={classes.installationsCount}>
                        {installations.length}
                      </Badge>
                    )}
                  </Group>
                  
                  <Box className={classes.card}>
                    {installations.length === 0 ? (
                      <Box className={classes.emptyState}>
                        <Box className={classes.emptyIcon}>
                          <IconFolder />
                        </Box>
                        <Text c="dimmed" size="sm">
                          No installations found
                        </Text>
                        <Text c="dimmed" size="xs" mt="xs">
                          Enter an address and click "Find installations" to search
                        </Text>
                      </Box>
                    ) : (
                      <InstallationTable
                        installations={installations}
                        selectedInstallationIds={selectedInstallationIds}
                        setSelectedInstallationIds={setSelectedInstallationIds}
                      />
                    )}
                  </Box>
                </Box>
              </Stack>
            </Stepper.Step>
          </Stepper>
        </Box>
      </ContentLayout>
      <Outlet />
    </>
  );
};
