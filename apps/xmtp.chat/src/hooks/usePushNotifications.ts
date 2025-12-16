import { useCallback, useEffect, useState } from "react";
import { pushNotificationService } from "@/services/pushNotificationService";

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}

/**
 * Hook for managing push notifications
 * Handles subscription to background push notifications
 */
export const usePushNotifications = (
  walletAddress?: string,
  inboxId?: string,
): UsePushNotificationsReturn => {
  const [isSupported] = useState(() =>
    pushNotificationService.isPushSupported(),
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      setIsLoading(true);
      try {
        const subscribed = await pushNotificationService.isSubscribed();
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("[Push] Error checking subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSupported) {
      void checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!walletAddress || !inboxId) {
      console.warn(
        "[Push] Cannot subscribe: wallet address or inbox ID missing",
      );
      return false;
    }

    setIsLoading(true);
    try {
      const success = await pushNotificationService.subscribe(
        walletAddress,
        inboxId,
      );
      setIsSubscribed(success);
      return success;
    } catch (error) {
      console.error("[Push] Error subscribing:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, inboxId]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        setIsSubscribed(false);
      }
      return success;
    } catch (error) {
      console.error("[Push] Error unsubscribing:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
};
