# XMTP Installation Management - Avoiding the 10/10 Limit

## Problem

XMTP has a limit of **10 installations per wallet**. Every time a user connects to MumbleChat, a new "installation" (device/browser session) is registered with XMTP. When users reach the limit of 10 installations, they see this error:

```
Maximum XMTP installations (10/10) reached. Please revoke old installations before connecting again.
```

This was happening because:

1. Every browser page load would create a new XMTP client
2. Each `Client.create()` call would auto-register a new installation
3. After 10 connections (even from the same device), the limit was reached

## Solution

The fix implements **installation reuse** by:

1. **Tracking registered wallets**: We store which wallet addresses have already been registered in localStorage (`XMTP_REGISTERED_WALLETS`)

2. **Disabling auto-registration on reconnect**: When a wallet that's already registered reconnects, we use `disableAutoRegister: true` to prevent creating a new installation

3. **Verifying registration status**: After creating the client with disabled auto-register, we check `isRegistered()` to ensure the wallet is actually registered. If not (edge case), we register it

4. **Reusing existing installations**: The XMTP SDK will automatically reuse the existing installation from the local database instead of creating a new one

## How It Works

### First Connection (New Wallet)

```
1. User connects wallet (0x123...)
2. Check: isWalletRegistered("0x123...") → false
3. Create client with disableAutoRegister: false
4. XMTP creates new installation (1/10)
5. Mark wallet as registered: markWalletAsRegistered("0x123...")
6. Store in localStorage
```

### Subsequent Connections (Same Wallet)

```
1. User opens browser, wallet auto-connects
2. Check: isWalletRegistered("0x123...") → true
3. Create client with disableAutoRegister: true
4. XMTP reuses existing installation from IndexedDB
5. No new installation created (still 1/10)
```

### User Logs Out and Back In

```
1. User clicks logout → XMTP client closes, but wallet stays registered
2. User reconnects → same wallet, still registered
3. No new installation needed
4. Messages and conversations preserved
```

## User Actions

### If You Hit the 10/10 Limit

1. Go to Profile → Installation Management (or visit https://xmtp.chat)
2. View your current installations
3. Revoke old/unused installations
4. Try connecting again

### Clearing Registration (Full Reset)

If you want to fully reset your XMTP identity (not recommended):

1. Clear browser localStorage (`XMTP_REGISTERED_WALLETS`)
2. Clear IndexedDB (`xmtp` database)
3. Revoke installations from https://xmtp.chat
4. Reconnect (this creates a fresh installation)

## Technical Details

### Files Modified

- `apps/xmtp.chat/src/hooks/useSettings.ts` - Added registration tracking
- `apps/xmtp.chat/src/hooks/useConnectXmtp.ts` - Check registration before connecting
- `apps/xmtp.chat/src/contexts/XMTPContext.tsx` - Support for `disableAutoRegister`

### localStorage Keys

- `XMTP_REGISTERED_WALLETS`: Array of lowercase wallet addresses that have been registered
- `XMTP_AUTO_CONNECT`: Boolean to auto-connect on page load

### SDK Options Used

- `disableAutoRegister: true` - Prevents auto-registration on `Client.create()`
- `Client.isRegistered()` - Checks if the client is registered with XMTP network
- `Client.register()` - Manually registers the client if needed

## Benefits

1. **No more 10/10 limit errors** for normal usage
2. **Faster reconnections** (no signature needed for re-registration)
3. **Preserved conversations** across sessions
4. **Works with RamaPay wallet** and other dApp browsers
5. **Works with auto-connect** feature
