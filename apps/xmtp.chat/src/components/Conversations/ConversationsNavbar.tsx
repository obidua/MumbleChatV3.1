import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ConversationsList } from "@/components/Conversations/ConversationList";
import { ConversationsMenu } from "@/components/Conversations/ConversationsMenu";
import { QRCodeModal } from "@/components/QRCode/QRCodeModal";
import { QRScannerModal } from "@/components/QRCode/QRScannerModal";
import { useClient } from "@/contexts/XMTPContext";
import { getMemberAddress } from "@/helpers/xmtp";
import { useConversations } from "@/hooks/useConversations";
import { ContentLayout } from "@/layouts/ContentLayout";
import { inboxStore } from "@/stores/inbox/store";
import classes from "./ConversationsNavbar.module.css";

export type ConversationsNavbarProps = {
  onConversationSelected?: () => void;
};

export const ConversationsNavbar: React.FC<ConversationsNavbarProps> = ({
  onConversationSelected,
}) => {
  const {
    sync,
    loading,
    syncing,
    conversations,
    stream,
    streamAllMessages,
    syncAll,
  } = useConversations();
  const stopConversationStreamRef = useRef<(() => void) | null>(null);
  const stopAllMessagesStreamRef = useRef<(() => void) | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const client = useClient();
  const navigate = useNavigate();

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase().trim();
    const state = inboxStore.getState();

    return conversations.filter((conv) => {
      // Search in conversation ID
      if (conv.id.toLowerCase().includes(query)) {
        return true;
      }

      // Get members for this conversation from the store
      const members = state.members.get(conv.id);
      if (members) {
        const membersList = Array.from(members.values());

        // Search in member addresses
        for (const member of membersList) {
          // Skip the client's own inbox
          if (member.inboxId === client.inboxId) {
            continue;
          }

          const address = getMemberAddress(member);
          if (address && address.toLowerCase().includes(query)) {
            return true;
          }
        }
      }

      return false;
    });
  }, [conversations, searchQuery, client.inboxId]);

  const startStreams = useCallback(async () => {
    stopConversationStreamRef.current = await stream();
    stopAllMessagesStreamRef.current = await streamAllMessages();
  }, [stream, streamAllMessages]);

  const stopStreams = useCallback(() => {
    stopConversationStreamRef.current?.();
    stopConversationStreamRef.current = null;
    stopAllMessagesStreamRef.current?.();
    stopAllMessagesStreamRef.current = null;
  }, []);

  const handleSync = useCallback(async () => {
    stopStreams();
    await sync();
    await startStreams();
  }, [sync, startStreams, stopStreams]);

  const handleSyncAll = useCallback(async () => {
    stopStreams();
    await syncAll();
    await startStreams();
  }, [syncAll, startStreams, stopStreams]);

  // loading conversations on mount and when client changes, and start streaming
  useEffect(() => {
    const loadConversations = async () => {
      // Stop any existing streams first
      stopStreams();
      // Sync from network to get latest conversations
      await sync(true);
      // Start streaming for new conversations and messages
      await startStreams();
    };
    void loadConversations();

    // Cleanup: stop streams when client changes or component unmounts
    return () => {
      stopStreams();
    };
  }, [client]); // Intentionally only client - we want fresh sync on reconnect

  // stop streaming on unmount
  useEffect(() => {
    return () => {
      stopStreams();
    };
  }, []);

  return (
    <ContentLayout
      className={classes.shell}
      headerClassName={classes.header}
      contentClassName={classes.content}
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
            Conversations
          </Text>
          <Badge
            radius="md"
            size="lg"
            variant="light"
            style={{
              background: "rgba(10, 255, 241, 0.16)",
              color: "#10b981",
              border: "1px solid rgba(10, 255, 241, 0.32)",
              fontWeight: 700,
            }}>
            {conversations.length}
          </Badge>
        </Group>
      }
      loading={conversations.length === 0 && loading}
      headerActions={
        <Group gap="xs">
          <Tooltip label="Scan QR Code">
            <ActionIcon
              variant="light"
              radius="xl"
              size="lg"
              onClick={() => {
                setShowQRScanner(true);
              }}
              style={{
                background: "rgba(151, 114, 251, 0.16)",
                border: "1px solid rgba(151, 114, 251, 0.25)",
                color: "#0d9488",
              }}>
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12V8m0 4h4.01M12 12h-4.01M12 12v4m6-4h.01M12 12h.01M12 8h.01M12 8h4.01M12 8h-4.01M16 12h.01M8 12h.01"
                />
              </svg>
            </ActionIcon>
          </Tooltip>
          <ConversationsMenu
            loading={syncing || loading}
            onSync={() => void handleSync()}
            onSyncAll={() => void handleSyncAll()}
            onCreateDm={() => {
              void navigate("/conversations/new-dm");
            }}
            onCreateGroup={() => {
              void navigate("/conversations/new-group");
            }}
            onShowQRCode={() => {
              setShowQRCode(true);
            }}
            disabled={syncing}
          />
        </Group>
      }
      withScrollArea={false}>
      {/* Search Bar */}
      <Box px="md" pt="xs" pb="sm">
        <TextInput
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          leftSection={
            <Text size="sm" c="dimmed">
              🔍
            </Text>
          }
          styles={{
            input: {
              backgroundColor: "rgba(10, 255, 241, 0.05)",
              border: "1px solid rgba(10, 255, 241, 0.2)",
              color: "var(--mantine-color-text)",
              "&:focus": {
                borderColor: "rgba(10, 255, 241, 0.5)",
              },
            },
          }}
          radius="md"
        />
      </Box>

      {conversations.length === 0 ? (
        <Box
          display="flex"
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          className={classes.empty}>
          <Text>No conversations found</Text>
        </Box>
      ) : filteredConversations.length === 0 ? (
        <Box
          display="flex"
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          className={classes.empty}>
          <Text>No conversations match your search</Text>
        </Box>
      ) : (
        <ConversationsList
          conversations={filteredConversations}
          onConversationSelected={onConversationSelected}
        />
      )}

      <QRScannerModal
        opened={showQRScanner}
        onClose={() => {
          setShowQRScanner(false);
        }}
      />
      <QRCodeModal
        opened={showQRCode}
        onClose={() => {
          setShowQRCode(false);
        }}
        address={client.accountAddress}
      />
    </ContentLayout>
  );
};
