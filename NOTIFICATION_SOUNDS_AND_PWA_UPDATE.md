# Notification Sounds & Android PWA Installation Update

## Overview

This update adds notification sounds for messages and improves PWA installation experience, particularly for Android devices.

## Features Implemented

### 1. Notification Sounds ✅

- **Sound Notifications**: Added audio feedback for sent and received messages
- **Toggle Control**: Sound notifications can be enabled/disabled in Settings (Identity Modal)
- **Fallback System**: Uses generated tones if MP3 files are not available
  - Receive sound: 800Hz sine wave tone
  - Sent sound: 600Hz sine wave tone
- **Web Audio API**: Automatically generates simple beep tones as fallback
- **User Preference**: Settings persisted in localStorage

**Files Modified:**

- `src/services/notificationService.ts` - Added sound playback and tone generation
- `src/hooks/useNotifications.ts` - Extended hook with sound controls
- `src/components/Notifications/NotificationSettings.tsx` - Added sound toggle UI
- `src/components/Conversation/useConversations.ts` - Integrated notification sounds

**New Files:**

- `public/sounds/README.md` - Documentation for custom sound files

### 2. Android PWA Installation Fixes ✅

- **Manifest Updates**: Changed display mode from "fullscreen" to "standalone"
- **Start URL**: Added query parameter `/?source=pwa` to track PWA installs
- **Display Override**: Prioritizes standalone mode for better Android compatibility

**Files Modified:**

- `apps/xmtp.chat/public/manifest.webmanifest` - Android-friendly configuration

### 3. Manual Install Button ✅

- **PWA Install Component**: New button that detects when app is installable
- **beforeinstallprompt Event**: Captures and displays install prompt on demand
- **Platform Detection**: Shows only when app is installable (not already installed)
- **Integration**: Added to Identity Modal (Profile/Settings page)

**New Files:**

- `src/components/PWAInstallButton.tsx` - Install button component
- `src/icons/IconDownload.tsx` - Download icon for install button

**Files Modified:**

- `src/components/Identity/IdentityModal.tsx` - Added PWA install button

### 4. QR Code WebView Compatibility ✅

- **Already Compatible**: QR Scanner uses `html5-qrcode` library which handles:
  - Camera permissions in WebView
  - Fallback to file upload if camera unavailable
  - Cross-platform compatibility (Web, Mobile, WebView)

## How to Add Custom Sound Files (Optional)

The app works with generated tones by default, but you can add custom MP3 files:

1. Create or obtain two MP3 files (< 1 second duration, < 50KB each):
   - `message-receive.mp3` - For incoming messages
   - `message-sent.mp3` - For sent messages

2. Place them in: `apps/xmtp.chat/public/sounds/`

3. The app will automatically use these files instead of generated tones

## Testing Instructions

### Notification Sounds

1. Open the app and grant notification permissions
2. Go to Settings (Profile icon) → Identity Modal
3. Enable "Notifications" toggle
4. Enable "Notification Sounds" toggle
5. Send/receive messages - you should hear sounds
6. Test with tab not focused for best results

### Android PWA Installation

1. **Automatic Install Prompt**:
   - Open app in Chrome/Edge on Android
   - Browser may show install banner automatically
   - Use the browser menu → "Add to Home screen"

2. **Manual Install Button**:
   - Go to Settings → Identity Modal
   - Look for "Install App" button (appears when installable)
   - Click to trigger installation
   - Button disappears when app is installed

### QR Code Scanning (WebView)

1. Open app in WebView (Android app container)
2. Tap QR code icon in navbar or Settings
3. Grant camera permissions when prompted
4. Scan QR code - should work identically to mobile web

## Technical Details

### Sound System Architecture

```typescript
class NotificationService {
  // Generates fallback tones using Web Audio API
  private createToneAudio(
    frequency: number,
    duration: number,
  ): HTMLAudioElement;

  // Converts AudioBuffer to WAV Blob for playback
  private audioBufferToWav(buffer: AudioBuffer): Blob;

  // Plays sound with error handling
  async playSound(type: "receive" | "sent"): Promise<void>;
}
```

### PWA Manifest Changes

```json
{
  "display": "standalone", // Changed from "fullscreen"
  "display_override": ["standalone", "fullscreen"],
  "start_url": "/?source=pwa", // Added tracking parameter
  "id": "/?source=pwa" // Updated app ID
}
```

### Install Button Detection

```typescript
// Detects beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  setDeferredPrompt(e);
  setIsInstallable(true);
});

// Checks if already installed
if (window.matchMedia("(display-mode: standalone)").matches) {
  setIsInstalled(true);
}
```

## Build Information

- Build Status: ✅ Successful
- Build Time: 30.429s
- PWA Precache: 112 entries (5877.32 KiB)
- No TypeScript errors
- All lint warnings resolved

## Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS & macOS) - with some limitations
- ✅ Firefox (Desktop & Mobile)
- ✅ Android WebView
- ⚠️ iOS Safari - Install must be done via Share → Add to Home Screen

## Notes

- Sound notifications require user interaction before playing (browser autoplay policy)
- PWA installation criteria vary by browser (Chrome requires engagement heuristics)
- WebView camera permissions may require additional Android manifest permissions
- Generated tones are simple sine waves - replace with custom sounds for better UX

## Future Enhancements

- [ ] Add different sounds for DMs vs Groups
- [ ] Customize sound volume in settings
- [ ] Add haptic feedback on mobile
- [ ] Custom sound upload feature
- [ ] iOS install instructions modal
