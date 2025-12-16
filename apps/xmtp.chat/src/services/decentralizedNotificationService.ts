/**
 * Decentralized Notification Service
 * Works WITHOUT any backend server - fully client-side
 * Perfect for decentralized wallets like Ramapay
 *
 * Features:
 * 1. Service Worker notifications (works when tab is not focused)
 * 2. Background Sync API (periodically checks for messages when app is backgrounded)
 * 3. Visibility change detection (checks messages when user returns)
 * 4. Keep-alive connection via XMTP streaming
 */

// Check interval for background sync (in milliseconds)
const BACKGROUND_SYNC_INTERVAL = 30000; // 30 seconds
const VISIBILITY_CHECK_DELAY = 1000; // 1 second after tab becomes visible

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: {
    url?: string;
    conversationId?: string;
    messageId?: string;
  };
}

export class DecentralizedNotificationService {
  private static instance: DecentralizedNotificationService | null = null;
  private isSupported = false;
  private permissionGranted = false;
  private backgroundSyncInterval: ReturnType<typeof setInterval> | null = null;
  private lastCheckTime = Date.now();
  private onNewMessageCallback: (() => Promise<void>) | null = null;

  private constructor() {
    this.checkSupport();
    this.setupVisibilityHandler();
    this.setupBackgroundSync();
  }

  static getInstance(): DecentralizedNotificationService {
    if (!DecentralizedNotificationService.instance) {
      DecentralizedNotificationService.instance =
        new DecentralizedNotificationService();
    }
    return DecentralizedNotificationService.instance;
  }

  /**
   * Check if notifications are supported
   */
  private checkSupport(): void {
    this.isSupported = "serviceWorker" in navigator && "Notification" in window;

    if ("Notification" in window) {
      this.permissionGranted = Notification.permission === "granted";
    }

    console.log(
      "[DecentralizedNotification] Supported:",
      this.isSupported,
      "Permission:",
      this.permissionGranted,
    );
  }

  /**
   * Check if notifications are supported
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("[DecentralizedNotification] Notifications not supported");
      return false;
    }

    if (Notification.permission === "granted") {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === "granted";
      return this.permissionGranted;
    }

    return false;
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): NotificationPermission | "unsupported" {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  }

  /**
   * Set callback for checking new messages
   * This is called when app becomes visible or during background sync
   */
  setNewMessageCallback(callback: () => Promise<void>): void {
    this.onNewMessageCallback = callback;
  }

  /**
   * Setup visibility change handler
   * Checks for new messages when user returns to the app
   */
  private setupVisibilityHandler(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        // User came back to the app - check for new messages
        setTimeout(() => {
          this.checkForNewMessages();
        }, VISIBILITY_CHECK_DELAY);
      }
    });

    // Also handle page focus
    window.addEventListener("focus", () => {
      setTimeout(() => {
        this.checkForNewMessages();
      }, VISIBILITY_CHECK_DELAY);
    });
  }

  /**
   * Setup background sync for periodic message checking
   * This runs even when the tab is in background
   */
  private setupBackgroundSync(): void {
    // Clear any existing interval
    if (this.backgroundSyncInterval) {
      clearInterval(this.backgroundSyncInterval);
    }

    // Set up periodic check when tab is backgrounded
    this.backgroundSyncInterval = setInterval(() => {
      // Only check if tab is hidden (background)
      if (document.visibilityState === "hidden") {
        this.checkForNewMessages();
      }
    }, BACKGROUND_SYNC_INTERVAL);

    // Also try to register a real Background Sync if supported
    this.registerBackgroundSync();
  }

  /**
   * Register Background Sync API (if available)
   * This allows checking even after the browser is closed briefly
   */
  private async registerBackgroundSync(): Promise<void> {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Check if Background Sync is supported
      if ("sync" in registration) {
        // @ts-expect-error - sync is not in standard types yet
        await registration.sync.register("check-messages");
        console.log("[DecentralizedNotification] Background Sync registered");
      }

      // Also try Periodic Background Sync (if available)
      // @ts-expect-error - periodicSync is not in standard types yet
      if ("periodicSync" in registration) {
        const status = await navigator.permissions.query({
          // @ts-expect-error - periodic-background-sync not in standard types
          name: "periodic-background-sync",
        });

        if (status.state === "granted") {
          // @ts-expect-error - periodicSync is not in standard types yet
          await registration.periodicSync.register("check-messages-periodic", {
            minInterval: 60 * 1000, // Minimum 1 minute
          });
          console.log(
            "[DecentralizedNotification] Periodic Background Sync registered",
          );
        }
      }
    } catch (error) {
      // Background Sync not supported - fall back to interval
      console.log(
        "[DecentralizedNotification] Background Sync not available, using interval",
      );
    }
  }

  /**
   * Check for new messages and trigger callback
   */
  private async checkForNewMessages(): Promise<void> {
    if (this.onNewMessageCallback) {
      try {
        await this.onNewMessageCallback();
        this.lastCheckTime = Date.now();
      } catch (error) {
        console.error(
          "[DecentralizedNotification] Error checking messages:",
          error,
        );
      }
    }
  }

  /**
   * Show a notification using Service Worker (better for background)
   */
  async showNotification(notification: NotificationData): Promise<void> {
    if (!this.permissionGranted) {
      console.log("[DecentralizedNotification] Permission not granted");
      return;
    }

    // Don't show if tab is focused
    if (document.hasFocus()) {
      return;
    }

    try {
      // Try Service Worker notification first (works better in background)
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag: notification.tag || `message-${Date.now()}`,
          data: notification.data,
          requireInteraction: false,
          silent: false,
        });
        return;
      }

      // Fallback to regular Notification API
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || "/icons/icon-192x192.png",
        tag: notification.tag || `message-${Date.now()}`,
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notif.close();
      }, 5000);
    } catch (error) {
      console.error(
        "[DecentralizedNotification] Error showing notification:",
        error,
      );
    }
  }

  /**
   * Show notification for a new message
   */
  showMessageNotification(options: {
    senderName: string;
    messagePreview: string;
    conversationId: string;
    messageId?: string;
  }): void {
    void this.showNotification({
      title: `New message from ${options.senderName}`,
      body: options.messagePreview,
      tag: `message-${options.conversationId}`,
      data: {
        url: `/dm/${options.conversationId}`,
        conversationId: options.conversationId,
        messageId: options.messageId,
      },
    });
  }

  /**
   * Get time since last check
   */
  getTimeSinceLastCheck(): number {
    return Date.now() - this.lastCheckTime;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.backgroundSyncInterval) {
      clearInterval(this.backgroundSyncInterval);
      this.backgroundSyncInterval = null;
    }
  }
}

export const decentralizedNotificationService =
  DecentralizedNotificationService.getInstance();
