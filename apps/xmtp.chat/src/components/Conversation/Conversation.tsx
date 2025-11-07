import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dm, Group as XmtpGroup } from "@xmtp/browser-sdk";
import { useCallback, useEffect, useMemo } from "react";
import { Outlet } from "react-router";
import { ConversationMenu } from "@/components/Conversation/ConversationMenu";
import { MembersList } from "@/components/Conversation/MembersList";
import { Messages } from "@/components/Messages/Messages";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { useClient } from "@/contexts/XMTPContext";
import { resolveAddresses } from "@/helpers/profiles";
import { isValidInboxId, shortAddress } from "@/helpers/strings";
import { getMemberAddress } from "@/helpers/xmtp";
import { useConversation } from "@/hooks/useConversation";
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

  useEffect(() => {
    void resolveAddresses(
      Array.from(members.values()).map((m) => getMemberAddress(m)),
    );
  }, [members]);

  const handleSync = useCallback(async () => {
    await sync(true);
  }, [sync, conversationId]);

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

  const displayTitle = useMemo(() => {
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
          title={displayTitle}
          loading={messages.length === 0 && conversationLoading}
          headerActions={
            <Group gap="xxs">
              <ConversationMenu
                conversationId={conversationId}
                type={conversation instanceof XmtpGroup ? "group" : "dm"}
                onSync={() => void handleSync()}
                disabled={conversationSyncing}
              />
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
