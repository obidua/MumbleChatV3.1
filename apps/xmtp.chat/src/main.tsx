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

export const config = createConfig({
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "xmtp.chat",
    }),
    metaMask(),
    walletConnect({ projectId: import.meta.env.VITE_PROJECT_ID }),
  ],
  chains: [
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    linea,
    lineaSepolia,
    ramestta,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
    sepolia,
    worldchain,
    worldchainSepolia,
    zksync,
    zksyncSepoliaTestnet,
    lens,
    lensTestnet,
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
    [ramestta.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
    [worldchain.id]: http(),
    [worldchainSepolia.id]: http(),
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
    [lens.id]: http(),
    [lensTestnet.id]: http(),
  },
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

// Register service worker for PWA (handled by vite-plugin-pwa helper)
if ("serviceWorker" in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        console.log(
          "[xmtp.chat] Service worker registered:",
          swUrl ?? registration.scope,
        );
        // keep the worker fresh without waiting for a reload
        setInterval(
          () => {
            void registration.update();
          },
          60 * 60 * 1000,
        );
      }
    },
    onRegisterError(error) {
      console.error("[xmtp.chat] Service worker registration failed:", error);
    },
  });
}
