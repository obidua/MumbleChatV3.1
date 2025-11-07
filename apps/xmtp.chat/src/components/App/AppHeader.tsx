import { Badge, Box, Burger, Flex, Group, Stack, Text } from "@mantine/core";
import type { Client } from "@xmtp/browser-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppMenu } from "@/components/App/AppMenu";
import type { ContentTypes } from "@/contexts/XMTPContext";
import { shortAddress } from "@/helpers/strings";
import { useSettings } from "@/hooks/useSettings";
import classes from "./AppHeader.module.css";

const GlowingCircle = () => {
  return (
    <Box
      w={6}
      h={6}
      bg="#0afff1"
      style={{
        borderRadius: "50%",
        boxShadow: "0px 0px 6px 2px rgba(10, 255, 241, 0.45)",
      }}
    />
  );
};

export type AppHeaderProps = {
  client: Client<ContentTypes>;
  opened?: boolean;
  toggle?: () => void;
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  client,
  opened,
  toggle,
}) => {
  const navigate = useNavigate();
  const { environment } = useSettings();
  const [accountIdentifier, setAccountIdentifier] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setAccountIdentifier(
      client.accountIdentifier?.identifier.toLowerCase() ?? null,
    );
  }, [client.accountIdentifier]);

  const handleClick = () => {
    void navigate("identity");
  };

  return (
    <Flex align="center" justify="space-between" className={classes.shell}>
      <Flex align="center" gap="md">
        <div className={classes.burger}>
          <Burger opened={opened} onClick={toggle} size="sm" />
        </div>
        <Group gap="sm" className={classes.brandGroup}>
          <div className={classes.brandIcon}>MC</div>
          <Stack gap={2} className={classes.brandText}>
            <Text className={classes.brandName}>MumbleChat</Text>
            <Text className={classes.brandTagline}>Ramestta messaging</Text>
          </Stack>
        </Group>
      </Flex>
      <Group align="center" gap="sm" className={classes.controlRow}>
        <Badge
          className={classes.environment}
          radius="lg"
          variant="light"
          aria-label={environment || "environment"}
          title={environment || undefined}>
          <GlowingCircle />
        </Badge>
        <Box
          className={classes.account}
          aria-label={accountIdentifier || ""}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleClick();
            }
          }}>
          {accountIdentifier ? shortAddress(accountIdentifier) : "..."}
        </Box>
        <AppMenu />
      </Group>
    </Flex>
  );
};
