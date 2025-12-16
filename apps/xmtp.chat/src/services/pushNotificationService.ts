/**
 * Push Notification Service
 * Handles Web Push API for background notifications
 * Works even when app is closed or in background (Ramapay, etc.)
 */

// VAPID public key - you need to generate this and store private key on server
// Generate keys at: https://vapidkeys.com/ or use: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY: string =
  (import.meta.env.VITE_VAPID_PUBLIC_KEY as string) || "";

// Your backend API endpoint for push subscriptions
const PUSH_API_ENDPOINT: string =
  (import.meta.env.VITE_PUSH_API_ENDPOINT as string) || "/api/push";

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  walletAddress: string;
  inboxId: string;
}

export class PushNotificationService {
  private static instance: PushNotificationService | null = null;
  private subscription: PushSubscription | null = null;
  private isSupported = false;

  private constructor() {
    this.checkSupport();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Check if Push Notifications are supported
   */
  private checkSupport(): void {
    this.isSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    console.log("[Push] Push notifications supported:", this.isSupported);
  }

  /**
   * Check if push is supported in this environment
   */
  isPushSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if already subscribed
   */
  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error("[Push] Error checking subscription:", error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(walletAddress: string, inboxId: string): Promise<boolean> {
    if (!this.isSupported) {
      console.log("[Push] Push not supported in this browser");
      return false;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.warn("[Push] VAPID public key not configured");
      return false;
    }

    try {
      // Request notification permission first
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("[Push] Notification permission denied");
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription with proper typing
        const applicationServerKey =
          this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
        });
        console.log("[Push] New subscription created");
      }

      this.subscription = subscription;

      // Send subscription to backend
      await this.sendSubscriptionToServer({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")),
        },
        walletAddress,
        inboxId,
      });

      console.log("[Push] Successfully subscribed to push notifications");
      return true;
    } catch (error) {
      console.error("[Push] Error subscribing to push:", error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notify server to remove subscription
        await this.removeSubscriptionFromServer(subscription.endpoint);

        this.subscription = null;
        console.log("[Push] Successfully unsubscribed from push notifications");
        return true;
      }
      return false;
    } catch (error) {
      console.error("[Push] Error unsubscribing:", error);
      return false;
    }
  }

  /**
   * Send subscription to backend server
   */
  private async sendSubscriptionToServer(
    data: PushSubscriptionData,
  ): Promise<void> {
    try {
      const response = await fetch(`${PUSH_API_ENDPOINT}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      console.log("[Push] Subscription sent to server");
    } catch (error) {
      console.error("[Push] Error sending subscription to server:", error);
      // Don't throw - subscription is still valid locally
    }
  }

  /**
   * Remove subscription from backend server
   */
  private async removeSubscriptionFromServer(endpoint: string): Promise<void> {
    try {
      await fetch(`${PUSH_API_ENDPOINT}/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      });
    } catch (error) {
      console.error("[Push] Error removing subscription from server:", error);
    }
  }

  /**
   * Convert VAPID public key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Convert ArrayBuffer to Base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  /**
   * Show a local notification (for when app is open)
   * This is a fallback for when push is not available
   */
  async showLocalNotification(
    title: string,
    options: NotificationOptions,
  ): Promise<void> {
    if (!this.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        ...options,
        icon: options.icon || "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        requireInteraction: false,
        silent: false,
      });
    } catch (error) {
      console.error("[Push] Error showing local notification:", error);
    }
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
