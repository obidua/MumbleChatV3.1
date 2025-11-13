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
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isFullscreen || isIOSStandalone) {
      console.log("PWA: Already installed", { isStandalone, isFullscreen, isIOSStandalone });
      setShowPrompt(false);
      return;
    }

    // Enhanced Android detection
    const isAndroid = /android/i.test(navigator.userAgent);
    const isChrome = /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
    const isSamsung = /samsungbrowser/i.test(navigator.userAgent);

    console.log("PWA: Device Detection", {
      isAndroid,
      isChrome,
      isSamsung,
      userAgent: navigator.userAgent,
    });

    const handler = (e: Event) => {
      console.log("PWA: ✅ beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      console.log("PWA: Days since dismissed:", daysSinceDismissed);

      // Show prompt more aggressively on Android
      // Only respect dismissal if it's been less than 3 days on Android, 7 on others
      const dismissalThreshold = isAndroid ? 3 : 7;

      if (!dismissed || daysSinceDismissed > dismissalThreshold) {
        console.log("PWA: ✅ Showing install prompt");
        // Shorter delay on Android for immediate visibility
        setTimeout(() => {
          setShowPrompt(true);
        }, isAndroid ? 1000 : 2000);
      } else {
        console.log(
          `PWA: ❌ Not showing - recently dismissed (less than ${dismissalThreshold} days)`,
        );
      }
    };

    console.log("PWA: 👂 Listening for beforeinstallprompt event");
    console.log("PWA: User Agent:", navigator.userAgent);
    console.log("PWA: Display Mode:", window.matchMedia("(display-mode: browser)").matches ? "browser" : "standalone/fullscreen");
    console.log("PWA: Protocol:", window.location.protocol);
    console.log("PWA: Hostname:", window.location.hostname);

    window.addEventListener("beforeinstallprompt", handler);

    // Also listen for app installed event
    const appInstalledHandler = () => {
      console.log("PWA: ✅ App installed successfully!");
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Clear dismissal flag since app is now installed
      localStorage.removeItem("pwa-install-dismissed");
    };

    window.addEventListener("appinstalled", appInstalledHandler);

    // Debug: Check manifest availability after 2 seconds
    setTimeout(() => {
      fetch("/manifest.webmanifest")
        .then((res) => {
          console.log("PWA: Manifest fetch status:", res.status, res.ok ? "✅" : "❌");
          return res.json();
        })
        .then((manifest) => {
          console.log("PWA: Manifest loaded:", manifest);
        })
        .catch((err) => {
          console.error("PWA: ❌ Manifest fetch error:", err);
        });
    }, 2000);

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
