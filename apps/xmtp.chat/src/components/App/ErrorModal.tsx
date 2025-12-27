import { Box, Button, Group, Stack, Tabs, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AutoRevokeInstallations } from "@/components/App/AutoRevokeInstallations";
import { CodeWithCopy } from "@/components/CodeWithCopy";
import { Modal } from "@/components/Modal";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { ContentLayout } from "@/layouts/ContentLayout";

export const ErrorModal: React.FC = () => {
  const [unhandledRejectionError, setUnhandledRejectionError] =
    useState<Error | null>(null);
  const fullScreen = useCollapsedMediaQuery();
  const contentHeight = fullScreen ? "auto" : 500;
  const navigate = useNavigate();

  // Check if this is an installation limit error
  const isInstallationLimitError = useMemo(() => {
    if (!unhandledRejectionError) return false;
    const message = unhandledRejectionError.message || "";
    return (
      message.includes("already registered 10/10 installations") ||
      message.includes("Maximum XMTP installations")
    );
  }, [unhandledRejectionError]);

  // Check if an error should be suppressed (not shown to user)
  const shouldSuppressError = (error: Error | unknown): boolean => {
    const errorMessage = String(
      error instanceof Error ? error.message : error || "",
    );
    const errorString = String(error || "");

    // Service Worker errors - these are recoverable and shouldn't bother the user
    if (
      errorMessage.includes("ServiceWorker") ||
      errorMessage.includes("service worker") ||
      errorMessage.includes("Failed to update a ServiceWorker") ||
      errorMessage.includes("invalid state") ||
      errorMessage.includes("The object is in an invalid state") ||
      errorString.includes("ServiceWorker")
    ) {
      console.log("[xmtp.chat] Suppressed SW error from UI:", errorMessage);
      return true;
    }

    // Network errors during idle - these are transient
    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError") ||
      errorMessage.includes("net::ERR_")
    ) {
      console.log("[xmtp.chat] Suppressed network error from UI:", errorMessage);
      return true;
    }

    // Extension/third-party errors
    if (
      errorMessage.includes("Extension context invalidated") ||
      errorMessage.includes("chrome-extension://")
    ) {
      console.log("[xmtp.chat] Suppressed extension error from UI:", errorMessage);
      return true;
    }

    return false;
  };

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason as Error;
      
      // Check if this error should be suppressed
      if (shouldSuppressError(error)) {
        // Prevent the error from propagating further
        event.preventDefault();
        return;
      }
      
      setUnhandledRejectionError(error);
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  const footer = useMemo(() => {
    return (
      <Group justify="space-between" flex={1} p="md" wrap="wrap" gap="sm">
        {!isInstallationLimitError && (
          <Button
            variant="default"
            component="a"
            href="https://github.com/xmtp/xmtp-js/issues/new/choose"
            target="_blank"
            size="sm">
            Report issue
          </Button>
        )}
        <Group gap="sm" ml="auto">
          <Button
            size="sm"
            onClick={() => {
              setUnhandledRejectionError(null);
            }}>
            {isInstallationLimitError ? "Close" : "OK"}
          </Button>
        </Group>
      </Group>
    );
  }, [isInstallationLimitError]);

  return unhandledRejectionError ? (
    <Modal
      opened={!!unhandledRejectionError}
      onClose={() => {
        setUnhandledRejectionError(null);
      }}
      fullScreen={fullScreen}
      closeOnEscape={false}
      closeOnClickOutside={false}
      withCloseButton={false}
      padding={0}
      centered>
      <ContentLayout
        title={isInstallationLimitError ? "Installation Limit Reached" : "Application error"}
        maxHeight={contentHeight}
        footer={footer}
        withScrollFade={false}
        withScrollAreaPadding={false}>
        <Box p="md">
          {isInstallationLimitError ? (
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                You've reached the maximum number of XMTP installations (10/10) for this wallet.
              </Text>
              
              <AutoRevokeInstallations
                onSuccess={() => {
                  // Will reload the page from the component
                }}
                onError={(error) => {
                  console.error("Auto-revoke failed:", error);
                }}
              />

              <Text size="xs" c="dimmed" ta="center" mt="sm">
                Or manually manage at{" "}
                <Text
                  component="span"
                  c="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setUnhandledRejectionError(null);
                    navigate("/inbox-tools");
                  }}>
                  Installation Management
                </Text>
              </Text>
            </Stack>
          ) : (
            <Tabs defaultValue="message">
              <Tabs.List>
                <Tabs.Tab value="message">Message</Tabs.Tab>
                <Tabs.Tab value="stackTrace">Stack trace</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="message" py="md">
                <CodeWithCopy code={unhandledRejectionError.message} />
              </Tabs.Panel>
              <Tabs.Panel value="stackTrace" py="md">
                <CodeWithCopy
                  code={
                    unhandledRejectionError.stack ?? "Stack trace not available"
                  }
                />
              </Tabs.Panel>
            </Tabs>
          )}
        </Box>
      </ContentLayout>
    </Modal>
  ) : null;
};
