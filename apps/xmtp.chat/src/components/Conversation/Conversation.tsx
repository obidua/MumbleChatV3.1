import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dm, Group as XmtpGroup } from "@xmtp/browser-sdk";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { ConversationMenu } from "@/components/Conversation/ConversationMenu";
import { MembersList } from "@/components/Conversation/MembersList";
import { Messages } from "@/components/Messages/Messages";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { useClient } from "@/contexts/XMTPContext";
import { resolveAddresses } from "@/helpers/profiles";
import { isValidInboxId, shortAddress } from "@/helpers/strings";
import { getMemberAddress } from "@/helpers/xmtp";
import { useConversation } from "@/hooks/useConversation";
import { useMobile } from "@/hooks/useMobile";
import { useContactNickname } from "@/stores/contacts";
import { IconBack } from "@/icons/IconBack";
import { IconUsers } from "@/icons/IconUsers";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Composer } from "./Composer";
import classes from "./Conversation.module.css";

export type ConversationProps = {
  conversationId: string;
};

export const Conversation: React.FC<ConversationProps> = ({
  conversationId,
}) => {
  const [opened, { toggle }] = useDisclosure();
  const client = useClient();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const menuOpenRef = useRef(false);
  const {
    conversation,
    name,
    sync,
    loading: conversationLoading,
    messages,
    members,
    syncing: conversationSyncing,
  } = useConversation(conversationId);

  useEffect(() => {
    const loadMessages = async () => {
      await sync(true);
    };
    void loadMessages();
  }, [conversationId]);

  // Auto-sync messages every 1 second for live updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Don't sync while menu is open to prevent flickering
      if (!menuOpenRef.current) {
        // Sync from network to get live messages
        void sync(true);
      }
    }, 1000); // Sync every 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [conversationId, sync]);

  useEffect(() => {
    void resolveAddresses(
      Array.from(members.values()).map((m) => getMemberAddress(m)),
    );
  }, [members]);

  const handleSync = useCallback(async () => {
    await sync(true);
  }, [sync, conversationId]);

  const handleBack = () => {
    void navigate("/conversations");
  };

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

  // Get nickname for DM contacts
  const { nickname } = useContactNickname(otherMemberAddress ?? undefined);

  const displayTitle = useMemo(() => {
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

  return (
    <>
      <ConversationProvider
        key={conversationId}
        conversationId={conversationId}>
        <ContentLayout
          className={classes.shell}
          headerClassName={classes.header}
          contentClassName={classes.content}
          footerClassName={classes.footer}
          asideClassName={classes.membersAside}
          title={
            <Group gap="xs">
              {isMobile && (
                <ActionIcon
                  variant="subtle"
                  onClick={handleBack}
                  aria-label="Back to conversations">
                  <IconBack />
                </ActionIcon>
              )}
              <Text>{displayTitle}</Text>
            </Group>
          }
          loading={messages.length === 0 && conversationLoading}
          headerActions={
            <Group gap="xxs">
              <ConversationMenu
                conversationId={conversationId}
                type={conversation instanceof XmtpGroup ? "group" : "dm"}
                onSync={() => void handleSync()}
                disabled={conversationSyncing}
                otherMemberAddress={otherMemberAddress}
                onMenuOpen={() => {
                  menuOpenRef.current = true;
                }}
                onMenuClose={() => {
                  menuOpenRef.current = false;
                }}
              />
              {!isMobile && (
                <Tooltip
                  label={
                    opened ? (
                      <Text size="xs">Hide members</Text>
                    ) : (
                      <Text size="xs">Show members</Text>
                    )
                  }>
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      toggle();
                    }}>
                    <IconUsers />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          }
          aside={
            <MembersList conversationId={conversationId} toggle={toggle} />
          }
          asideOpened={opened}
          footer={<Composer conversationId={conversationId} />}
          withScrollArea={false}>
          <Messages messages={messages} />
        </ContentLayout>
      </ConversationProvider>
      <Outlet context={{ conversationId }} />
    </>
  );
};
