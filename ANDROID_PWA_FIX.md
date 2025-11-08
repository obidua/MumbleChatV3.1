# Android PWA Installation Fix

## Issues Identified

1. **Install prompt not showing on Android**
2. **App adds as bookmark instead of proper PWA**
3. **Opens in Chrome browser instead of standalone mode**

## Root Causes

### 1. Manifest Configuration Issues

- Had redundant `id` field with query parameter
- Used `orientation: "portrait-primary"` which is restrictive
- External manifest.webmanifest not properly integrated with Vite PWA plugin

### 2. Service Worker Registration

- Manifest was set to `false` in vite.config.ts
- This caused inconsistencies between the manually managed manifest and the Vite-generated one

### 3. Android PWA Requirements

For Android to recognize a PWA and show the install prompt:

- Valid manifest with proper icons (at least 192x192 and 512x512)
- Service worker registered
- HTTPS (or localhost for development)
- `display: "standalone"` or `"fullscreen"` in manifest
- Valid `start_url` and `scope`

## Changes Made

### 1. Updated manifest.webmanifest

```json
{
  "name": "MumbleChat - Decentralized Messaging",
  "short_name": "MumbleChat",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any"
}
```

**Key changes:**

- Removed `id` field with query parameter
- Changed `start_url` from `"/?source=pwa"` to `"/"`
- Changed `orientation` from `"portrait-primary"` to `"any"`
- Removed unnecessary `iarc_rating_id` and `permissions` fields

### 2. Updated vite.config.ts

```typescript
VitePWA({
  registerType: "autoUpdate",
  injectRegister: "auto",
  manifest: {
    name: "MumbleChat - Decentralized Messaging",
    short_name: "MumbleChat",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // ... all other manifest properties
  },
  // ... workbox config
});
```

**Key changes:**

- Changed `manifest: false` to defining manifest inline
- Vite PWA now generates and manages the manifest automatically
- Ensures consistency and proper service worker registration

### 3. Updated index.html

```html
<!-- Removed manual manifest link -->
<!-- Vite PWA plugin will inject it automatically -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

**Key changes:**

- Removed `<link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials" />`
- Vite PWA plugin now injects the manifest link automatically during build

## How to Test

### Development (localhost)

1. Run `npm run dev`
2. Open http://localhost:5189 in Chrome on Android
3. The install prompt should appear after a few seconds
4. Alternatively, click the three dots menu → "Install app"

### Production (HTTPS required)

1. Build: `npm run build`
2. Deploy to HTTPS server
3. Visit site in Chrome on Android
4. Install prompt should appear
5. After installing, app should open in standalone mode (no browser UI)

## Verification Checklist

### Before Installing:

- [ ] Chrome shows "Install app" in menu (three dots)
- [ ] `beforeinstallprompt` event fires (check console)
- [ ] InstallPrompt component appears after delay
- [ ] PWAInstallButton shows in Settings/Profile

### After Installing:

- [ ] App opens in fullscreen (no browser address bar)
- [ ] App appears on home screen with proper icon
- [ ] App name is "MumbleChat"
- [ ] Opens in standalone window, not browser tab
- [ ] Status bar color matches theme (#0afff1)

### Service Worker:

- [ ] Navigate to Chrome DevTools → Application → Service Workers
- [ ] Service worker should be registered and running
- [ ] Manifest should show all proper fields

## Common Issues & Solutions

### Issue: Install prompt still not showing

**Solutions:**

1. Clear browser cache and site data
2. Unregister existing service workers (DevTools → Application → Service Workers)
3. Ensure you're on HTTPS (or localhost)
4. Check that all icon files exist in `/public/icons/`
5. Wait 30 seconds - Chrome has engagement heuristics

### Issue: App still opens in browser

**Solutions:**

1. Uninstall the current version completely
2. Clear Chrome's app cache
3. Re-install using the install prompt
4. Check manifest has `"display": "standalone"`

### Issue: Service worker not registering

**Solutions:**

1. Check browser console for errors
2. Rebuild the project: `npm run build`
3. Verify `/dist/sw.js` exists after build
4. Check network tab for failed service worker requests

## Technical Details

### Android PWA Criteria (Chrome)

Chrome on Android shows the install prompt when:

1. Site has a valid Web App Manifest with:
   - `name` or `short_name`
   - `icons` including at least 192x192 and 512x512 PNG
   - `start_url`
   - `display` set to `standalone`, `fullscreen`, or `minimal-ui`
2. Site is served over HTTPS
3. Site has a registered service worker with a `fetch` handler
4. User has engaged with the site (visited at least twice, with at least 5 minutes between visits)

### Bypass Engagement Heuristics (Development)

1. Chrome → `chrome://flags/#bypass-app-banner-engagement-checks`
2. Enable the flag
3. Restart Chrome
4. Install prompt will show immediately

## Build Output Verification

After running `npm run build`, you should see:

```
PWA v1.1.0
mode      generateSW
precache  114 entries (14732.19 KiB)
files generated
  dist/sw.js
  dist/workbox-ffa5afc0.js
```

And the manifest should be in `dist/manifest.webmanifest`.

## Additional Resources

- [PWA Install Criteria](https://web.dev/install-criteria/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
