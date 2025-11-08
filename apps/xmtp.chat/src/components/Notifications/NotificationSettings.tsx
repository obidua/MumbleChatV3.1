import { Button, Group, Stack, Switch, Text } from "@mantine/core";
import { useCallback } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationSettings: React.FC = () => {
  const {
    permission,
    enabled,
    soundEnabled,
    requestPermission,
    setEnabled,
    setSoundEnabled,
    showTestNotification,
    isSupported,
  } = useNotifications();

  const handleToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.checked;

      if (newValue) {
        // User wants to enable notifications
        if (permission !== "granted") {
          // Need to request permission first
          void requestPermission().then((granted) => {
            if (granted) {
              setEnabled(true);
            }
          });
        } else {
          // Permission already granted, just enable
          setEnabled(true);
        }
      } else {
        // User wants to disable notifications
        setEnabled(false);
      }
    },
    [permission, requestPermission, setEnabled],
  );

  const handleSoundToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSoundEnabled(event.currentTarget.checked);
    },
    [setSoundEnabled],
  );

  const handleTest = useCallback(() => {
    void showTestNotification();
  }, [showTestNotification]);

  if (!isSupported) {
    return (
      <Text size="sm" c="dimmed">
        Notifications are not supported in this browser
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <div>
          <Text size="sm" fw={600}>
            Message Notifications
          </Text>
          <Text size="xs" c="dimmed">
            Get notified when you receive new messages
          </Text>
        </div>
        <Switch
          checked={enabled}
          onChange={handleToggle}
          disabled={permission === "denied"}
        />
      </Group>

      {permission === "denied" && (
        <Text size="xs" c="red">
          Notifications are blocked. Please enable them in your browser
          settings.
        </Text>
      )}

      {permission === "default" && (
        <Text size="xs" c="dimmed">
          Enable notifications to receive alerts for new messages
        </Text>
      )}

      {permission === "granted" && enabled && (
        <>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" fw={600}>
                Notification Sounds
              </Text>
              <Text size="xs" c="dimmed">
                Play sound when receiving messages
              </Text>
            </div>
            <Switch checked={soundEnabled} onChange={handleSoundToggle} />
          </Group>

          <Button size="xs" variant="light" onClick={handleTest}>
            Send Test Notification
          </Button>
        </>
      )}
    </Stack>
  );
};
