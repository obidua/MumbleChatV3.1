import { Button, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { IconDownload } from "@/icons/IconDownload";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      "standalone" in window.navigator
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app was already installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = useCallback(() => {
    if (!deferredPrompt) {
      return;
    }

    void (async () => {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
      setIsInstallable(false);
    })();
  }, [deferredPrompt]);

  // Don't show button if already installed or not installable
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      leftSection={<IconDownload style={{ width: 16, height: 16 }} />}
      variant="light"
      fullWidth
      size="sm">
      <div style={{ textAlign: "left", flex: 1 }}>
        <Text size="sm" fw={600}>
          Install App
        </Text>
        <Text size="xs" c="dimmed">
          Add MumbleChat to your home screen
        </Text>
      </div>
    </Button>
  );
}
