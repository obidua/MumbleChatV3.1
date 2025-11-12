import type {
  Conversation,
  DecodedMessage,
  Identifier,
  SafeCreateGroupOptions,
} from "@xmtp/browser-sdk";
import { useState } from "react";
import { useClient, type ContentTypes } from "@/contexts/XMTPContext";
import { dateToNs } from "@/helpers/date";
import { notificationService } from "@/services/notificationService";
import {
  useActions,
  useConversations as useConversationsState,
  useLastCreatedAt,
} from "@/stores/inbox/hooks";

export const useConversations = () => {
  const client = useClient();
  const { addConversations, addConversation, addMessage, setLastSyncedAt } =
    useActions();
  const conversations = useConversationsState();
  const lastCreatedAt = useLastCreatedAt();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const sync = async (fromNetwork: boolean = false) => {
    if (fromNetwork) {
      setSyncing(true);

      try {
        await client.conversations.sync();
      } finally {
        setSyncing(false);
      }
    }

    setLoading(true);

    try {
      // When syncing from network or on initial load, fetch ALL conversations
      // from the XMTP client's IndexedDB storage (it persists across reconnects)
      // Only use incremental sync (createdAfterNs) when we already have conversations loaded
      const shouldFetchAll = fromNetwork || conversations.length === 0;
      const convos = await client.conversations.list(
        shouldFetchAll || !lastCreatedAt
          ? {}
          : { createdAfterNs: lastCreatedAt },
      );
      await addConversations(convos);
      setLastSyncedAt(dateToNs(new Date()));
      return convos;
    } finally {
      setLoading(false);
    }
  };

  const syncAll = async () => {
    setSyncing(true);

    try {
      await client.conversations.syncAll();
    } finally {
      setSyncing(false);
    }
  };

  const getConversationById = async (conversationId: string) => {
    setLoading(true);

    try {
      const conversation =
        await client.conversations.getConversationById(conversationId);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const getDmByInboxId = async (inboxId: string) => {
    setLoading(true);

    try {
      const dm = await client.conversations.getDmByInboxId(inboxId);
      return dm;
    } finally {
      setLoading(false);
    }
  };

  const getMessageById = async (messageId: string) => {
    setLoading(true);

    try {
      const message = await client.conversations.getMessageById(messageId);
      return message;
    } finally {
      setLoading(false);
    }
  };

  const newGroup = async (
    inboxIds: string[],
    options?: SafeCreateGroupOptions,
  ) => {
    setLoading(true);

    try {
      const conversation = await client.conversations.newGroup(
        inboxIds,
        options,
      );
      void addConversation(conversation);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const newGroupWithIdentifiers = async (
    identifiers: Identifier[],
    options?: SafeCreateGroupOptions,
  ) => {
    setLoading(true);

    try {
      const conversation = await client.conversations.newGroupWithIdentifiers(
        identifiers,
        options,
      );
      void addConversation(conversation);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const newDm = async (inboxId: string) => {
    setLoading(true);

    try {
      const conversation = await client.conversations.newDm(inboxId);
      void addConversation(conversation);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const newDmWithIdentifier = async (identifier: Identifier) => {
    setLoading(true);

    try {
      const conversation =
        await client.conversations.newDmWithIdentifier(identifier);
      void addConversation(conversation);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const stream = async () => {
    const onValue = (conversation: Conversation<ContentTypes>) => {
      const shouldAdd =
        conversation.metadata?.conversationType === "dm" ||
        conversation.metadata?.conversationType === "group";
      if (shouldAdd) {
        void addConversation(conversation);
      }
    };

    const stream = await client.conversations.stream({
      onValue,
    });

    return () => {
      void stream.end();
    };
  };

  const streamAllMessages = async () => {
    const onValue = (message: DecodedMessage<ContentTypes>) => {
      void addMessage(message.conversationId, message);

      // Show notification for new messages (non-blocking)
      if (message.senderInboxId !== client.inboxId) {
        try {
          let senderName = "Someone";
          const conversationName = "Chat";

          // Get sender's inbox ID for display
          if (message.senderInboxId) {
            senderName = message.senderInboxId.slice(0, 10) + "...";
          }

          const messagePreview =
            typeof message.content === "string"
              ? message.content.slice(0, 100)
              : "New message";

          notificationService.showMessageNotification({
            title: `${senderName} • ${conversationName}`,
            body: messagePreview,
            tag: `message-${message.id}`,
            conversationId: message.conversationId,
            onClick: () => {
              // Navigate to conversation
              const url = `/dm/${message.conversationId}`;
              window.location.href = url;
            },
          });
        } catch (error) {
          console.error("Error showing notification:", error);
        }
      }
    };

    const stream = await client.conversations.streamAllMessages({
      onValue,
    });

    return () => {
      void stream.end();
    };
  };

  return {
    conversations,
    getConversationById,
    getDmByInboxId,
    getMessageById,
    loading,
    newDm,
    newDmWithIdentifier,
    newGroup,
    newGroupWithIdentifiers,
    stream,
    streamAllMessages,
    sync,
    syncAll,
    syncing,
  };
};
