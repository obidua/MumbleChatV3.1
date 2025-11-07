# MumbleChat Mobile PWA - Telegram-Style Design

## Overview

This update transforms MumbleChat into a fully functional Progressive Web App (PWA) with a mobile-first, Telegram-like design featuring bottom navigation.

## Key Changes Implemented

### 1. **Progressive Web App (PWA) Support**

- ✅ Installed `vite-plugin-pwa` and `workbox-window` for enhanced PWA capabilities
- ✅ Updated `vite.config.ts` with PWA plugin configuration
- ✅ Enhanced `manifest.webmanifest` with:
  - Portrait-primary orientation for mobile
  - App shortcuts for quick actions
  - Better metadata and categories
- ✅ Improved `index.html` with mobile-specific meta tags:
  - Viewport fit for notch support
  - Apple mobile web app configuration
  - Disabled format detection for better UX

### 2. **Mobile-First Bottom Navigation**

- ✅ Created new `BottomNav` component (`src/components/Navigation/BottomNav.tsx`)
- ✅ Telegram-style bottom tab bar with 4 main sections:
  - **Chats** - View all conversations (default view)
  - **New** - Start new direct messages
  - **Group** - Create new groups
  - **Profile** - View identity and settings
- ✅ Active state indicators with cyan accent color
- ✅ Smooth transitions and hover effects
- ✅ Automatically hidden on desktop (768px+)

### 3. **Responsive Layout System**

- ✅ Created `useMobile()` hook for device detection
- ✅ Updated `MainLayout.module.css`:
  - Bottom navigation spacing on mobile
  - Safe area inset support for notched devices
  - Hidden sidebar on mobile by default
- ✅ Full-screen conversation view on mobile
- ✅ Adaptive header visibility (hidden when in chat on mobile)

### 4. **Navigation & UX Improvements**

- ✅ Added back button to conversation header on mobile
- ✅ Clicking back returns to conversations list
- ✅ On mobile home screen, shows conversations list by default
- ✅ Full-screen chat experience when conversation is opened
- ✅ Smooth page transitions

### 5. **Mobile Optimizations**

- ✅ Created `mobile.css` with:
  - iOS safe area support
  - Disabled pull-to-refresh
  - Better tap targets (min 44px)
  - Prevented zoom on input focus
  - Smooth scrolling optimizations
  - Landscape mode adjustments
- ✅ Updated conversation styles for full-screen mobile view
- ✅ Touch-optimized button sizes
- ✅ Disabled text selection on navigation elements

### 6. **New Icons**

Created custom icons for the app:

- `IconHome` - Home/Chats navigation
- `IconMessage` - New message
- `IconSettings` - Settings/Profile
- `IconUser` - User/Group
- `IconBack` - Back navigation

## File Structure

```
apps/xmtp.chat/
├── src/
│   ├── assets/
│   │   └── mobile.css (new)
│   ├── components/
│   │   ├── App/
│   │   │   ├── AppLayout.tsx (updated)
│   │   │   └── SelectConversation.tsx (updated)
│   │   ├── Conversation/
│   │   │   ├── Conversation.tsx (updated)
│   │   │   └── Conversation.module.css (updated)
│   │   └── Navigation/
│   │       ├── BottomNav.tsx (new)
│   │       └── BottomNav.module.css (new)
│   ├── hooks/
│   │   └── useMobile.ts (new)
│   ├── icons/
│   │   ├── IconHome.tsx (new)
│   │   ├── IconMessage.tsx (new)
│   │   ├── IconSettings.tsx (new)
│   │   ├── IconUser.tsx (new)
│   │   └── IconBack.tsx (new)
│   ├── layouts/
│   │   └── MainLayout.module.css (updated)
│   └── main.tsx (updated)
├── public/
│   └── manifest.webmanifest (updated)
├── index.html (updated)
└── vite.config.ts (updated)
```

## How It Works

### Desktop Experience (768px+)

- Traditional sidebar navigation on the left
- Main content area on the right
- Header always visible
- No bottom navigation

### Mobile Experience (<768px)

- Bottom navigation bar with 4 tabs
- Conversations list as the default home screen
- Clicking a conversation opens full-screen chat
- Back button in chat header returns to conversations list
- Header hidden when in a conversation for maximum space
- Smooth transitions between views

### Navigation Flow on Mobile

1. **Home Screen** → Shows conversations list with bottom nav
2. **Tap Conversation** → Opens full-screen chat with back button
3. **Tap Back** → Returns to conversations list
4. **Bottom Nav Tabs** → Quick access to New DM, Groups, Profile

## Browser Support

- Modern browsers with PWA support
- iOS Safari (with safe area support)
- Android Chrome
- Desktop browsers (fallback to traditional layout)

## Installation as PWA

### iOS

1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App installs with proper icon and splash screen

### Android

1. Open in Chrome
2. Tap menu (3 dots)
3. Select "Add to Home Screen" or "Install App"
4. App installs as standalone PWA

### Desktop

1. Look for install prompt in browser address bar
2. Click install icon
3. App opens in standalone window

## Development

To run the development server:

```bash
cd apps/xmtp.chat
yarn dev
```

The PWA features are enabled in development mode for testing.

## Build for Production

```bash
cd apps/xmtp.chat
yarn build
```

This will generate the service worker and optimize all PWA assets.

## Testing Mobile Features

1. **Use browser DevTools**: Chrome/Edge DevTools → Device toolbar (Cmd/Ctrl + Shift + M)
2. **Test on real device**: Use `ngrok` or deploy to test server
3. **PWA features**: Use Lighthouse in DevTools to audit PWA compliance

## Key Features Summary

✅ **Offline Support** - Service worker caches assets for offline use
✅ **Installable** - Can be installed on home screen
✅ **Mobile-First** - Optimized for touch devices
✅ **Telegram-like UI** - Familiar bottom navigation pattern
✅ **Full-Screen Chats** - Maximum space for conversations
✅ **Safe Areas** - Support for notched devices
✅ **Fast Navigation** - Smooth transitions between views
✅ **Responsive** - Works on all screen sizes
✅ **Accessible** - Proper ARIA labels and keyboard support

## Future Enhancements

Potential improvements for future iterations:

- Push notifications support
- Offline message queueing
- Background sync for messages
- Swipe gestures for navigation
- Pull-to-refresh on conversations list
- Haptic feedback on interactions
- Dark/light theme toggle in bottom nav
- Unread message badges on bottom nav
- Custom splash screens for different devices

## Notes

- The app maintains backward compatibility with desktop layouts
- All existing features continue to work on larger screens
- Service worker is production-optimized with Workbox
- Mobile CSS is loaded separately to avoid affecting desktop
- Bottom nav is completely hidden on desktop (no code duplication)
