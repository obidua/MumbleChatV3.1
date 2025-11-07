import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { Dm, type DecodedMessage } from "@xmtp/browser-sdk";
import { ContentTypeGroupUpdated } from "@xmtp/content-type-group-updated";
import { ContentTypeReadReceipt } from "@xmtp/content-type-read-receipt";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { ContentTypeReply } from "@xmtp/content-type-reply";
import { differenceInCalendarDays, format, isToday } from "date-fns";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useClient } from "@/contexts/XMTPContext";
import { nsToDate } from "@/helpers/date";
import { isValidInboxId, shortAddress } from "@/helpers/strings";
import { getMemberAddress } from "@/helpers/xmtp";
import { useConversation } from "@/hooks/useConversation";
import styles from "./ConversationCard.module.css";

export type ConversationCardProps = {
  conversationId: string;
  onSelect?: () => void;
};

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversationId,
  onSelect,
}) => {
  const { conversation, name, members, messages } =
    useConversation(conversationId);
  const navigate = useNavigate();
  const { conversationId: paramsConversationId } = useParams();
  const client = useClient();

  const memberCount = useMemo(() => members.size, [members]);

  const otherMemberAddress = useMemo(() => {
    if (!(conversation instanceof Dm)) {
      return null;
    }
    const clientInboxId = client.inboxId;
    if (!clientInboxId) {
      return null;
    }
    const otherMember = Array.from(members.values()).find(
      (member) => member.inboxId !== clientInboxId,
    );
    return otherMember ? getMemberAddress(otherMember) : null;
  }, [conversation, members, client.inboxId]);

  const displayName = useMemo(() => {
    if (name && !isValidInboxId(name)) {
      return name;
    }
    if (otherMemberAddress) {
      return shortAddress(otherMemberAddress, 4);
    }
    if (name) {
      return shortAddress(name, 4);
    }
    return "Untitled";
  }, [name, otherMemberAddress]);

  const { previewText, sentAtLabel } = useMemo(() => {
    const latest = messages[messages.length - 1];

    const resolvePreview = (message?: DecodedMessage) => {
      if (!message) {
        return `${memberCount} member${memberCount !== 1 ? "s" : ""}`;
      }
      if (typeof message.content === "string") {
        return message.content;
      }
      if (typeof message.fallback === "string") {
        return message.fallback;
      }
      if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
        return "📎 Attachment";
      }
      if (message.contentType.sameAs(ContentTypeGroupUpdated)) {
        return "Group update";
      }
      if (message.contentType.sameAs(ContentTypeReadReceipt)) {
        return "Read receipt";
      }
      if (message.contentType.sameAs(ContentTypeReply)) {
        return "↩︎ Reply";
      }
      return "Unsupported content";
    };

    const resolveSentAt = (message?: DecodedMessage) => {
      if (!message) return null;
      const sentAt = nsToDate(message.sentAtNs);
      if (isToday(sentAt)) {
        return format(sentAt, "HH:mm");
      }
      if (differenceInCalendarDays(new Date(), sentAt) < 7) {
        return format(sentAt, "EEE");
      }
      return format(sentAt, "MMM d");
    };

    return {
      previewText: resolvePreview(latest),
      sentAtLabel: resolveSentAt(latest),
    };
  }, [messages, memberCount]);

  return (
    <Box px="sm">
      <Card
        shadow="sm"
        padding="sm"
        radius="md"
        withBorder
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            void navigate(`/conversations/${conversationId}`);
            onSelect?.();
          }
        }}
        onClick={() => {
          void navigate(`/conversations/${conversationId}`);
          onSelect?.();
        }}
        className={[
          styles.root,
          conversationId === paramsConversationId && styles.selected,
        ].join(" ")}>
        <Stack gap="xs">
          <Flex align="flex-start" justify="space-between" gap="xs">
            <Text fw={700} className={styles.title} lineClamp={1}>
              {displayName}
            </Text>
            {sentAtLabel && (
              <Text size="xs" c="dimmed" className={styles.time}>
                {sentAtLabel}
              </Text>
            )}
          </Flex>
          <Text size="sm" c="dimmed" className={styles.preview} lineClamp={2}>
            {previewText}
          </Text>
          <Text size="xs" c="dimmed" className={styles.meta}>
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </Text>
        </Stack>
      </Card>
    </Box>
  );
};
