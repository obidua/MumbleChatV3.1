import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { AppHeader } from "@/components/App/AppHeader";
import { BadgeWithCopy } from "@/components/BadgeWithCopy";
import { Modal } from "@/components/Modal";
import { useClient } from "@/contexts/XMTPContext";
import { nsToDate } from "@/helpers/date";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { useIdentity } from "@/hooks/useIdentity";
import { ContentLayout } from "@/layouts/ContentLayout";
import classes from "./IdentityModal.module.css";

export const IdentityModal: React.FC = () => {
  const navigate = useNavigate();
  const client = useClient();

  const {
    installations,
    revokeAllOtherInstallations,
    revoking,
    sync,
    syncing,
  } = useIdentity(true);
  const [accountIdentifier, setAccountIdentifier] = useState<string | null>(
    null,
  );

  const fullScreen = useCollapsedMediaQuery();
  const contentHeight = fullScreen ? "auto" : "70dvh";

  useEffect(() => {
    setAccountIdentifier(
      client.accountIdentifier?.identifier.toLowerCase() ?? null,
    );
  }, [client.accountIdentifier]);

  const handleRevokeAllOtherInstallations = useCallback(async () => {
    await revokeAllOtherInstallations();
    await sync();
  }, [revokeAllOtherInstallations, sync]);

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  // Generate shareable message link
  const shareableLink = useMemo(() => {
    if (!accountIdentifier) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/dm/${accountIdentifier}`;
  }, [accountIdentifier]);

  const clipboard = useClipboard({ timeout: 2000 });

  const handleCopyLink = () => {
    clipboard.copy(shareableLink);
  };

  const handleShareLink = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Message me on MumbleChat",
          text: "Send me a secure, encrypted message on MumbleChat",
          url: shareableLink,
        });
      } catch {
        // User cancelled share or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      <Modal
        opened
        centered
        withCloseButton={false}
        fullScreen={fullScreen}
        onClose={handleClose}
        size="auto"
        padding={0}>
        <AppHeader client={client} />
        <ContentLayout
          maxHeight={contentHeight}
          loading={revoking || syncing}
          withScrollAreaPadding={false}
          title={
            <Group align="center" gap="sm">
              <Text
                size="lg"
                fw={700}
                style={{
                  background: "linear-gradient(135deg, #0afff1, #9772fb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                Identity
              </Text>
              <Tooltip label="Help & Info">
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => {
                    void navigate("/conversations/identity/help");
                  }}
                  style={{
                    background: "rgba(10, 255, 241, 0.1)",
                    border: "1px solid rgba(10, 255, 241, 0.2)",
                    color: "#0afff1",
                  }}
                  aria-label="Help & Info">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </ActionIcon>
              </Tooltip>
            </Group>
          }>
          <Stack gap="lg" p="md">
            {/* Profile Identity Card */}
            <div className={classes.identityCard}>
              <div className={classes.cardContent}>
                <div className={classes.sectionTitle}>
                  <svg
                    className={classes.sectionIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Account Identity
                </div>

                <Stack gap="sm">
                  <div className={classes.infoRow}>
                    <div className={classes.infoLabel}>
                      <svg
                        className={classes.labelIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Address
                    </div>
                    <div className={classes.infoValue}>
                      <BadgeWithCopy value={accountIdentifier || ""} />
                    </div>
                  </div>

                  <div className={classes.infoRow}>
                    <div className={classes.infoLabel}>
                      <svg
                        className={classes.labelIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      Inbox ID
                    </div>
                    <div className={classes.infoValue}>
                      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                      <BadgeWithCopy value={client.inboxId!} />
                    </div>
                  </div>

                  <div className={classes.infoRow}>
                    <div className={classes.infoLabel}>
                      <svg
                        className={classes.labelIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      Installation ID
                    </div>
                    <div className={classes.infoValue}>
                      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                      <BadgeWithCopy value={client.installationId!} />
                    </div>
                  </div>
                </Stack>
              </div>
            </div>

            {/* Shareable Message Link Card */}
            <div className={classes.shareCard}>
              <div className={classes.cardContent}>
                <div className={classes.sectionTitle}>
                  <svg
                    className={classes.sectionIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share Your Profile
                </div>

                <Text size="sm" c="dimmed" mb="md" mt="xs">
                  Share this link with anyone to let them send you encrypted
                  messages on MumbleChat.
                </Text>

                <div className={classes.linkDisplay}>
                  <Text size="xs" className={classes.linkText}>
                    {shareableLink}
                  </Text>
                </div>

                <Group gap="sm" mt="md">
                  <Button
                    fullWidth
                    variant="gradient"
                    gradient={{ from: "#0afff1", to: "#9772fb" }}
                    onClick={handleCopyLink}
                    leftSection={
                      clipboard.copied ? (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )
                    }
                    styles={{
                      root: {
                        fontWeight: 700,
                      },
                    }}>
                    {clipboard.copied ? "Copied!" : "Copy Link"}
                  </Button>

                  {"share" in navigator && (
                    <Button
                      fullWidth
                      variant="light"
                      onClick={() => void handleShareLink()}
                      leftSection={
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      }
                      styles={{
                        root: {
                          background: "rgba(10, 255, 241, 0.1)",
                          border: "1px solid rgba(10, 255, 241, 0.2)",
                          color: "#0afff1",
                          fontWeight: 700,
                        },
                      }}>
                      Share
                    </Button>
                  )}
                </Group>
              </div>
            </div>

            {/* Installations Card */}
            <div className={classes.installationsCard}>
              <div className={classes.cardContent}>
                <Flex justify="space-between" align="center" mb="md">
                  <div className={classes.sectionTitle}>
                    <svg
                      className={classes.sectionIcon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Installations
                  </div>
                  <Badge
                    size="lg"
                    radius="md"
                    style={{
                      background: "rgba(10, 255, 241, 0.16)",
                      color: "#0afff1",
                      border: "1px solid rgba(10, 255, 241, 0.32)",
                      fontWeight: 700,
                    }}>
                    {installations.length}
                  </Badge>
                </Flex>

                {installations.length === 0 ? (
                  <div className={classes.emptyState}>
                    <Text>No other installations found</Text>
                  </div>
                ) : (
                  <Stack gap="md">
                    {installations.map((installation) => {
                      const createdAt = nsToDate(
                        installation.clientTimestampNs ?? 0n,
                      );
                      const notAfter = installation.keyPackageStatus?.lifetime
                        ?.notAfter
                        ? new Date(
                            Number(
                              installation.keyPackageStatus.lifetime.notAfter,
                            ) * 1000,
                          )
                        : undefined;
                      const isCurrent =
                        installation.id === client.installationId;
                      const hasError =
                        installation.keyPackageStatus?.validationError;

                      return (
                        <div
                          key={installation.id}
                          className={classes.installationRow}>
                          <div className={classes.installationHeader}>
                            <div className={classes.installationId}>
                              <BadgeWithCopy value={installation.id} />
                            </div>
                            {isCurrent && (
                              <span className={classes.currentBadge}>
                                Current
                              </span>
                            )}
                          </div>

                          <div className={classes.installationMeta}>
                            <div className={classes.metaItem}>
                              <span className={classes.metaLabel}>Created</span>
                              <span className={classes.metaValue}>
                                {formatDistanceToNow(createdAt, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>

                            <div className={classes.metaItem}>
                              <span className={classes.metaLabel}>Expires</span>
                              <span className={classes.metaValue}>
                                {notAfter
                                  ? formatDistanceToNow(notAfter, {
                                      addSuffix: true,
                                    })
                                  : "Error"}
                              </span>
                            </div>

                            <div className={classes.metaItem}>
                              <span className={classes.metaLabel}>Status</span>
                              <span className={classes.metaValue}>
                                {hasError ? (
                                  <span className={classes.errorBadge}>
                                    ⚠️ Error
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      color: "#0afff1",
                                      fontWeight: 600,
                                    }}>
                                    ✓ Active
                                  </span>
                                )}
                              </span>
                            </div>

                            {!isCurrent && (
                              <div className={classes.metaItem}>
                                <span className={classes.metaLabel}>
                                  Action
                                </span>
                                <Button
                                  size="xs"
                                  className={classes.revokeButton}
                                  loading={revoking}
                                  onClick={() => {
                                    void (async () => {
                                      await revokeAllOtherInstallations();
                                      await sync();
                                    })();
                                  }}>
                                  Revoke
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {installations.some(
                      (i) => i.id !== client.installationId,
                    ) && (
                      <Group justify="flex-end" mt="sm">
                        <Button
                          className={classes.revokeAllButton}
                          loading={revoking}
                          onClick={() =>
                            void handleRevokeAllOtherInstallations()
                          }>
                          Revoke All Other Installations
                        </Button>
                      </Group>
                    )}
                  </Stack>
                )}
              </div>
            </div>

            {/* Disconnect Wallet Card */}
            <div className={classes.disconnectCard}>
              <div className={classes.cardContent}>
                <div className={classes.sectionTitle}>
                  <svg
                    className={classes.sectionIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Disconnect
                </div>
                <Text size="sm" c="dimmed" mb="md" mt="xs">
                  Disconnect your wallet from MumbleChat. You can reconnect
                  anytime to access your messages.
                </Text>
                <Button
                  fullWidth
                  variant="light"
                  color="red"
                  onClick={() => {
                    void navigate("/disconnect");
                  }}
                  style={{
                    background: "rgba(250, 82, 82, 0.1)",
                    border: "1px solid rgba(250, 82, 82, 0.2)",
                    color: "#fa5252",
                  }}>
                  Disconnect Wallet
                </Button>
              </div>
            </div>

            {/* Back to Conversations Button */}
            <Button
              fullWidth
              size="lg"
              variant="gradient"
              gradient={{ from: "#0afff1", to: "#9772fb", deg: 135 }}
              onClick={handleClose}
              style={{
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(10, 255, 241, 0.3)",
              }}>
              Back to Conversations
            </Button>
          </Stack>
        </ContentLayout>
      </Modal>
      <Outlet />
    </>
  );
};
