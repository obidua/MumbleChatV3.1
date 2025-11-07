# Adding Custom EVM Networks (Rametta, etc.)

## Step 1: Define the Custom Network

Add this to `src/main.tsx` after the imports:

```typescript
import { defineChain } from "viem";

// Define Rametta network (replace with actual Rametta network details)
const rametta = defineChain({
  id: 1337, // Replace with actual Rametta chain ID
  name: "Rametta",
  nativeCurrency: {
    decimals: 18,
    name: "Rametta Coin",
    symbol: "RAMA", // Replace with actual symbol
  },
  rpcUrls: {
    default: {
      http: ["https://blockchain.ramestta.com"], // Replace with actual RPC URL
    },
    public: {
      http: ["https://blockchain2.ramestta.com"], // Replace with actual RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "Rametta Explorer",
      url: "https://ramascan.com", // Replace with actual explorer
    },
  },
  testnet: false, // Set to true if it's a testnet
});
```

## Step 2: Add to Chains Array

In `src/main.tsx`, update the `createConfig` chains array:

```typescript
export const config = createConfig({
  connectors: [
    injected(),
    coinbaseWallet({ appName: "xmtp.chat" }),
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
    mainnet,
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
    rametta, // ✅ ADD YOUR CUSTOM NETWORK HERE
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
    [mainnet.id]: http(),
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
    [rametta.id]: http(), // ✅ ADD TRANSPORT HERE
  },
});
```

## Step 3: Get Rametta Network Details

You need to find:

1. **Chain ID** - Unique identifier (e.g., 1 for Ethereum, 137 for Polygon)
2. **RPC URL** - Network endpoint (e.g., `https://rpc.rametta.network`)
3. **Native Currency** - Symbol and decimals (e.g., RAMA, 18 decimals)
4. **Block Explorer** - For transaction viewing (optional)

### Where to Find Network Details:

- Official Rametta documentation/website
- ChainList: https://chainlist.org/
- Network's Discord/Telegram community
- Network's GitHub repository

## Example: Adding Polygon Mumbai (Testnet)

```typescript
import { polygonMumbai } from 'wagmi/chains';

// In chains array:
chains: [
  mainnet,
  polygon,
  polygonMumbai, // ✅ Already available in wagmi/chains
  // ... other chains
],

// In transports:
transports: {
  [mainnet.id]: http(),
  [polygon.id]: http(),
  [polygonMumbai.id]: http(), // ✅ Add transport
  // ... other transports
},
```

## Mobile Wallet Support for Custom Networks

**Important:** After adding a custom network:

1. **MetaMask Mobile:** Users can manually add the network in MetaMask settings
2. **Trust Wallet:** Users can add custom networks in settings
3. **Auto-add via App:** Implement a "Switch Network" button that uses `wagmi`'s `switchChain` function

### Auto-Add Network Button Example:

```typescript
import { useSwitchChain } from 'wagmi';

function NetworkSwitcher() {
  const { switchChain } = useSwitchChain();

  return (
    <Button
      onClick={() => switchChain({ chainId: rametta.id })}
    >
      Switch to Rametta Network
    </Button>
  );
}
```

This will prompt the user to add the network to their wallet if not already added!

## Testing

1. Start dev server: `yarn dev`
2. Open in browser with MetaMask installed
3. Connect wallet
4. Try switching to Rametta network
5. Verify RPC connection works

## Troubleshooting

### Network not showing up?

- Verify chain ID is correct and unique
- Check RPC URL is accessible
- Ensure transport is added to transports object

### Mobile wallet can't connect?

- Make sure WalletConnect projectId is set in `.env`
- Test with browser-based wallet first
- Check mobile wallet supports the custom network

### RPC errors?

- Verify RPC URL is HTTPS (required for production)
- Test RPC endpoint with curl: `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' https://rpc.rametta.network`
