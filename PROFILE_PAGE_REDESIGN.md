# Profile/Identity Page Redesign

## Overview

Complete redesign of the Identity/Profile page with beautiful, theme-consistent cards featuring cyan/purple gradient accents, glass-morphism effects, and responsive mobile layouts.

## Design Features

### 🎨 Visual Design

#### Account Identity Card

- **Gradient Background**: Dark gradient with radial cyan glow at top-right
- **Border**: Cyan border (`rgba(10, 255, 241, 0.2)`) with glow effect
- **Hover State**: Border intensifies, lifts up 2px with enhanced shadow
- **Glass Effect**: Backdrop blur (16px) with semi-transparent background
- **Multi-layer Shadows**:
  - Base: `0 12px 32px rgba(4, 8, 20, 0.5)`
  - Glow: `0 0 60px rgba(10, 255, 241, 0.08)`

#### Section Headers

- **Gradient Text**: Cyan to purple gradient with clip-path
- **Icons**: Inline SVG icons with cyan color (#0afff1)
- **Spacing**: 24px icon with 8px gap

#### Information Rows

- **Label Section**:
  - Uppercase text with 0.1em letter spacing
  - Cyan color: `rgba(10, 255, 241, 0.9)`
  - Icon: 18px SVG in cyan
  - Fixed width: 120px
- **Value Section**:
  - Enhanced BadgeWithCopy component
  - Monospace font for IDs
  - Dark background with cyan border
  - Hover effects with glow

### 📋 Installation Cards

#### Card Structure

- **Purple Gradient Glow**: Radial gradient at bottom-left
- **Individual Installation Rows**:
  - Dark background: `rgba(10, 13, 25, 0.6)`
  - Cyan border: `rgba(10, 255, 241, 0.12)`
  - Hover: Slides 4px to right, border intensifies
  - Rounded corners: 8px

#### Installation Metadata Grid

- **Responsive Grid**: Auto-fit columns (min 140px)
- **Metadata Items**:
  - Label: Uppercase, 12px, gray text
  - Value: 14px, light text
  - Includes: Created time, Expiry time, Status, Actions

#### Status Indicators

- **Current Badge**:
  - Cyan gradient background
  - Dark text (#04060f)
  - Pill shape (999px radius)
  - Glow shadow: `0 4px 12px rgba(10, 255, 241, 0.3)`
- **Active Status**: Green checkmark ✓ with cyan color
- **Error Badge**: Red warning ⚠️ with red border and glow

#### Action Buttons

- **Revoke Button (Single)**:
  - Red gradient background with transparency
  - Red border: `rgba(239, 68, 68, 0.3)`
  - Hover: Lifts up, increases glow
  - Icon position: Inline with metadata
- **Revoke All Button**:
  - Positioned bottom-right
  - Larger padding: `sm` x `lg`
  - Enhanced red gradient on hover

### 🎯 Components Enhanced

#### BadgeWithCopy Component

**New Styling:**

```css
- Background: Dark dual-gradient
- Border: Cyan with glow effect
- Font: Monaco/Menlo monospace
- Padding: 6px 12px
- Shadows: Multi-layer with cyan glow
- Hover: Border intensifies, lifts 1px up
- Copy Button: Cyan with background on hover
```

#### Section Icons

**Three Icon Types:**

1. **User Icon** (Account Identity)
   - User profile silhouette
   - 24x24px in section header

2. **Desktop/Monitor Icon** (Installations)
   - Computer monitor graphic
   - Represents multiple devices

3. **Metadata Icons** (Info Rows)
   - Mail envelope (Address)
   - Inbox (Inbox ID)
   - CPU/Chip (Installation ID)
   - All 18x18px inline

### 📱 Mobile Responsiveness

#### Breakpoint Adjustments

**768px (Tablet)**

- Reduced card padding: `md` → `sm`
- Info rows: Vertical stack instead of horizontal
- Label width: Auto (no fixed 120px)

**520px (Small Mobile)**

- Further reduced padding
- Smaller border radius
- Condensed font sizes
- Installation metadata: Single column

#### Layout Behavior

- Cards maintain full width
- Text remains readable
- Touch targets: Minimum 44x44px
- Proper spacing with safe areas
- Scrollable content area

### 🎨 Color Palette

**Primary Colors:**

- Cyan: `#0afff1` (primary accent)
- Purple: `#9772fb` (secondary accent)
- Dark Base: `rgba(6, 9, 20, 0.95)`
- Dark Surface: `rgba(10, 13, 25, 0.9)`

**Border Variations:**

- Default: `rgba(10, 255, 241, 0.2)`
- Hover: `rgba(10, 255, 241, 0.35)`
- Subtle: `rgba(10, 255, 241, 0.12)`
- Strong: `rgba(10, 255, 241, 0.32)`

**Text Colors:**

- Primary: `rgba(226, 232, 240, 0.95)`
- Secondary: `rgba(148, 163, 184, 0.7)`
- Accent: `#0afff1`

**Error/Warning:**

- Background: `rgba(239, 68, 68, 0.15)`
- Border: `rgba(239, 68, 68, 0.3)`
- Text: `rgba(248, 113, 113, 0.95)`

### ✨ Interactive Effects

**Transitions:**

- All elements: `0.2s` or `0.3s ease`
- Smooth hover states
- Transform on hover (translateY, translateX, scale)

**Hover States:**

1. **Cards**: Border glow + lift effect
2. **Badges**: Enhanced border + lift
3. **Buttons**: Color change + scale/lift
4. **Rows**: Slide right + border intensity

**Shadows:**

- Base shadows for depth
- Glow shadows for theme accent
- Enhanced on hover
- Multi-layer for realistic depth

### 📂 Files Modified

#### New Files Created

- `src/components/Identity/IdentityModal.module.css` - Complete card styling

#### Files Modified

- `src/components/Identity/IdentityModal.tsx` - New card-based layout with inline SVG icons
- `src/components/BadgeWithCopy.module.css` - Enhanced theme-consistent styling

#### Files Replaced

- Old table-based InstallationTable component replaced with card-based design

### 🔧 Implementation Details

#### Account Identity Section

```tsx
<div className={classes.identityCard}>
  <div className={classes.cardContent}>
    {/* Gradient title with icon */}
    {/* Info rows with labels and values */}
  </div>
</div>
```

#### Installations Section

```tsx
<div className={classes.installationsCard}>
  {/* Header with badge count */}
  {/* Map over installations */}
  {installations.map((installation) => (
    <div className={classes.installationRow}>
      {/* Installation ID with current badge */}
      {/* Metadata grid: Created, Expires, Status, Action */}
    </div>
  ))}
  {/* Revoke all button */}
</div>
```

### 📊 Data Display

**Information Shown:**

**Account Identity:**

1. Address (Ethereum address)
2. Inbox ID (XMTP inbox identifier)
3. Installation ID (Current device installation)

**Per Installation:**

1. Installation ID (Full hex string with copy)
2. Created (Relative time: "16 minutes ago")
3. Expires (Relative time: "in 3 months")
4. Status (✓ Active or ⚠️ Error)
5. Action (Revoke button for non-current)
6. Current Badge (Shown for active installation)

### 🎯 User Experience

**Key Improvements:**

1. **Visual Hierarchy**: Clear separation between identity and installations
2. **Scannable**: Easy to find specific information
3. **Interactive**: Hover states provide feedback
4. **Modern**: Glass-morphism and gradients match app theme
5. **Accessible**: High contrast text, proper touch targets
6. **Responsive**: Works perfectly on mobile and desktop

**Actions Available:**

- **Copy to Clipboard**: All IDs via BadgeWithCopy
- **Revoke Single**: Per-installation revoke button
- **Revoke All**: Bulk action for all other installations
- **Close Modal**: Via close button or navigation

### 🚀 Performance

**Optimizations:**

- CSS-only animations (GPU accelerated)
- Minimal re-renders with proper React hooks
- Lazy-loaded date formatting
- Efficient SVG icons (inline, not images)

**Bundle Impact:**

- No new dependencies added
- Pure CSS styling
- Inline SVG (no icon library needed)

### 🎨 Visual Preview

**Account Identity Card:**

```
╔═══════════════════════════════════════════╗
║  👤 Account Identity                      ║
║                                           ║
║  📧 ADDRESS                               ║
║     [0xd76f...a0c1ac] 📋                  ║
║                                           ║
║  📥 INBOX ID                              ║
║     [fa561a...e54343] 📋                  ║
║                                           ║
║  💾 INSTALLATION ID                       ║
║     [43d7a7...60415f] 📋                  ║
╚═══════════════════════════════════════════╝
```

**Installations Card:**

```
╔═══════════════════════════════════════════╗
║  🖥️ Installations               [2]       ║
║                                           ║
║  ┌────────────────────────────────────┐  ║
║  │ [53e110...415f31f]     [CURRENT]  │  ║
║  │                                     │  ║
║  │ Created: 16 min ago                │  ║
║  │ Expires: in 3 months               │  ║
║  │ Status: ✓ Active                   │  ║
║  └────────────────────────────────────┘  ║
║                                           ║
║  ┌────────────────────────────────────┐  ║
║  │ [43d7a7...60415f]                  │  ║
║  │                                     │  ║
║  │ Created: 1 hour ago                │  ║
║  │ Expires: in 3 months               │  ║
║  │ Status: ✓ Active                   │  ║
║  │ Action: [Revoke]                   │  ║
║  └────────────────────────────────────┘  ║
║                                           ║
║              [Revoke All Other Inst...] → ║
╚═══════════════════════════════════════════╝
```

---

**Status**: ✅ Complete and Production Ready  
**Theme**: 🎨 Cyan (#0afff1) + Purple (#9772fb)  
**Responsive**: 📱 Mobile + Tablet + Desktop  
**Style**: ✨ Glass-morphism + Gradients + Glow Effects
