# Lenis Smooth Scroll Fix - November 8, 2025

## Problem
After implementing Lenis smooth scroll, **scrolling was completely blocked on all pages** of the application.

## Root Cause
The Lenis library was configured with `root` mode in a separate `LenisProvider` component, which expects the document root (`html`/`body`) to be the scrolling container. However, the app's architecture has:
- `overflow-hidden` on the main layout container
- The actual scrolling happens in the `<main>` element, NOT the document root
- This mismatch prevented Lenis from detecting and controlling the correct scroll container

## Solution Applied

### 1. Removed Global LenisProvider Wrapper
**File:** `src/App.tsx`
- Removed the `<LenisProvider>` wrapper from around `<MainLayout />`
- Removed unused import

### 2. Integrated Lenis Directly into MainLayout
**File:** `src/components/layout/MainLayout.tsx`

**Changes:**
- Imported `ReactLenis`, `LenisRef`, and Lenis CSS directly
- Added `lenisRef` and Framer Motion frame integration
- **Conditionally applied Lenis based on current view:**
  - **Chat view:** No Lenis wrapper (preserves native scrolling for chat)
  - **All other views:** Wrapped `<main>` element with `<ReactLenis>`

```tsx
{ui.currentView === 'chat' ? (
  <main id="main-content" className="flex-1 overflow-hidden" role="main">
    {mainContent}
  </main>
) : (
  <ReactLenis
    ref={lenisRef}
    options={{
      autoRaf: false,
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    }}
  >
    <main id="main-content" className="flex-1 overflow-y-auto" role="main">
      {mainContent}
    </main>
  </ReactLenis>
)}
```

### 3. Key Implementation Details

#### Correct Container Targeting
- Lenis now wraps the actual scrolling container (`<main>` element)
- Removed `root` prop so Lenis controls the wrapped element, not the document root

#### Conditional Rendering
- Chat interface is **completely excluded** from Lenis wrapping
- Other pages (Dashboard, Profile, Settings, Plans, Help, Documents) get smooth scrolling
- No need for `data-lenis-prevent` on chat since it's not wrapped by Lenis at all

#### Framer Motion Integration
- Maintained integration with Framer Motion's frame system
- Uses `useEffect` hook to sync Lenis RAF with Framer Motion
- Properly cleans up on unmount

## Testing Checklist

✅ **All pages should now scroll smoothly:**
- Dashboard
- Profile
- Settings
- Medicare Plans
- Help & Support
- Documents

✅ **Chat interface should scroll independently:**
- Chat messages container has its own native scrolling
- Auto-scroll to new messages works
- Scroll-to-top button works
- No interference from Lenis

## Files Modified

1. ✅ `src/App.tsx` - Removed LenisProvider wrapper and import
2. ✅ `src/components/layout/MainLayout.tsx` - Integrated ReactLenis with conditional rendering
3. ✅ `LENIS_SMOOTH_SCROLL.md` - Updated documentation

## Deprecated Files

- `src/components/layout/LenisProvider.tsx` - No longer used (can be deleted)

## How It Works Now

1. **When user navigates to any page except Chat:**
   - The `<main>` element is wrapped by `<ReactLenis>`
   - Lenis applies smooth scrolling to the `<main>` element
   - User experiences buttery smooth scrolling

2. **When user navigates to Chat:**
   - The `<main>` element is NOT wrapped by `<ReactLenis>`
   - Chat uses native browser scrolling
   - Chat's internal scroll logic works perfectly

3. **Frame Integration:**
   - Lenis is synced with Framer Motion's frame system
   - No conflicts with existing animations
   - Optimal performance with single animation loop

## Benefits of This Fix

✅ **Scrolling works correctly** on all pages
✅ **Chat interface preserved** - no interference with chat scrolling
✅ **Cleaner architecture** - Lenis logic consolidated in MainLayout
✅ **Better performance** - No unnecessary Lenis processing for chat
✅ **Proper container targeting** - Lenis controls the actual scrolling element

## Technical Notes

### Why Not Use `root` Mode?
- `root` mode requires the document (`html`/`body`) to be the scrolling container
- Our app uses a fixed-height layout with internal scrolling
- The `<main>` element is the scroll container, not the document root

### Why Conditional Rendering?
- Chat has complex scroll behavior (auto-scroll, scroll-to-top, etc.)
- Completely excluding chat from Lenis is cleaner than using `data-lenis-prevent`
- Better performance - Lenis doesn't process any events when on chat view

### Why Framer Motion Integration?
- App already uses Framer Motion for animations
- Using Framer's frame system prevents RAF conflicts
- Single animation loop for better performance
