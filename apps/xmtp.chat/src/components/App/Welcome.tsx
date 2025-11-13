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
