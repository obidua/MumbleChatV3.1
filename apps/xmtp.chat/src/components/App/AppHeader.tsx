import { ActionIcon, Burger, Flex, Text, Tooltip } from "@mantine/core";
import type { Client } from "@xmtp/browser-sdk";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { ContentTypes } from "@/contexts/XMTPContext";
import { useMobile } from "@/hooks/useMobile";
import { IconLogout } from "@/icons/IconLogout";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "./AppHeader.module.css";

export type AppHeaderProps = {
  client: Client<ContentTypes>;
  opened?: boolean;
  toggle?: () => void;
};

export const AppHeader: React.FC<AppHeaderProps> = ({ opened, toggle }) => {
  const isMobile = useMobile();
  const navigate = useNavigate();

  const handleDisconnect = useCallback(() => {
    void navigate("/disconnect");
  }, [navigate]);

  return (
    <Flex align="center" justify="space-between" className={classes.shell}>
      <Flex align="center" gap="md" className={classes.leftSection}>
        {!isMobile && (
          <div className={classes.burger}>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              color="rgba(10, 255, 241, 0.8)"
            />
          </div>
        )}
        <Flex align="center" gap="sm" className={classes.brandGroup}>
          <div className={classes.brandIcon}>
            <MumbleChatLogo className={classes.logo} />
          </div>
          <Flex direction="column" gap={2} className={classes.brandText}>
            <Text className={classes.brandName}>
              Mumble<span className={classes.brandAccent}>Chat</span>
            </Text>
            <Text className={classes.brandTagline}>
              ⚡ Decentralized Messaging
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <div className={classes.statusContainer}>
        <div className={classes.statusDot} />
        <Tooltip label="Disconnect wallet">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={handleDisconnect}
            className={classes.disconnectIcon}
            aria-label="Disconnect">
            <IconLogout size={14} color="rgba(10, 255, 241, 0.7)" />
          </ActionIcon>
        </Tooltip>
      </div>
    </Flex>
  );
};
