import { ActionIcon, Box, Card, Flex, Menu, Stack, Text } from "@mantine/core";
import { Dm, type DecodedMessage } from "@xmtp/browser-sdk";
import { ContentTypeGroupUpdated } from "@xmtp/content-type-group-updated";
import { ContentTypeReadReceipt } from "@xmtp/content-type-read-receipt";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { ContentTypeReply } from "@xmtp/content-type-reply";
import { differenceInCalendarDays, format, isToday } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EditNickname } from "@/components/Contacts/EditNickname";
import { useClient } from "@/contexts/XMTPContext";
import { nsToDate } from "@/helpers/date";
import { isValidInboxId, shortAddress } from "@/helpers/strings";
import { getMemberAddress } from "@/helpers/xmtp";
import { useConversation } from "@/hooks/useConversation";
import { IconDots } from "@/icons/IconDots";
import { useContactNickname } from "@/stores/contacts";
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
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

  const memberCount = useMemo(() => members.size, [members]);

  const isDm = useMemo(() => conversation instanceof Dm, [conversation]);

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

  // Get nickname for the other member (for DMs)
  const { nickname } = useContactNickname(otherMemberAddress ?? undefined);

  const displayName = useMemo(() => {
    // Priority: nickname > group name > ENS/basename > truncated address
    if (nickname) {
      return nickname;
    }
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
  }, [name, otherMemberAddress, nickname]);

  const avatarText = useMemo(() => {
    const address = otherMemberAddress || name || "";
    return address.slice(-2).toUpperCase();
  }, [otherMemberAddress, name]);

  const avatarColor = useMemo(() => {
    const address = otherMemberAddress || name || "";
    const hash = address.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 55%)`;
  }, [otherMemberAddress, name]);

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
        <Flex gap="md" align="flex-start">
          <Box
            className={styles.avatar}
            style={{
              backgroundColor: avatarColor,
            }}>
            <Text className={styles.avatarText}>{avatarText}</Text>
          </Box>
          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <Flex align="flex-start" justify="space-between" gap="xs">
              <Text fw={700} className={styles.title} lineClamp={1}>
                {displayName}
              </Text>
              <Flex align="center" gap="xs">
                {sentAtLabel && (
                  <Text size="xs" c="dimmed" className={styles.time}>
                    {sentAtLabel}
                  </Text>
                )}
                {isDm && otherMemberAddress && (
                  <Menu shadow="md" position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}>
                        <IconDots size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown
                      onClick={(e) => {
                        e.stopPropagation();
                      }}>
                      <Menu.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          setNicknameModalOpen(true);
                        }}>
                        {nickname ? "Edit Nickname" : "Set Nickname"}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Flex>
            </Flex>
            <Text size="sm" c="dimmed" className={styles.preview} lineClamp={2}>
              {previewText}
            </Text>
            <Text size="xs" c="dimmed" className={styles.meta}>
              {memberCount} member{memberCount !== 1 ? "s" : ""}
            </Text>
          </Stack>
        </Flex>
      </Card>
      {isDm && otherMemberAddress && (
        <EditNickname
          address={otherMemberAddress}
          opened={nicknameModalOpen}
          onClose={() => {
            setNicknameModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};
