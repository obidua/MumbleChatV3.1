# 🔐 3-Month Device Access Expiry Explained

## What is the 3-Month Expiry?

When you connect a device (phone, laptop, tablet) to MumbleChat, XMTP creates an **Installation** - a secure cryptographic identity for that specific device. For security reasons, **each installation expires after 90 days (3 months)**.

---

## Why Does It Expire?

### Security Benefits:

1. **Limits Compromised Device Access** - If someone steals your old phone, they can't access messages forever
2. **Forces Periodic Re-authentication** - Ensures you still control the wallet
3. **Revokes Forgotten Devices** - Old devices you no longer use automatically lose access
4. **Reduces Attack Surface** - Fewer active keys = fewer potential security vulnerabilities

### Industry Standard:

- Similar to how banking apps require re-login every 90 days
- SSL/TLS certificates also expire for security
- OAuth tokens typically expire after 30-90 days

---

## What Happens When an Installation Expires?

### After 3 Months:

1. ❌ **Device loses access** - Cannot send or receive new messages
2. ⚠️ **Status shows "Expired"** - Visible in Profile → Installations list
3. 🔴 **Red indicator** - Device marked as inactive
4. 📱 **Re-authentication required** - Must reconnect wallet to continue

### What You Keep:

- ✅ **Message history** - All previous conversations remain
- ✅ **Wallet address** - Your identity doesn't change
- ✅ **Groups** - Group memberships persist
- ✅ **Contacts** - Contact list intact

---

## How to Handle Expiry

### Option 1: Reconnect Your Device (Recommended)

1. Open MumbleChat on the expired device
2. Click "Connect Wallet"
3. Sign with MetaMask/Trust Wallet
4. ✅ New 3-month installation created
5. Messages sync automatically

### Option 2: Revoke and Create New

1. Go to **Profile** → View Installations
2. Click **"Revoke All Other Installations"** button
3. Reconnect on your current device
4. Old devices permanently lose access

### Option 3: Do Nothing

- If you no longer use the device, let it expire naturally
- No action needed - it will auto-revoke after 90 days

---

## Checking Device Expiry

### In Your Profile Page:

```
┌─────────────────────────────────────────┐
│ 🖥️ Installation ID: 0x1234...5678       │
│                                          │
│ Created: 2 months ago                    │
│ Expires: in 1 month                      │  ← Shows remaining time
│ Status: 🟢 Active                        │
│                                          │
│ [Revoke]                                 │
└─────────────────────────────────────────┘
```

### Status Indicators:

- 🟢 **Active** - Device works normally
- 🟡 **Expiring Soon** - Less than 7 days remaining
- 🔴 **Expired** - Device needs reconnection

---

## Technical Details

### How XMTP Manages Installations:

1. **Installation Creation:**

   ```
   User connects wallet → Signs authentication message
   → XMTP creates cryptographic keypair for device
   → Installation ID generated (e.g., 0x1234...5678)
   → Expiry timestamp set (now + 90 days)
   ```

2. **During 90 Days:**
   - Device can encrypt/decrypt messages
   - Participates in group chats
   - Receives notifications
   - Syncs across installations

3. **After 90 Days:**
   - Installation credential expires
   - XMTP network rejects messages from this device
   - Must create new installation to continue

### Why 90 Days Specifically?

- **Balance:** Long enough for convenience, short enough for security
- **Mobile usage patterns:** Most people use their phone daily
- **Industry standard:** OAuth 2.0 refresh tokens typically 60-90 days
- **XMTP protocol:** Built-in security feature

---

## Multi-Device Usage

### Scenario: Phone + Laptop

**Day 0:**

- Phone connected (expires Day 90)
- Laptop connected (expires Day 90)
- Both devices active

**Day 45:**

- Both devices still work
- Phone shows: "Expires in 45 days"
- Laptop shows: "Expires in 45 days"

**Day 90:**

- Phone expired → Reconnect required
- Laptop expired → Reconnect required

**Day 91:**

- Reconnect phone → New 90-day period starts
- Laptop still expired until reconnected

### Pro Tip: Stagger Connections

If you use multiple devices:

1. Connect Phone on Jan 1 (expires Apr 1)
2. Connect Laptop on Jan 15 (expires Apr 15)
3. Connect Tablet on Feb 1 (expires May 1)

This prevents all devices expiring simultaneously!

---

## FAQ

### Q: Can I extend the 90-day period?

**A:** No, it's a fixed XMTP protocol limitation for security. You must reconnect after 90 days.

### Q: What if I'm on vacation when it expires?

**A:** Messages are queued. When you reconnect, all missed messages sync automatically.

### Q: Do I lose my message history?

**A:** No! Message history is stored on XMTP network, not your device. After reconnecting, everything syncs back.

### Q: Can I revoke a device before expiry?

**A:** Yes! Go to Profile → Installations → Click "Revoke" on specific device or "Revoke All Other Installations".

### Q: What happens to group chats?

**A:** Group memberships persist. After reconnecting, you rejoin all groups automatically.

### Q: Is there a warning before expiry?

**A:** Yes! The app shows:

- 7 days before: Yellow warning badge
- On expiry day: Red "Expired" status
- Push notification (if enabled)

### Q: Can malicious actors extend their access?

**A:** No! Only the wallet owner can create new installations. Stolen devices can't extend their own access.

### Q: Does reconnecting create a new Installation ID?

**A:** Yes, each connection creates a unique Installation ID. Old IDs are revoked.

### Q: How many devices can I have active?

**A:** Unlimited! But each expires after 90 days independently.

---

## Security Best Practices

### Do:

- ✅ Reconnect before expiry to avoid disruption
- ✅ Revoke old devices you no longer use
- ✅ Check Installation list monthly
- ✅ Use strong wallet password

### Don't:

- ❌ Share your wallet seed phrase
- ❌ Keep unknown devices connected
- ❌ Ignore expiry warnings
- ❌ Sign transactions you don't understand

---

## Comparison with Other Apps

| App                   | Session Expiry       | Re-auth Method   |
| --------------------- | -------------------- | ---------------- |
| **MumbleChat (XMTP)** | 90 days              | Wallet signature |
| WhatsApp Web          | 14 days              | QR code scan     |
| Telegram              | Never (until logout) | Phone code       |
| Discord               | Never (until logout) | Email/password   |
| Banking Apps          | 30-90 days           | Password/2FA     |

---

## Summary

The 3-month (90-day) device expiry is a **security feature**, not a bug:

1. ✅ **Protects your account** from compromised devices
2. ✅ **Forces periodic verification** you still control your wallet
3. ✅ **Automatically revokes** forgotten devices
4. ✅ **Industry-standard practice** for secure apps
5. ✅ **Easy to handle** - just reconnect your wallet

**Think of it like:** Your device's "parking permit" expires after 3 months - simply renew it by signing with your wallet again!

---

## Need Help?

- Check the **Help & Info** page in Profile section
- Join our Discord/Telegram community
- Read XMTP documentation: https://xmtp.org/docs
- Contact support: support@mumblechat.com (if applicable)
