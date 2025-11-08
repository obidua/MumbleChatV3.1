import { useCallback, useEffect, useState } from "react";
import { notificationService } from "@/services/notificationService";

export const useNotifications = () => {
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >(notificationService.getPermissionStatus());
  const [enabled, setEnabledState] = useState(notificationService.isEnabled());
  const [soundEnabled, setSoundEnabledState] = useState(
    notificationService.isSoundEnabled(),
  );

  useEffect(() => {
    // Update permission status on mount and when visibility changes
    const updatePermission = () => {
      setPermission(notificationService.getPermissionStatus());
    };

    document.addEventListener("visibilitychange", updatePermission);
    window.addEventListener("focus", updatePermission);

    return () => {
      document.removeEventListener("visibilitychange", updatePermission);
      window.removeEventListener("focus", updatePermission);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission();
    setPermission(notificationService.getPermissionStatus());
    return granted;
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    notificationService.setEnabled(value);
    setEnabledState(value);
  }, []);

  const setSoundEnabled = useCallback((value: boolean) => {
    notificationService.setSoundEnabled(value);
    setSoundEnabledState(value);
  }, []);

  const showTestNotification = useCallback(async () => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        return false;
      }
    }
    notificationService.showTestNotification();
    return true;
  }, [permission, requestPermission]);

  return {
    permission,
    enabled,
    soundEnabled,
    requestPermission,
    setEnabled,
    setSoundEnabled,
    showTestNotification,
    isSupported: permission !== "unsupported",
  };
};
