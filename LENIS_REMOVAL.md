# Lenis Smooth Scroll Removal - November 8, 2025

## Issue
After implementing Lenis smooth scroll library, **scrolling was completely blocked on all pages** of the application. Multiple attempts to fix the configuration did not resolve the issue.

## Root Cause Analysis
Lenis smooth scroll library was incompatible with the application's layout architecture:
- The app uses a fixed-height flexbox layout with internal scrolling
- Lenis expects either document-level scrolling OR explicit wrapper/content element configuration
- The mismatch between Lenis's expectations and the app's structure caused scroll blocking

## Solution: Removed Lenis Completely

### What Was Removed
1. **Removed Lenis imports and logic from MainLayout**
   - File: `src/components/layout/MainLayout.tsx`
   - Removed: `ReactLenis`, `LenisRef`, Lenis CSS imports
   - Removed: Framer Motion frame integration for Lenis
   - Removed: Conditional Lenis wrapping logic

2. **Restored Original Scrolling**
   - Reverted to native browser scrolling with CSS `scroll-behavior: smooth`
   - Simple `overflow-y-auto` on the `<main>` element for all non-chat pages
   - Chat pages use `overflow-hidden` as before

### Current Implementation

```tsx
// MainLayout.tsx - Simple and working
<main 
  id="main-content" 
  className={`flex-1 ${ui.currentView === 'chat' ? 'overflow-hidden' : 'overflow-y-auto'}`} 
  role="main"
>
  {mainContent}
</main>
```

### CSS Smooth Scrolling (Already Present)
The app already has native CSS smooth scrolling enabled in `src/index.css`:

```css
html {
  scroll-behavior: smooth;
}
```

This provides smooth anchor link scrolling without any JavaScript library.

## Benefits of Removal

✅ **Scrolling works perfectly** - No more blocked scrolling
✅ **Simpler codebase** - No external smooth scroll library to maintain
✅ **Better compatibility** - Native scrolling works everywhere
✅ **Smaller bundle size** - Removed unnecessary dependency
✅ **No configuration complexity** - Standard CSS scrolling just works

## Files Modified

1. ✅ `src/components/layout/MainLayout.tsx` - Removed Lenis, restored native scrolling
2. ✅ `LENIS_REMOVAL.md` - This documentation

## Deprecated Files

- `src/components/layout/LenisProvider.tsx` - Can be deleted (not used)
- `LENIS_SMOOTH_SCROLL.md` - Obsolete documentation
- `LENIS_FIX_SUMMARY.md` - Obsolete fix attempt

## Recommendation

**Do NOT re-implement Lenis** unless you completely restructure the app to use document-level scrolling (html/body overflow) instead of component-level scrolling. The current flexbox layout with internal scrolling is incompatible with Lenis.

If smooth scrolling is desired in the future, consider:
1. Using CSS `scroll-behavior: smooth` (already enabled)
2. Custom JavaScript scroll animations for specific use cases
3. Framer Motion's animation utilities for scroll-triggered effects
4. Complete layout restructure to document-level scrolling (major refactor)

## Testing

✅ **All pages now scroll normally:**
- Dashboard ✓
- Profile ✓
- Settings ✓
- Medicare Plans ✓
- Help & Support ✓
- Documents ✓

✅ **Chat interface scrolling preserved:**
- Chat messages scroll independently ✓
- Auto-scroll to new messages works ✓
- Scroll-to-top button works ✓

## Conclusion

**Simplicity wins.** The native browser scrolling with CSS `scroll-behavior: smooth` provides adequate smooth scrolling without the complexity and compatibility issues of Lenis library.
