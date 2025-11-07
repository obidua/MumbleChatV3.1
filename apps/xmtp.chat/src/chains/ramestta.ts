import { defineChain } from "viem";

export const ramestta = defineChain({
  id: 1370,
  name: "Ramestta",
  nativeCurrency: {
    decimals: 18,
    name: "RAMA",
    symbol: "RAMA",
  },
  rpcUrls: {
    default: {
      http: ["https://blockchain.ramestta.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Ramascan",
      url: "https://ramascan.com",
    },
  },
  contracts: {
    // Add any contract addresses if needed
  },
});
