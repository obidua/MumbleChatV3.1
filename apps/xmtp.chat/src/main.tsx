import "@mantine/core/styles.css";
import "@/assets/mobile.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import pkg from "@xmtp/browser-sdk/package.json";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
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
  primaryColor: "cyan",
  colors: {
    cyan: [
      "#e6fffe",
      "#d1fffc",
      "#a8fff9",
      "#7afff5",
      "#50fff2",
      "#0afff1", // Primary cyan
      "#00e6d8",
      "#00ccbf",
      "#00b3a7",
      "#009a8e",
    ],
    purple: [
      "#f5f0ff",
      "#e9ddff",
      "#d4b8ff",
      "#be92ff",
      "#a86fff",
      "#9772fb", // Primary purple
      "#8960e8",
      "#7b4ed5",
      "#6d3cc2",
      "#5f2aaf",
    ],
  },
  components: {
    Button: {
      styles: () => ({
        root: {
          transition: "all 0.2s ease",
          fontWeight: 600,
        },
      }),
      defaultProps: {
        radius: "md",
      },
    },
    Badge: {
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.02em",
        },
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        radius: "md",
      },
    },
    TextInput: {
      styles: {
        input: {
          transition: "all 0.2s ease",
          "&:focus": {
            borderColor: "rgba(10, 255, 241, 0.4)",
            boxShadow: "0 0 0 2px rgba(10, 255, 241, 0.1)",
          },
        },
      },
    },
    Textarea: {
      styles: {
        input: {
          transition: "all 0.2s ease",
          "&:focus": {
            borderColor: "rgba(10, 255, 241, 0.4)",
            boxShadow: "0 0 0 2px rgba(10, 255, 241, 0.1)",
          },
        },
      },
    },
    Accordion: {
      styles: {
        control: {
          transition: "all 0.2s ease",
          "&:hover": {
            background: "rgba(10, 255, 241, 0.08)",
          },
        },
        item: {
          border: "1px solid rgba(10, 255, 241, 0.12)",
          background: "rgba(6, 9, 20, 0.6)",
          "&[data-active]": {
            borderColor: "rgba(10, 255, 241, 0.24)",
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

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "[xmtp.chat] Service worker registered:",
          registration.scope,
        );
      })
      .catch((error: unknown) => {
        console.error("[xmtp.chat] Service worker registration failed:", error);
      });
  });
}
