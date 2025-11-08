# PWA Installation Testing Guide for Android

## 🚨 IMPORTANT: Chrome Engagement Heuristics

### Why the Install Prompt Might Not Show

Chrome on Android has **engagement heuristics** that prevent the install prompt from showing immediately:

**Requirements:**

- ✅ User must visit the site **at least TWICE**
- ✅ At least **5 MINUTES** must pass between visits
- ✅ User must interact with the page (scroll, click, etc.)

**This is intentional anti-spam behavior** and cannot be bypassed in production.

---

## 🛠️ Development Testing (Localhost)

### Step 1: Enable Chrome Flag (BYPASS WAITING)

**On Android Device:**

1. Open Chrome
2. Navigate to: `chrome://flags`
3. Search for: **"bypass app banner engagement"**
4. Find: `#bypass-app-banner-engagement-checks`
5. Set to: **Enabled**
6. Click **Relaunch** button
7. ✅ **Install prompt will now show immediately!**

### Step 2: Run Development Server

```bash
cd "/Users/dev/Downloads/Blockchain/Decentralized Chat /MumbleChatV3.1"
npm run dev
```

Server starts at: `http://localhost:5189`

### Step 3: Access from Android

**Find your local IP address:**

```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Example: `192.168.1.100`

**On Android:**

1. Connect to **same WiFi** as your dev machine
2. Open Chrome
3. Navigate to: `http://YOUR_IP:5189` (e.g., `http://192.168.1.100:5189`)
4. You should see **install banner at top** of landing page
5. Or check Chrome menu (⋮) → Should see **"Install app"**

### Step 4: Check Console Logs

**Enable Remote Debugging:**

1. On Android: Enable **Developer Options** → **USB Debugging**
2. Connect Android via USB to computer
3. On Desktop Chrome: Navigate to `chrome://inspect`
4. Select your Android device
5. Click **"Inspect"** on the MumbleChat tab

**Look for these console logs:**

```
PWA: Listening for beforeinstallprompt event
PWA: beforeinstallprompt event fired!
PWA: Days since dismissed: 0
PWA: Showing install prompt
PWA: beforeinstallprompt fired - showing banner
```

**If you see these logs** → Everything is working!

**If you DON'T see "beforeinstallprompt event fired":**

- Engagement heuristics not bypassed (check Chrome flag)
- Or PWA requirements not met (check manifest/service worker)

---

## 🌐 Production Testing (HTTPS)

### Step 1: Build

```bash
npm run build
```

Output: `apps/xmtp.chat/dist/`

### Step 2: Deploy

Deploy the `dist` folder to an **HTTPS server**. Common options:

- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist` folder
- Firebase: `firebase deploy`
- Your own server with SSL certificate

**HTTPS is mandatory for PWA!**

### Step 3: Test on Android

**Without Chrome Flag (Real User Experience):**

1. **First Visit:**
   - Open deployed URL in Chrome on Android
   - Browse around, scroll, click buttons
   - **No install prompt yet** (expected!)
   - Close browser/tab

2. **Wait 5+ Minutes:**
   - Set a timer for 5 minutes
   - Do something else

3. **Second Visit:**
   - Open the URL again
   - **Install banner should appear** at top of page!
   - Or check Chrome menu → "Install app"

**With Chrome Flag (Skip Waiting):**

- Enable `#bypass-app-banner-engagement-checks`
- Install prompt shows immediately on first visit

### Step 4: Install the App

1. Click **"Install"** on the banner
2. Or Chrome menu (⋮) → **"Install app"**
3. Confirmation dialog appears
4. Click **"Install"**
5. ✅ App installs to home screen

### Step 5: Verify Installation

**Check these indicators:**

- ✅ App icon appears on Android home screen
- ✅ App name is "MumbleChat"
- ✅ When opened, **no browser address bar** (standalone mode)
- ✅ App opens in separate window, not Chrome tab
- ✅ Status bar color matches theme (#0afff1)
- ✅ Back button minimizes app (doesn't navigate browser history)

---

## 🔍 Debugging: Install Prompt Not Showing

### Check #1: Engagement Heuristics

**Problem:** Most common reason for no install prompt

**Solution:**

```
1. Visit the site at least twice
2. Wait 5+ minutes between visits
3. Or enable Chrome flag (dev only)
```

**Verify:**

- Open `chrome://flags/#bypass-app-banner-engagement-checks`
- Should be **Enabled** for dev testing

### Check #2: Service Worker

**Problem:** Service worker not registered

**Solution:**

1. Chrome → DevTools → **Application** tab
2. Left sidebar → **Service Workers**
3. Should see: `sw.js` registered and **activated**
4. If not, check build output for errors

**Verify:**

```bash
# After build, check these files exist:
ls apps/xmtp.chat/dist/sw.js
ls apps/xmtp.chat/dist/workbox-*.js
```

### Check #3: Manifest

**Problem:** Invalid or missing manifest

**Solution:**

1. Chrome → DevTools → **Application** tab
2. Left sidebar → **Manifest**
3. Should show:
   - Name: "MumbleChat - Decentralized Messaging"
   - Start URL: "/"
   - Display: "standalone"
   - Icons: 5 icons listed

**Verify:**

```bash
# Check manifest exists and is valid JSON:
cat apps/xmtp.chat/dist/manifest.webmanifest
```

Should output valid JSON with `display: "standalone"`

### Check #4: Icons

**Problem:** Missing icon files

**Solution:**

```bash
# Check all required icons exist:
ls apps/xmtp.chat/public/icons/
```

**Required files:**

- `icon-192x192.png`
- `icon-256x256.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-512x512-maskable.png`

### Check #5: HTTPS

**Problem:** Not using HTTPS in production

**Solution:**

- PWAs **require HTTPS** (except localhost)
- Deploy to platform with SSL
- Or use `ngrok` for testing: `ngrok http 5189`

**Verify:**

- URL should start with `https://`
- Lock icon in address bar
- No "Not Secure" warning

### Check #6: Already Installed

**Problem:** App already installed, prompt won't show again

**Solution:**

1. Long-press app icon on home screen
2. Select **"Uninstall"** or **"Remove from Home screen"**
3. Clear Chrome data:
   - Settings → Apps → Chrome → Storage → Clear data
4. Visit site again

---

## 📱 Where the Install Prompt Appears

### 1. Landing Page Banner (NEW!)

**Location:** Top of `mumblechat.com` landing page

**When it shows:**

- `beforeinstallprompt` event fires (Chrome determines app is installable)
- User hasn't dismissed banner before
- App not already installed

**Appearance:**

- Fixed position at top of page
- Gradient background with glassmorphic effect
- "Install" and "Later" buttons
- Console logs: `PWA: beforeinstallprompt fired - showing banner`

### 2. App-Wide Install Prompt (InstallPrompt Component)

**Location:** Global component, appears on any page

**When it shows:**

- Same conditions as banner
- Only shows if not dismissed in last 1 day

**Appearance:**

- Centered on screen
- Mobile phone icon
- "Install MumbleChat" text
- "Add to home screen for the best experience"

### 3. Chrome Native Menu

**Location:** Chrome menu (⋮ three dots)

**When it shows:**

- Always available when app is installable
- **Works even if engagement criteria not met!**
- Doesn't depend on our code

**How to access:**

1. Click Chrome menu (⋮)
2. Look for:
   - **"Install app"** or
   - **"Add to Home screen"**

---

## 🎯 Quick Test Checklist

**Before Testing:**

- [ ] Build completed successfully
- [ ] Files deployed to server
- [ ] Using HTTPS (or localhost)
- [ ] Chrome flag enabled (for dev testing)

**During Testing:**

- [ ] Open Chrome DevTools remote debugging
- [ ] Console shows "PWA: beforeinstallprompt event fired!"
- [ ] Install banner appears at top of landing page
- [ ] Chrome menu shows "Install app" option
- [ ] Service worker registered (Application → Service Workers)
- [ ] Manifest valid (Application → Manifest)

**After Installing:**

- [ ] App icon on home screen
- [ ] App opens in standalone mode (no browser UI)
- [ ] Status bar color is #0afff1
- [ ] App works offline (service worker caching)
- [ ] Notifications work (if permissions granted)

---

## 📝 Console Log Reference

**Successful Installation Flow:**

```javascript
// Initial load
PWA: Listening for beforeinstallprompt event

// Event fires (Chrome determines app is installable)
PWA: beforeinstallprompt event fired!
PWA: Days since dismissed: 0
PWA: Showing install prompt
PWA: beforeinstallprompt fired - showing banner

// User clicks Install
PWA: User accepted the install prompt

// Installation complete
PWA: App installed successfully!
```

**If Event Doesn't Fire:**

```javascript
PWA: Listening for beforeinstallprompt event
// ... nothing else ...
```

**Reasons:**

1. Engagement heuristics not met (need 2 visits, 5 min apart)
2. Chrome flag not enabled
3. PWA requirements not met (manifest, SW, HTTPS)
4. App already installed

---

## 🚀 Recommended Testing Flow

### For Developers

1. **Enable Chrome Flag** on test device
2. **Run dev server:** `npm run dev`
3. **Access from Android:** `http://YOUR_IP:5189`
4. **Check console:** Should see "beforeinstallprompt event fired!"
5. **Install from banner:** Click "Install" button
6. **Verify:** App opens in standalone mode

### For QA/Testers (Production-like)

1. **Deploy to staging** (HTTPS)
2. **First visit:** Browse site, note no prompt
3. **Wait 5 minutes**
4. **Second visit:** Install prompt should appear
5. **Install app**
6. **Test all features:** Offline mode, notifications, etc.

### For End Users (Production)

1. **Visit site** in Chrome on Android
2. **Browse normally** (no prompt on first visit)
3. **Return later** (after 5+ minutes)
4. **See install prompt** or use Chrome menu
5. **Install app** from prompt or menu
6. **Enjoy standalone app experience!**

---

## ❓ FAQ

**Q: Why doesn't the install prompt show immediately?**
**A:** Chrome requires 2 visits with 5 minutes between them. This prevents spam. Enable Chrome flag for dev testing.

**Q: Can I force the prompt to show?**
**A:** In dev: Enable `#bypass-app-banner-engagement-checks` flag. In production: No, it's intentional behavior.

**Q: Does it work on iOS?**
**A:** iOS doesn't support `beforeinstallprompt`. Users must use Safari → Share → "Add to Home Screen". We have a separate `IOSInstallPrompt` component for this.

**Q: What if user dismisses the prompt?**
**A:** Our banner remembers dismissal via localStorage. User can always install via Chrome menu (⋮) → "Install app".

**Q: Will it work offline?**
**A:** Yes! Service worker caches all assets. After first load, app works offline.

**Q: Can I test without deploying?**
**A:** Yes! Use `ngrok` to create HTTPS tunnel: `ngrok http 5189` then visit the `https://` URL on Android.

---

## 📚 Additional Resources

- [Chrome Install Criteria](https://web.dev/install-criteria/)
- [PWA Engagement Heuristics](https://web.dev/install-criteria/#criteria)
- [Chrome Flags List](chrome://flags)
- [Service Worker Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
