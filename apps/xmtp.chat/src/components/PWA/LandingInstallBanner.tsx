import { Button, Group, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconDownload } from "@/icons/IconDownload";
import classes from "./LandingInstallBanner.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const LandingInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches
    ) {
      console.log("PWA: Already installed - hiding banner");
      return;
    }

    const handler = (e: Event) => {
      console.log("PWA: beforeinstallprompt fired - showing banner");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user dismissed banner
      const dismissed = localStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      console.log("PWA: App installed - hiding banner");
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`PWA: User ${outcome} the install prompt`);

      if (outcome === "accepted") {
        console.log("PWA: Installation accepted");
      }

      setDeferredPrompt(null);
      setShowBanner(false);
    } catch (error) {
      console.error("PWA: Install error:", error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <Paper className={classes.banner} shadow="md" p="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <div className={classes.icon}>
            <IconDownload style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <Text size="sm" fw={700} className={classes.title}>
              Install MumbleChat App
            </Text>
            <Text size="xs" c="dimmed">
              Get the full app experience with offline support and push
              notifications
            </Text>
          </div>
        </Group>
        <Group gap="xs" wrap="nowrap">
          <Button
            onClick={() => void handleInstall()}
            variant="gradient"
            gradient={{ from: "#10b981", to: "#0d9488" }}
            size="sm">
            Install
          </Button>
          <Button onClick={handleDismiss} variant="subtle" size="sm" c="dimmed">
            Later
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};
