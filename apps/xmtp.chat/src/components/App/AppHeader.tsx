import { ActionIcon, Burger, Flex, Text, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import type { Client } from "@xmtp/browser-sdk";
import { useEffect, useState } from "react";
import type { ContentTypes } from "@/contexts/XMTPContext";
import { shortenAddress } from "@/helpers/address";
import { useMobile } from "@/hooks/useMobile";
import { IconCopy } from "@/icons/IconCopy";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "./AppHeader.module.css";

export type AppHeaderProps = {
  client: Client<ContentTypes>;
  opened?: boolean;
  toggle?: () => void;
};

export const AppHeader: React.FC<AppHeaderProps> = ({ client, opened, toggle }) => {
  const isMobile = useMobile();
  const clipboard = useClipboard({ timeout: 1500 });
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  useEffect(() => {
    setAccountAddress(
      client.accountIdentifier?.identifier.toLowerCase() ?? null,
    );
  }, [client.accountIdentifier]);

  const handleCopy = () => {
    if (accountAddress) {
      clipboard.copy(accountAddress);
    }
  };

  const displayAddress = accountAddress ? shortenAddress(accountAddress, 4, 3) : "";

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
        {accountAddress && (
          <>
            <Text className={classes.addressText}>{displayAddress}</Text>
            <Tooltip
              label={clipboard.copied ? "Copied!" : accountAddress}
              withArrow
              position="bottom"
              styles={{
                tooltip: {
                  background: "rgba(10, 13, 25, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "white",
                  fontSize: "0.75rem",
                },
                arrow: {
                  background: "rgba(10, 13, 25, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                },
              }}>
              <ActionIcon
                variant="transparent"
                size="xs"
                onClick={handleCopy}
                className={classes.copyIcon}
                aria-label="Copy address">
                <IconCopy />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        <div className={classes.statusDot} />
      </div>
    </Flex>
  );
};
