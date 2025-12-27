import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@/assets/mobile.css";
import { QueryClientProvider } from "@tanstack/react-query";
import pkg from "@xmtp/browser-sdk/package.json";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { registerSW } from "virtual:pwa-register";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  lens,
  lensTestnet,
  linea,
  lineaSepolia,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
  worldchain,
  worldchainSepolia,
  zksync,
  zksyncSepoliaTestnet,
} from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "wagmi/connectors";
import { ramestta } from "@/chains/ramestta";
import { App } from "@/components/App/App";
import { XMTPProvider } from "@/contexts/XMTPContext";
import { queryClient } from "@/helpers/queries";

// Prioritize most commonly used chains first for faster initial connection
// Other chains will still be available but load with lower priority
export const config = createConfig({
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "xmtp.chat",
    }),
    metaMask(),
    walletConnect({ projectId: import.meta.env.VITE_PROJECT_ID }),
  ],
  // Prioritized chains: most popular first for faster Android wallet connection
  chains: [
    ramestta, // Primary chain
    polygon, // Popular mainnet
    base, // Popular L2
    arbitrum, // Popular L2
    optimism, // Popular L2
    sepolia, // Common testnet
    // Secondary chains
    baseSepolia,
    polygonAmoy,
    arbitrumSepolia,
    optimismSepolia,
    linea,
    lineaSepolia,
    worldchain,
    worldchainSepolia,
    zksync,
    zksyncSepoliaTestnet,
    lens,
    lensTestnet,
  ],
  transports: {
    // Use batch: false for faster initial connection on mobile
    [ramestta.id]: http({ batch: false }),
    [polygon.id]: http({ batch: false }),
    [base.id]: http({ batch: false }),
    [arbitrum.id]: http({ batch: false }),
    [optimism.id]: http({ batch: false }),
    [sepolia.id]: http({ batch: false }),
    // Regular batching for secondary chains
    [baseSepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
    [worldchain.id]: http(),
    [worldchainSepolia.id]: http(),
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
    [lens.id]: http(),
    [lensTestnet.id]: http(),
  },
  // Reduce connection timeout for faster mobile experience
  multiInjectedProviderDiscovery: true, // Enable EIP-6963 to detect all installed wallets
  syncConnectedChain: false, // Don't auto-sync on load, reduces initial requests
});

const theme = createTheme({
  fontSizes: {
    xxs: "calc(0.6875rem * var(--mantine-scale))",
  },
  lineHeights: {
    xxs: "1.2",
  },
  spacing: {
    xxs: "calc(0.5rem * var(--mantine-scale))",
    xxxs: "calc(0.25rem * var(--mantine-scale))",
  },
  primaryColor: "blue",
  colors: {
    // Telegram-inspired blue palette
    blue: [
      "#e3f2fd",
      "#bbdefb",
      "#90caf9",
      "#64b5f6",
      "#42a5f5",
      "#2196f3", // Primary Telegram blue
      "#1e88e5",
      "#1976d2",
      "#1565c0",
      "#0d47a1",
    ],
    // Soft accent colors
    teal: [
      "#e0f7fa",
      "#b2ebf2",
      "#80deea",
      "#4dd0e1",
      "#26c6da",
      "#00bcd4", // Accent teal
      "#00acc1",
      "#0097a7",
      "#00838f",
      "#006064",
    ],
    // Clean grays for UI elements
    dark: [
      "#f8f9fa",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#6c757d",
      "#495057",
      "#343a40",
      "#212529",
      "#0f1419", // Deep background
    ],
  },
  components: {
    Button: {
      styles: () => ({
        root: {
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          fontWeight: 500,
          letterSpacing: "0.01em",
        },
      }),
      defaultProps: {
        radius: "lg",
      },
    },
    Badge: {
      styles: {
        root: {
          fontWeight: 500,
          letterSpacing: "0.01em",
        },
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        radius: "lg",
      },
    },
    TextInput: {
      styles: {
        input: {
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:focus": {
            borderColor: "rgba(33, 150, 243, 0.5)",
            boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.08)",
          },
        },
      },
    },
    Textarea: {
      styles: {
        input: {
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:focus": {
            borderColor: "rgba(33, 150, 243, 0.5)",
            boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.08)",
          },
        },
      },
    },
    Accordion: {
      styles: {
        control: {
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "rgba(33, 150, 243, 0.06)",
          },
        },
        item: {
          border: "1px solid rgba(33, 150, 243, 0.1)",
          background: "rgba(15, 20, 25, 0.6)",
          "&[data-active]": {
            borderColor: "rgba(33, 150, 243, 0.2)",
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <XMTPProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </XMTPProvider>
      </MantineProvider>
    </QueryClientProvider>
  </WagmiProvider>,
);

console.log("[xmtp.chat] XMTP Browser SDK version:", pkg.version);

// Register service worker for PWA with better Android support and idle handling
if ("serviceWorker" in navigator) {
  // Log environment info for debugging
  console.log("[xmtp.chat] User Agent:", navigator.userAgent);
  console.log("[xmtp.chat] Platform:", navigator.platform);
  console.log("[xmtp.chat] Is Android:", /android/i.test(navigator.userAgent));
  console.log(
    "[xmtp.chat] Is iOS:",
    /iphone|ipad|ipod/i.test(navigator.userAgent),
  );
  console.log(
    "[xmtp.chat] Is Standalone:",
    window.matchMedia("(display-mode: standalone)").matches,
  );

  // Track if SW registration is in progress to prevent duplicate attempts
  let isRegistering = false;
  let updateCheckInterval: ReturnType<typeof setInterval> | null = null;

  // Safe service worker update check - handles invalid state errors gracefully
  const safeUpdateCheck = async (registration: ServiceWorkerRegistration) => {
    try {
      await registration.update();
    } catch (error) {
      // Silently handle update errors - these are common after long idle periods
      // The browser will auto-recover on next page load
      console.log("[xmtp.chat] SW update check skipped (tab was idle)");
    }
  };

  // Register service worker with error recovery
  const registerServiceWorker = () => {
    if (isRegistering) return;
    isRegistering = true;

    registerSW({
      immediate: true,
      onRegisteredSW(swUrl, registration) {
        isRegistering = false;
        if (registration) {
          console.log(
            "[xmtp.chat] Service worker registered successfully:",
            swUrl ?? registration.scope,
          );
          console.log(
            "[xmtp.chat] Service worker state:",
            registration.active?.state,
          );

          // Clear existing interval if any
          if (updateCheckInterval) {
            clearInterval(updateCheckInterval);
          }

          // Check for updates periodically with safe error handling
          updateCheckInterval = setInterval(
            () => {
              void safeUpdateCheck(registration);
            },
            60 * 60 * 1000,
          ); // Check every hour
        }
      },
      onRegisterError(error) {
        isRegistering = false;
        // Silently log the error - don't show to user
        // Service worker errors after idle are normal and recoverable
        console.log("[xmtp.chat] SW registration skipped:", error?.message || error);
        
        // Try to recover by unregistering stale workers
        void recoverFromSWError();
      },
    });
  };

  // Recovery function for stale service worker states
  const recoverFromSWError = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        // Check if the service worker is in an invalid state
        if (!registration.active && !registration.installing && !registration.waiting) {
          console.log("[xmtp.chat] Cleaning up stale SW registration");
          await registration.unregister();
        }
      }
    } catch (error) {
      // Silently ignore - browser will handle on next load
      console.log("[xmtp.chat] SW cleanup skipped");
    }
  };

  // Handle visibility change - when tab becomes visible after being idle
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // Tab became visible again - check SW health
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          // Safely check for updates when tab becomes active
          void safeUpdateCheck(registration);
        } else {
          // No registration found - try to re-register
          console.log("[xmtp.chat] Re-registering SW after idle");
          registerServiceWorker();
        }
      }).catch(() => {
        // Silently ignore - SW API may be temporarily unavailable
      });
    }
  });

  // Handle online/offline transitions
  window.addEventListener("online", () => {
    console.log("[xmtp.chat] Network online - checking SW");
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        void safeUpdateCheck(registration);
      }
    }).catch(() => {
      // Silently ignore
    });
  });

  // Initial registration
  registerServiceWorker();

  // Listen for service worker updates with error handling
  navigator.serviceWorker.ready
    .then((registration) => {
      console.log("[xmtp.chat] Service worker is ready");

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        console.log("[xmtp.chat] New service worker found, installing...");

        newWorker?.addEventListener("statechange", () => {
          console.log("[xmtp.chat] Service worker state:", newWorker.state);
          
          // When new SW is activated, it will take control automatically
          // No reload prompt needed - the app continues working
          if (newWorker.state === "activated") {
            console.log("[xmtp.chat] New service worker activated silently");
          }
        });
      });
    })
    .catch((error) => {
      // Silently handle - this can happen after long idle periods
      console.log("[xmtp.chat] SW ready check deferred");
    });

  // Global error handler for unhandled SW-related errors
  window.addEventListener("unhandledrejection", (event) => {
    const errorMessage = String(event.reason?.message || event.reason || "");
    
    // Check if this is a Service Worker related error
    if (
      errorMessage.includes("ServiceWorker") ||
      errorMessage.includes("service worker") ||
      errorMessage.includes("invalid state") ||
      errorMessage.includes("Failed to update")
    ) {
      // Prevent the error from showing to the user
      event.preventDefault();
      console.log("[xmtp.chat] SW error handled silently:", errorMessage);
      
      // Attempt silent recovery
      void recoverFromSWError();
    }
  });
}

// Detect if PWA install is available (for debugging Android issues)
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("[xmtp.chat] beforeinstallprompt event fired!");
  console.log("[xmtp.chat] PWA install available");
  // Don't prevent default here - let the InstallPrompt component handle it
});
