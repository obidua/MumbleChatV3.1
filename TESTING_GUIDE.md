# Testing Guide for MumbleChat Mobile PWA

## Quick Start

### 1. Start the Development Server

```bash
cd "apps/xmtp.chat"
yarn dev
```

The app will open at `http://localhost:5189`

### 2. Test Mobile View in Browser

#### Chrome/Edge DevTools

1. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. Click the device toolbar icon or press `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
3. Select a mobile device (e.g., iPhone 12/13/14)
4. Refresh the page

#### What You Should See

- **Bottom Navigation Bar** with 4 tabs (Chats, New, Group, Profile)
- **No sidebar** on mobile
- **Conversations list** as the default home screen
- **Full-screen header** with hamburger menu hidden

### 3. Test Navigation Flow

#### Step 1: View Conversations List

- You should see all your conversations
- Bottom nav should be visible
- "Chats" tab should be active (cyan highlight)

#### Step 2: Open a Conversation

- Click/tap on any conversation
- Conversation should open in **full-screen**
- Header should show **back button** (←) on the left
- Bottom nav should still be visible
- Content should take full screen space

#### Step 3: Navigate Back

- Click/tap the **back button** (←) in the conversation header
- You should return to the conversations list
- Bottom nav should still be visible

#### Step 4: Test Bottom Nav Tabs

- **Chats Tab**: Always returns to conversations list
- **New Tab**: Opens "New Direct Message" modal
- **Group Tab**: Opens "Create Group" modal
- **Profile Tab**: Opens identity/profile view

### 4. Test on Real Mobile Device

#### Option A: Using ngrok (Recommended)

```bash
# Install ngrok if not already installed
brew install ngrok  # macOS
# or download from https://ngrok.com

# In a new terminal, while dev server is running
ngrok http 5189
```

Copy the HTTPS URL (e.g., `https://xxxx-xxx-xxx-xxx.ngrok.io`) and open it on your mobile device.

#### Option B: Local Network

1. Find your computer's IP address:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Open `http://YOUR_IP:5189` on your mobile device (must be on same WiFi)

### 5. Test PWA Installation

#### iOS (Safari)

1. Open the site in Safari on your iPhone/iPad
2. Tap the **Share** button (square with arrow)
3. Scroll and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon should appear on your home screen
6. Launch it - should open as standalone app (no browser UI)

#### Android (Chrome)

1. Open the site in Chrome on your Android device
2. Tap the menu (⋮) in the top-right
3. Select **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"**
5. The app should install and open as standalone

### 6. Features to Test

#### Bottom Navigation

- [ ] All 4 tabs are visible
- [ ] Active tab has cyan highlight
- [ ] Tapping tabs navigates correctly
- [ ] Bottom nav is fixed at bottom
- [ ] Bottom nav respects safe area on notched devices

#### Conversations List

- [ ] Shows all conversations
- [ ] Can scroll through list
- [ ] Tapping conversation opens full-screen chat
- [ ] Header shows app name and controls

#### Full-Screen Chat

- [ ] Opens in full screen on mobile
- [ ] Back button appears in header
- [ ] Messages take full screen width
- [ ] Composer is at bottom
- [ ] Can send messages
- [ ] Can scroll through messages
- [ ] Back button returns to conversations list

#### Responsive Behavior

- [ ] On desktop (>768px): Sidebar visible, no bottom nav
- [ ] On mobile (<768px): Bottom nav visible, no sidebar
- [ ] Smooth transitions between views
- [ ] No layout shifts or jumps

#### PWA Features

- [ ] Can install to home screen
- [ ] Works in standalone mode
- [ ] Proper splash screen (uses theme colors)
- [ ] Icon appears correctly
- [ ] App name is correct

### 7. Troubleshooting

#### Bottom Nav Not Showing

- Check viewport width in DevTools (should be <768px)
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

#### Full-Screen Chat Not Working

- Clear browser cache
- Check if you're actually in a conversation route (should have conversation ID in URL)

#### PWA Installation Not Working

- Make sure you're using HTTPS (required for PWA)
- Use ngrok for HTTPS on localhost
- Check browser console for errors

#### Styling Issues

- Clear browser cache completely
- Check if mobile.css is loaded (Network tab in DevTools)
- Verify CSS variables are defined

### 8. Performance Testing

#### Lighthouse Audit

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Progressive Web App** and **Mobile**
4. Click **"Generate report"**

**Expected Scores:**

- PWA: 90-100
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+

### 9. Browser Compatibility

Test on multiple browsers if possible:

- ✅ Chrome/Edge (Best support)
- ✅ Safari iOS (Good support with some limitations)
- ✅ Firefox (Good support)
- ⚠️ Samsung Internet (Should work, but test)

### 10. Known Issues & Limitations

- Service worker only works over HTTPS or localhost
- Some iOS Safari versions have limitations with PWA features
- Background sync requires user interaction on iOS
- Push notifications not yet implemented

## Debugging Tips

### View Console Logs

```javascript
// In browser console, check:
console.log("Is mobile:", window.innerWidth < 768);
console.log("Current path:", window.location.pathname);
```

### Check Service Worker

1. Chrome DevTools → Application tab → Service Workers
2. Should see service worker registered
3. Status should be "activated and running"

### Inspect Network Requests

1. DevTools → Network tab
2. Check if mobile.css is loaded
3. Verify all assets load successfully

## Success Criteria

✅ Bottom navigation visible on mobile (<768px)
✅ Conversations list as default home screen on mobile
✅ Full-screen chat when conversation is opened
✅ Back button returns to conversations list
✅ Smooth transitions between views
✅ App installable on iOS and Android
✅ Works in standalone mode
✅ No layout issues on different screen sizes

## Next Steps After Testing

If everything works:

1. Build for production: `yarn build`
2. Test the production build locally
3. Deploy to your hosting service
4. Test PWA installation on deployed version
5. Share with users!

---

**Need Help?** Check the MOBILE_PWA_UPDATES.md for detailed documentation of all changes.
