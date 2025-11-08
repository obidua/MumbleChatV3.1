import { Button, Flex, Group, Stack, Text, TextInput } from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "@/components/App/AppHeader";
import { Modal } from "@/components/Modal";
import { useClient } from "@/contexts/XMTPContext";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { useConversations } from "@/hooks/useConversations";
import { useMemberId } from "@/hooks/useMemberId";
import { ContentLayout } from "@/layouts/ContentLayout";
import { useActions } from "@/stores/inbox/hooks";
import classes from "./CreateDmModal.module.css";

export const CreateDmModal: React.FC = () => {
  const { newDm } = useConversations();
  const { addConversation } = useActions();
  const [loading, setLoading] = useState(false);
  const {
    memberId,
    setMemberId,
    error: memberIdError,
    inboxId,
  } = useMemberId();
  const navigate = useNavigate();
  const fullScreen = useCollapsedMediaQuery();
  const contentHeight = fullScreen ? "auto" : "70dvh";
  const client = useClient();

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const conversation = await newDm(inboxId);
      // ensure conversation is added to store so navigation works
      await addConversation(conversation);
      void navigate(`/conversations/${conversation.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      opened
      centered
      fullScreen={fullScreen}
      onClose={handleClose}
      size="auto"
      padding={0}>
      <AppHeader client={client} />
      <ContentLayout
        maxHeight={contentHeight}
        loading={loading}
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
              New Message
            </Text>
          </Group>
        }>
        <Stack gap="lg" p="md">
          {/* Header Card */}
          <div className={classes.headerCard}>
            <div className={classes.cardContent}>
              <Flex align="center" gap="md" mb="md">
                <div className={classes.iconWrapper}>
                  <svg
                    className={classes.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <Text className={classes.headerTitle}>
                    Start a Conversation
                  </Text>
                  <Text className={classes.headerSubtitle}>
                    Send encrypted messages to anyone with a wallet
                  </Text>
                </div>
              </Flex>
            </div>
          </div>

          {/* Recipient Card */}
          <div className={classes.recipientCard}>
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
                Recipient Information
              </div>

              <Text size="xs" c="dimmed" mb="md">
                Enter the wallet address, ENS name, Base name, or inbox ID of
                the person you want to message.
              </Text>

              <TextInput
                size="md"
                placeholder="0x... or name.eth or @basename"
                styles={{
                  input: {
                    background: "rgba(10, 13, 25, 0.6)",
                    border: "1px solid rgba(10, 255, 241, 0.2)",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.95rem",
                    padding: "12px 16px",
                    height: "auto",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  },
                  error: {
                    marginTop: "8px",
                    fontSize: "0.85rem",
                  },
                }}
                error={memberIdError}
                value={memberId}
                onChange={(event) => {
                  setMemberId(event.target.value);
                }}
              />

              {inboxId && !memberIdError && (
                <div className={classes.validIndicator}>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <Text size="xs">Valid recipient found</Text>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className={classes.infoCard}>
            <div className={classes.cardContent}>
              <Flex align="flex-start" gap="sm">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#0afff1"
                  style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Stack gap="xs">
                  <Text size="sm" fw={600} style={{ color: "#0afff1" }}>
                    End-to-End Encrypted
                  </Text>
                  <Text size="xs" c="dimmed">
                    All messages are encrypted and can only be read by you and
                    the recipient. No one else can access your conversations.
                  </Text>
                </Stack>
              </Flex>
            </div>
          </div>

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="default"
              onClick={handleClose}
              size="md"
              styles={{
                root: {
                  background: "rgba(10, 13, 25, 0.6)",
                  border: "1px solid rgba(10, 255, 241, 0.2)",
                  color: "rgba(255, 255, 255, 0.9)",
                },
              }}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "#0afff1", to: "#9772fb" }}
              disabled={loading || memberIdError !== null || !inboxId}
              loading={loading}
              onClick={() => void handleCreate()}
              size="md"
              styles={{
                root: {
                  fontWeight: 700,
                },
              }}>
              Start Chat
            </Button>
          </Group>

          {/* Back to Conversations Button - Helpful for iOS */}
          <Button
            fullWidth
            size="lg"
            variant="light"
            onClick={handleClose}
            mt="md"
            styles={{
              root: {
                background: "rgba(10, 255, 241, 0.1)",
                border: "1px solid rgba(10, 255, 241, 0.2)",
                color: "#0afff1",
                fontWeight: 600,
              },
            }}>
            Back to Conversations
          </Button>
        </Stack>
      </ContentLayout>
    </Modal>
  );
};
