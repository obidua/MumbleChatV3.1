import { ActionIcon, Flex, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./IOSInstallPrompt.module.css";

export const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const isSafari =
      /Safari/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    // Check if user has dismissed before
    const dismissed = localStorage.getItem("ios-pwa-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed =
      (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if on iOS Safari, not in standalone mode, and not recently dismissed
    if (
      isIOS &&
      isSafari &&
      !isInStandaloneMode &&
      (!dismissed || daysSinceDismissed > 7)
    ) {
      // Show prompt immediately for better visibility
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("ios-pwa-install-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={classes.iosInstallPrompt}>
      <Flex direction="column" gap="sm" className={classes.content}>
        <Flex justify="space-between" align="flex-start">
          <Text size="sm" fw={700} className={classes.title}>
            Install MumbleChat
          </Text>
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={handleDismiss}
            className={classes.closeButton}
            aria-label="Dismiss">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </ActionIcon>
        </Flex>

        <Text size="xs" className={classes.description}>
          Add to your home screen for the best experience:
        </Text>

        <Flex direction="column" gap="xs" className={classes.steps}>
          <Flex align="center" gap="sm">
            <div className={classes.stepIcon}>
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <Text size="xs" className={classes.stepText}>
              1. Tap the <strong>Share</strong> button below
            </Text>
          </Flex>

          <Flex align="center" gap="sm">
            <div className={classes.stepIcon}>
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <Text size="xs" className={classes.stepText}>
              2. Scroll and tap <strong>"Add to Home Screen"</strong>
            </Text>
          </Flex>

          <Flex align="center" gap="sm">
            <div className={classes.stepIcon}>
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <Text size="xs" className={classes.stepText}>
              3. Tap <strong>"Add"</strong> to confirm
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
