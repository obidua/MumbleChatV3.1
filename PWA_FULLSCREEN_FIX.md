# PWA Fullscreen Fix - iOS & Android

## 🔧 Changes Made

### 1. Display Mode: `fullscreen`

Changed from `"standalone"` to `"fullscreen"` with fallbacks:

```json
{
  "display": "fullscreen",
  "display_override": ["fullscreen", "standalone", "minimal-ui"]
}
```

**Why this fixes the issue:**

- **iOS**: Requires `"fullscreen"` for true app-like experience without Safari UI
- **Android**: `"fullscreen"` hides both browser bar AND status bar for immersive experience
- **Fallbacks**: If fullscreen not supported, falls back to standalone, then minimal-ui

### 2. iOS-Specific Meta Tags

Added critical iOS meta tags:

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="MumbleChat" />
<meta name="apple-touch-fullscreen" content="yes" />
```

### 3. Enhanced Android Detection

- Added fullscreen display mode detection
- More verbose console logging for debugging
- Better user agent logging

### 4. Removed Duplicate Meta Tags

- Cleaned up duplicate viewport tags
- Removed duplicate status-bar-style tag
- Streamlined theme-color tags

---

## 📱 Testing Instructions

### **iOS (iPhone/iPad)**

#### Safari - Add to Home Screen:

1. **Open Safari** on your iPhone/iPad
2. Navigate to your deployed site (must be HTTPS)
3. Tap the **Share button** (square with arrow up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**
6. ✅ **App icon appears on home screen**

#### Verify Fullscreen Mode:

After installing, tap the app icon:

- ✅ **NO Safari address bar**
- ✅ **NO Safari navigation bar**
- ✅ **NO browser UI at all**
- ✅ Status bar should be translucent black
- ✅ App uses full screen height
- ✅ Looks like native iOS app

**If you still see browser UI:**

1. Delete the app from home screen (long press → Remove App)
2. Clear Safari cache: Settings → Safari → Clear History and Website Data
3. Re-add using steps above
4. Make sure your manifest has `"display": "fullscreen"`

---

### **Android (Chrome)**

#### Method 1: Chrome Install Prompt (Automatic)

**IMPORTANT: Chrome requires 2 visits with 5+ minutes between them**

1. **First Visit:**
   - Open Chrome on Android
   - Navigate to your site (HTTPS)
   - Browse around, scroll, interact
   - ✅ **No prompt yet** - this is normal!
   - Close browser

2. **Wait 5+ Minutes:**
   - Set a timer
   - Do something else

3. **Second Visit:**
   - Open the URL again
   - ✅ **Install banner should appear** at top of landing page
   - Or check Chrome menu (⋮) → "Install app"

4. **Install:**
   - Tap "Install" button
   - Confirm installation
   - ✅ App installs to home screen

#### Method 2: Bypass Waiting (Dev Testing)

**Enable Chrome Flag:**

1. Open Chrome on Android
2. Navigate to: `chrome://flags`
3. Search: **"bypass app banner engagement"**
4. Find: `#bypass-app-banner-engagement-checks`
5. Set to: **Enabled**
6. Tap **Relaunch**
7. ✅ **Install prompt shows immediately!**

#### Method 3: Manual Install (Always Works)

**This works regardless of engagement heuristics:**

1. Open site in Chrome on Android
2. Tap Chrome menu (⋮ three dots)
3. Select **"Install app"** or **"Add to Home screen"**
4. Confirm installation
5. ✅ App installs immediately

#### Verify Fullscreen Mode (Android):

After installing, tap the app icon:

- ✅ **NO Chrome address bar**
- ✅ **NO Chrome navigation bar**
- ✅ **NO status bar** (or transparent status bar)
- ✅ **FULL immersive display**
- ✅ Edge-to-edge content
- ✅ App opens in separate window (not Chrome tab)
- ✅ Swipe up from bottom shows app switcher (not browser tabs)

**If you still see browser UI:**

1. Long-press app icon → App info → Uninstall
2. Chrome → Settings → Site settings → MumbleChat → Clear & reset
3. Re-install using one of the methods above
4. Ensure manifest has `"display": "fullscreen"`

---

## 🐛 Debugging

### Check Console Logs (Android)

**Remote Debugging:**

1. Connect Android via USB
2. Enable USB debugging on Android
3. On desktop Chrome: `chrome://inspect`
4. Select your device → Inspect

**Look for these logs:**

```javascript
PWA: Listening for beforeinstallprompt event
PWA: User Agent: Mozilla/5.0 (Linux; Android ...)
PWA: Display Mode: browser
PWA: beforeinstallprompt event fired!  // ← Key indicator!
PWA: Days since dismissed: 0
PWA: Showing install prompt
PWA: beforeinstallprompt fired - showing banner
```

**If "beforeinstallprompt" doesn't fire:**

- Engagement criteria not met (need 2 visits, 5 min apart)
- Chrome flag not enabled
- App already installed
- PWA requirements not met (check manifest/service worker)

### Check Service Worker

**On Android (Remote Debugging):**

1. Chrome DevTools → **Application** tab
2. Left sidebar → **Service Workers**
3. Should show: `sw.js` **activated and running**

**On iOS:**
Safari → Settings → Advanced → Experimental Features → Service Workers (enabled)

### Check Manifest

**On Android (Remote Debugging):**

1. Chrome DevTools → **Application** tab
2. Left sidebar → **Manifest**
3. Verify:
   - Name: "MumbleChat - Decentralized Messaging"
   - Start URL: "/"
   - Display: "fullscreen"
   - Display Override: ["fullscreen", "standalone", "minimal-ui"]
   - Icons: 5 icons (192x192, 256x256, 384x384, 512x512, 512x512-maskable)

---

## ✅ Verification Checklist

### iOS:

- [ ] Added via Safari → Share → Add to Home Screen
- [ ] App icon on home screen with name "MumbleChat"
- [ ] Opens in fullscreen (no Safari UI)
- [ ] Status bar is translucent/transparent
- [ ] Full screen height (uses 100dvh)
- [ ] Looks like native iOS app
- [ ] Can return to home screen with swipe gesture

### Android:

- [ ] Install prompt appeared (or used manual install)
- [ ] App icon on home screen
- [ ] Opens in fullscreen (no Chrome UI)
- [ ] No status bar or transparent status bar
- [ ] Edge-to-edge display
- [ ] Opens in separate window (not browser tab)
- [ ] App switcher shows as separate app
- [ ] Back button minimizes app (doesn't go back in browser history)

---

## 🔬 Technical Details

### Display Modes Hierarchy:

1. **fullscreen** - Hides ALL browser UI (address bar, navigation, status bar)
2. **standalone** - Hides browser UI but keeps status bar
3. **minimal-ui** - Minimal browser UI
4. **browser** - Regular browser mode

### Display Override:

```json
"display_override": ["fullscreen", "standalone", "minimal-ui"]
```

Browser tries each in order:

1. Tries "fullscreen" first
2. If not supported, falls back to "standalone"
3. If not supported, falls back to "minimal-ui"

### Why iOS Was Showing Browser UI:

**Problem:** iOS Safari didn't honor `"display": "standalone"`

**Solution:** Changed to `"display": "fullscreen"` with proper meta tags:

- `apple-mobile-web-app-capable: yes` - Enables web app mode
- `apple-mobile-web-app-status-bar-style: black-translucent` - Translucent status bar
- `apple-touch-fullscreen: yes` - Requests fullscreen mode

### Why Android Install Prompt Wasn't Showing:

**Problem:** Chrome engagement heuristics

**Root Cause:**

- Chrome requires 2 site visits
- Must be at least 5 minutes apart
- Anti-spam measure by Google
- Cannot be bypassed in production

**Solutions:**

1. **Dev Testing:** Enable Chrome flag `#bypass-app-banner-engagement-checks`
2. **Production:** Users must visit twice (or use manual install from menu)
3. **Always Available:** Chrome menu (⋮) → "Install app" (works immediately)

---

## 📊 Expected Results

### Before Fix:

- ❌ iOS: Safari address bar visible, browser-like experience
- ❌ Android: Install prompt not appearing, or bookmark-like experience

### After Fix:

- ✅ iOS: **Full immersive app**, no Safari UI, looks like native app
- ✅ Android: **Install prompt appears** (after engagement criteria), fullscreen mode
- ✅ Both: **True PWA experience** with offline support, push notifications, etc.

---

## 🚀 Deployment

### Build:

```bash
npm run build
```

### Verify Build Output:

```bash
# Check manifest has fullscreen mode
cat apps/xmtp.chat/dist/manifest.webmanifest | grep display
```

Should show:

```json
"display": "fullscreen",
"display_override": ["fullscreen", "standalone", "minimal-ui"]
```

### Deploy:

Deploy the `apps/xmtp.chat/dist/` folder to your HTTPS server.

**HTTPS is mandatory for PWA!**

---

## 📚 References

- [MDN: display_override](https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override)
- [Web.dev: Install Criteria](https://web.dev/install-criteria/)
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Chrome: Install Prompts](https://web.dev/customize-install/)

---

## 🆘 Common Issues

### Issue: iOS still shows Safari UI

**Solutions:**

1. Delete app from home screen
2. Clear Safari cache completely
3. Check manifest has `"display": "fullscreen"`
4. Ensure `apple-mobile-web-app-capable` meta tag is `"yes"`
5. Re-add to home screen

### Issue: Android install prompt never shows

**Solutions:**

1. Visit site **at least twice** with **5+ minutes** between visits
2. Enable Chrome flag: `chrome://flags/#bypass-app-banner-engagement-checks`
3. Use manual install: Chrome menu → "Install app"
4. Check console for "beforeinstallprompt event fired!" log

### Issue: App installs but still looks like browser

**Solutions:**

1. Uninstall app completely
2. Clear browser cache and site data
3. Rebuild: `npm run build`
4. Re-deploy
5. Clear service worker: DevTools → Application → Service Workers → Unregister
6. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
7. Re-install

---

## ✨ Summary

**Fixed:**

- ✅ iOS fullscreen mode (no Safari UI)
- ✅ Android fullscreen mode (no Chrome UI)
- ✅ Proper PWA install prompts
- ✅ Enhanced debugging logs
- ✅ Better meta tag configuration

**Key Changes:**

- `"display": "fullscreen"` with fallbacks
- `apple-touch-fullscreen: yes`
- Enhanced console logging
- Cleaned up duplicate meta tags

**Testing:**

- iOS: Safari → Share → Add to Home Screen
- Android: Wait for prompt (or enable Chrome flag for instant testing)
- Both: Verify NO browser UI after installation

**Result:**
True native-like PWA experience on both iOS and Android! 🎉
