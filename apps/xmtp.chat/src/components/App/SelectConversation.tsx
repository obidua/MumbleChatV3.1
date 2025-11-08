import { Button, Divider, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ConversationsNavbar } from "@/components/Conversations/ConversationsNavbar";
import { useMobile } from "@/hooks/useMobile";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import { ContentLayout } from "@/layouts/ContentLayout";
import classes from "./SelectConversation.module.css";

export const SelectConversation = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  // Debug log for mobile detection
  useEffect(() => {
    console.log("[SelectConversation] isMobile:", isMobile);
    console.log("[SelectConversation] window.innerWidth:", window.innerWidth);
    console.log(
      "[SelectConversation] matchMedia result:",
      window.matchMedia("(max-width: 767px)").matches,
    );
  }, [isMobile]);

  // On mobile, show the conversations list instead of the "select conversation" message
  if (isMobile) {
    return <ConversationsNavbar />;
  }

  return (
    <ContentLayout title="No conversation selected">
      <Stack gap="lg" align="center" py="xl">
        <div className={classes.logoWrapper}>
          <MumbleChatLogo className={classes.logo} />
        </div>
        <Text>
          Select a conversation in the left sidebar to display its messages.
        </Text>
        <Divider
          label="or"
          w="80%"
          styles={{
            label: {
              fontSize: "var(--mantine-font-size-md)",
              color: "var(--mantine-color-text)",
            },
          }}
        />
        <Stack gap="xs">
          <Button
            size="xs"
            onClick={() => {
              void navigate("/conversations/new-group");
            }}>
            Create a new group
          </Button>
          <Button
            size="xs"
            onClick={() => {
              void navigate("/conversations/new-dm");
            }}>
            Create a new direct message
          </Button>
        </Stack>
      </Stack>
    </ContentLayout>
  );
};
