import { ActionIcon, Button, Flex, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./InstallPrompt.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("PWA: Already installed");
      setShowPrompt(false);
      return;
    }

    // Also check for fullscreen mode
    if (window.matchMedia("(display-mode: fullscreen)").matches) {
      console.log("PWA: Already installed (fullscreen)");
      setShowPrompt(false);
      return;
    }

    const handler = (e: Event) => {
      console.log("PWA: beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      console.log("PWA: Days since dismissed:", daysSinceDismissed);

      // Show prompt immediately on Android for better visibility
      // Only respect dismissal if it's been less than 7 days (increased from 1 day)
      if (!dismissed || daysSinceDismissed > 7) {
        console.log("PWA: Showing install prompt");
        // Show prompt after a short delay to ensure page is loaded
        setTimeout(() => {
          setShowPrompt(true);
        }, 2000);
      } else {
        console.log(
          "PWA: Not showing - recently dismissed (less than 7 days)",
        );
      }
    };

    console.log("PWA: Listening for beforeinstallprompt event");
    console.log("PWA: User Agent:", navigator.userAgent);
    console.log(
      "PWA: Display Mode:",
      window.matchMedia("(display-mode: browser)").matches
        ? "browser"
        : "standalone/fullscreen",
    );

    window.addEventListener("beforeinstallprompt", handler);

    // Also listen for app installed event
    const appInstalledHandler = () => {
      console.log("PWA: App installed successfully!");
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Clear dismissal flag since app is now installed
      localStorage.removeItem("pwa-install-dismissed");
    };

    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className={classes.installPrompt}>
      <Flex
        align="center"
        justify="space-between"
        gap="md"
        className={classes.content}>
        <div className={classes.iconWrapper}>
          <svg
            className={classes.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className={classes.textContent}>
          <Text size="sm" fw={700} className={classes.title}>
            Install MumbleChat
          </Text>
          <Text size="xs" className={classes.description}>
            Add to home screen for the best experience
          </Text>
        </div>

        <Group gap="xs">
          <Button
            size="xs"
            variant="gradient"
            gradient={{ from: "#10b981", to: "#0d9488" }}
            onClick={() => void handleInstall()}
            className={classes.installButton}>
            Install
          </Button>
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
        </Group>
      </Flex>
    </div>
  );
};
