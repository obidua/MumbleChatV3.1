import {
  ActionIcon,
  Button,
  Paper,
  Stack,
  Text,
  useMatches,
} from "@mantine/core";
import { useCallback } from "react";
import { Connect } from "@/components/App/Connect";
import { useMobile } from "@/hooks/useMobile";
import { IconBack } from "@/icons/IconBack";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "./Welcome.module.css";

export const Welcome = () => {
  const px = useMatches({
    base: "6%",
    sm: "10%",
    md: "18%",
  });
  const isMobile = useMobile();

  const handleBackToWebsite = useCallback(() => {
    window.location.href = "/";
  }, []);

  return (
    <Stack
      gap="xl"
      py={isMobile ? 24 : 48}
      px={px}
      className={classes.container}
      align="center"
      justify="center">
      {/* Back to Website Button */}
      <div className={classes.backButton}>
        {isMobile ? (
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={handleBackToWebsite}
            className={classes.backIcon}
            aria-label="Back to website">
            <IconBack />
          </ActionIcon>
        ) : (
          <Button
            variant="subtle"
            leftSection={<IconBack />}
            onClick={handleBackToWebsite}
            className={classes.backButtonDesktop}>
            Back to Website
          </Button>
        )}
      </div>

      {/* Hero Section */}
      <Stack gap="md" align="center" className={classes.hero}>
        <div className={classes.logoWrapper}>
          <MumbleChatLogo className={classes.logo} />
        </div>
        <Text className={classes.brandName}>MumbleChat</Text>
        <Text className={classes.tagline}>⚡ Decentralized Messaging</Text>
        <Text
          size="sm"
          c="dimmed"
          ta="center"
          maw={500}
          className={classes.heroDescription}>
          Connect your wallet to start secure, private conversations on the
          decentralized web. No email, no phone number—just your wallet.
        </Text>
      </Stack>

      {/* Connection Card */}
      <Paper className={classes.welcomeCard}>
        <Stack gap="lg">
          <Stack gap={6}>
            <Text className={classes.cardTitle}>Get Started</Text>
            <Text className={classes.cardDescription}>
              Follow these simple steps to connect and start messaging
            </Text>
          </Stack>
          <Connect />
          <Text className={classes.disclaimer}>
            By connecting, you agree to the MumbleChat Terms of Service and
            Privacy Policy.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};
