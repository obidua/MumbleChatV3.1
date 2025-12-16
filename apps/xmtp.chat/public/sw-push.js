/**
 * Custom Service Worker extensions for Push Notifications
 * This file is imported by the main service worker
 */

// Handle push events (when notification is received from server)
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  if (!event.data) {
    console.log("[SW] Push event has no data");
    return;
  }

  try {
    const data = event.data.json();

    const title = data.title || "MumbleChat";
    const options = {
      body: data.body || "You have a new message",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      tag: data.tag || `message-${Date.now()}`,
      data: {
        url: data.url || "/conversations",
        conversationId: data.conversationId,
        messageId: data.messageId,
      },
      actions: [
        {
          action: "open",
          title: "Open Chat",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("[SW] Error handling push event:", error);

    // Show a generic notification if parsing fails
    event.waitUntil(
      self.registration.showNotification("MumbleChat", {
        body: "You have a new message",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
      }),
    );
  }
});

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

// Handle push subscription change (e.g., when browser refreshes subscription)
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[SW] Push subscription changed");

  // Re-subscribe with the new subscription
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        // Note: applicationServerKey should be stored/retrieved
      })
      .then((subscription) => {
        // Send new subscription to server
        return fetch("/api/push/resubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEndpoint: event.oldSubscription?.endpoint,
            newSubscription: subscription.toJSON(),
          }),
        });
      })
      .catch((error) => {
        console.error("[SW] Error resubscribing:", error);
      }),
  );
});

console.log("[SW] Push notification handlers registered");
