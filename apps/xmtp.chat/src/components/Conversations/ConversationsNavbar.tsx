import { Badge, Box, Group, Text, TextInput } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConversationsList } from "@/components/Conversations/ConversationList";
import { ConversationsMenu } from "@/components/Conversations/ConversationsMenu";
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
  const client = useClient();

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
      await sync(true);
      await startStreams();
    };
    void loadConversations();
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
              color: "#0afff1",
              border: "1px solid rgba(10, 255, 241, 0.32)",
              fontWeight: 700,
            }}>
            {conversations.length}
          </Badge>
        </Group>
      }
      loading={conversations.length === 0 && loading}
      headerActions={
        <ConversationsMenu
          loading={syncing || loading}
          onSync={() => void handleSync()}
          onSyncAll={() => void handleSyncAll()}
          disabled={syncing}
        />
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
    </ContentLayout>
  );
};
