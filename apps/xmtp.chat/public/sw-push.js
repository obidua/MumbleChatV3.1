/**
 * Custom Service Worker extensions for Notifications
 * Decentralized - NO backend required
 * Works with Ramapay and other decentralized wallets
 */

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked");

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Get the URL to open
  const urlToOpen = event.notification.data?.url || "/conversations";

  event.waitUntil(
    // Check if there's already a window open
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if ("navigate" in client) {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      }),
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification closed");
});

// Handle Background Sync (for periodic message checking without backend)
self.addEventListener("sync", (event) => {
  console.log("[SW] Background Sync event:", event.tag);

  if (event.tag === "check-messages") {
    event.waitUntil(notifyClientsToCheckMessages());
  }
});

// Handle Periodic Background Sync (if available)
self.addEventListener("periodicsync", (event) => {
  console.log("[SW] Periodic Background Sync event:", event.tag);

  if (event.tag === "check-messages-periodic") {
    event.waitUntil(notifyClientsToCheckMessages());
  }
});

// Notify all clients to check for new messages
async function notifyClientsToCheckMessages() {
  try {
    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    for (const client of clients) {
      client.postMessage({
        type: "CHECK_MESSAGES",
        timestamp: Date.now(),
      });
    }

    console.log("[SW] Notified", clients.length, "clients to check messages");
  } catch (error) {
    console.error("[SW] Error notifying clients:", error);
  }
}

// Handle messages from the main app
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data?.type);

  if (event.data?.type === "SHOW_NOTIFICATION") {
    // Show notification from app
    const { title, body, icon, tag, data } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      icon: icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      tag: tag || `message-${Date.now()}`,
      data,
      requireInteraction: false,
      silent: false,
    });
  }

  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log(
  "[SW] Decentralized notification handlers registered (no backend required)",
);
