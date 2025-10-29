import { Badge, Box, Group, Text } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { ConversationsList } from "@/components/Conversations/ConversationList";
import { ConversationsMenu } from "@/components/Conversations/ConversationsMenu";
import { useConversations } from "@/hooks/useConversations";
import { ContentLayout } from "@/layouts/ContentLayout";
import classes from "./ConversationsNavbar.module.css";

export const ConversationsNavbar: React.FC = () => {
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

  // loading conversations on mount, and start streaming
  useEffect(() => {
    const loadConversations = async () => {
      await sync(true);
      await startStreams();
    };
    void loadConversations();
  }, []);

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
          <Text size="lg" fw={700} c="var(--mantine-color-gray-0)">
            Conversations
          </Text>
          <Badge
            radius="md"
            size="lg"
            variant="light"
            style={{
              background: "rgba(10, 255, 241, 0.16)",
              color: "#0afff1",
              border: "1px solid rgba(10, 255, 241, 0.28)",
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
      ) : (
        <ConversationsList conversations={conversations} />
      )}
    </ContentLayout>
  );
};
