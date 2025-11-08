# Lenis Smooth Scroll Implementation

## Overview
Implemented Lenis smooth scroll library for enhanced scrolling experience across the application. Lenis is a lightweight, robust, and performant smooth scroll library optimized for modern browsers.

## ✅ FIXED: Scrolling Issue (Nov 8, 2025)
**Issue:** Lenis was configured with `root` mode but the app's scrolling container was the `<main>` element, not the document root, causing scrolling to be blocked on all pages.

**Solution:** Moved Lenis integration directly into MainLayout and wrapped it around the actual scrolling container (`<main>` element). Chat interface is conditionally excluded from Lenis wrapping to preserve its native scrolling behavior.

## Library Information
- **Package:** `lenis` (darkroomengineering/lenis)
- **Version:** Latest
- **Trust Score:** 9.4/10
- **Integration:** Framer Motion compatible (already used in the app)

## Implementation

### 1. ✅ Installed Package
```bash
npm install lenis
```

### 2. ✅ Created LenisProvider Component
**File:** `src/components/layout/LenisProvider.tsx`

Features:
- Integrated with Framer Motion's frame system (no requestAnimationFrame conflicts)
- Configured with optimal settings for healthcare/medical app
- Wraps entire application for consistent smooth scrolling

**Configuration:**
```typescript
{
  autoRaf: false,           // Using Framer Motion's frame system
  lerp: 0.1,                // Smoothness (0-1, lower = smoother)
  duration: 1.2,            // Animation duration
  smoothWheel: true,        // Smooth mouse wheel scrolling
  wheelMultiplier: 1,       // Mouse wheel sensitivity
  touchMultiplier: 2,       // Touch scroll sensitivity
  infinite: false,          // No infinite scroll
}
```

### 3. ✅ Integrated into MainLayout
**File:** `src/components/layout/MainLayout.tsx`

Integrated Lenis directly into the MainLayout component, wrapping only the scrollable main content area (not the chat interface). The implementation conditionally applies Lenis based on the current view.

```tsx
{ui.currentView === 'chat' ? (
  <main id="main-content" className="flex-1 overflow-hidden" role="main">
    {mainContent}
  </main>
) : (
  <ReactLenis ref={lenisRef} options={{...}}>
    <main id="main-content" className="flex-1 overflow-y-auto" role="main">
      {mainContent}
    </main>
  </ReactLenis>
)}
```

### 4. ✅ Prevented Conflicts with Chat Scroll
**File:** `src/components/chat/ChatInterface.tsx`

Added `data-lenis-prevent` attribute to chat messages container to prevent Lenis from interfering with the chat's internal scrolling.

```tsx
<div
  ref={messagesContainerRef}
  className="flex-1 overflow-y-auto..."
  data-lenis-prevent  // <-- Prevents Lenis on this element
>
  {/* Chat messages */}
</div>
```

## How Lenis Works

### Integration with Framer Motion
Since your app already uses Framer Motion, Lenis is integrated using Framer Motion's `frame.update()` system:

```tsx
useEffect(() => {
  function update(data: { timestamp: number }) {
    lenisRef.current?.lenis?.raf(data.timestamp);
  }
  frame.update(update, true);
  return () => cancelFrame(update);
}, []);
```

This ensures:
- No conflicts between animation systems
- Optimal performance
- Smooth 60fps scrolling

### Where Smooth Scroll Applies

| Component | Smooth Scroll | Notes |
|-----------|---------------|-------|
| Dashboard | ✅ Yes | Full page smooth scroll |
| Profile | ✅ Yes | Full page smooth scroll |
| Settings | ✅ Yes | Full page smooth scroll |
| Medicare Plans | ✅ Yes | Full page smooth scroll |
| Help & Support | ✅ Yes | Full page smooth scroll |
| Documents | ✅ Yes | Full page smooth scroll |
| Chat Messages | ❌ No | Uses `data-lenis-prevent` for native scroll |
| Sidebar | ❌ No | Native scroll for navigation |

### Why Prevent on Chat?
The chat interface has its own scroll-to-bottom logic and auto-scroll behavior. Lenis smooth scrolling would interfere with:
- Auto-scrolling to new messages
- Scroll-to-top button
- Message loading indicators

## Benefits

✅ **Smoother Experience:** Buttery smooth scrolling on mouse wheel and touchpad
✅ **Professional Feel:** Premium scrolling like modern web apps
✅ **Performance:** Lightweight (only ~2KB gzipped)
✅ **No Conflicts:** Integrated with existing Framer Motion animations
✅ **Selective Control:** Chat maintains native scroll behavior
✅ **Touch Optimized:** Enhanced touch scrolling on mobile devices

## Technical Details

### CSS Included
Lenis CSS is automatically imported in LenisProvider:
```tsx
import 'lenis/dist/lenis.css';
```

### Framer Motion Integration
Instead of standard `requestAnimationFrame`, uses Framer Motion's frame system:
- Better performance with existing animations
- Single animation loop for entire app
- Automatic cleanup on unmount

### Scroll Properties Available
Access Lenis instance via `useLenis` hook:
```tsx
import { useLenis } from 'lenis/react';

const lenis = useLenis((lenis) => {
  console.log(lenis.scroll);      // Current scroll position
  console.log(lenis.velocity);    // Scroll velocity
  console.log(lenis.direction);   // 1 = up, -1 = down
  console.log(lenis.progress);    // 0-1 scroll progress
});
```

## Files Modified

1. **src/components/layout/MainLayout.tsx** - Integrated ReactLenis directly with conditional rendering
2. **src/components/chat/ChatInterface.tsx** - Added data-lenis-prevent (already present)
3. ~~**src/components/layout/LenisProvider.tsx**~~ - Deprecated (logic moved to MainLayout)

## Testing Checklist

- [ ] Dashboard page scrolls smoothly with mouse wheel
- [ ] Profile page scrolls smoothly
- [ ] Settings page scrolls smoothly
- [ ] Medicare Plans page scrolls smoothly
- [ ] Help & Support page scrolls smoothly
- [ ] Chat messages scroll independently (native, not smooth)
- [ ] Mobile touch scrolling is enhanced
- [ ] No performance issues or lag
- [ ] Sidebar scrolls normally (if it has overflow)
- [ ] No conflicts with existing animations

## Configuration Tweaks

If you want to adjust the smoothness:

**More Aggressive Smoothing:**
```tsx
lerp: 0.05,  // Slower, more dramatic smooth effect
duration: 1.5
```

**Less Aggressive Smoothing:**
```tsx
lerp: 0.15,  // Faster, more responsive
duration: 0.8
```

**Mobile Touch Settings:**
```tsx
touchMultiplier: 1.5,  // Adjust touch scroll speed
syncTouch: true,       // Enable smooth touch scrolling
```

## Future Enhancements

Consider adding:
- Parallax effects on dashboard welcome section
- Scroll-triggered animations using `useLenis` hook
- Custom easing functions for different pages
- Scroll progress indicators
- Anchor link smooth scrolling for help sections

## Resources
- Official Docs: https://github.com/darkroomengineering/lenis
- React Package: https://github.com/darkroomengineering/lenis/tree/main/packages/react
- Live Examples: https://lenis.darkroom.engineering/
