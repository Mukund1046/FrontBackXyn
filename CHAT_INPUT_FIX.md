# Chat Input Sticky Bottom Fix

## Issue
The chat input was sitting in the middle of the screen instead of sticking to the bottom of the chat interface.

## Root Cause
The parent `motion.div` wrapper in MainLayout didn't have `h-full` class, causing the ChatInterface to not fill the available vertical space properly.

## Solution

### 1. ✅ Fixed MainLayout Container
**File:** `src/components/layout/MainLayout.tsx`

Changes:
- Changed main content from `overflow-y-auto` to `overflow-hidden`
- Added `h-full` class to the motion.div wrapper
- This ensures the ChatInterface fills the full height

```tsx
// Before:
<main className="flex-1 overflow-y-auto">
  <motion.div key={ui.currentView}>
    {renderCurrentView()}
  </motion.div>
</main>

// After:
<main className="flex-1 overflow-hidden">
  <motion.div key={ui.currentView} className="h-full">
    {renderCurrentView()}
  </motion.div>
</main>
```

### 2. ✅ Improved ChatInterface Layout
**File:** `src/components/chat/ChatInterface.tsx`

Changes:
- Added `max-h-full overflow-hidden` to main container
- Added `flex-shrink-0` to header section
- Added `flex-shrink-0` to input form section
- This creates a proper flex layout with fixed header/footer and scrollable middle

```tsx
<div className="flex flex-col h-full max-h-full overflow-hidden">
  {/* Header - fixed at top */}
  <div className="... flex-shrink-0">...</div>
  
  {/* Messages - scrollable middle */}
  <div className="flex-1 overflow-y-auto">...</div>
  
  {/* Input - fixed at bottom */}
  <div className="... flex-shrink-0">...</div>
</div>
```

### 3. ✅ Added Missing Icon
**File:** `src/icons/lucide-adapter.tsx`

Added `ChevronLeft` export for sidebar collapse button.

## How It Works Now

### Chat Layout Structure:
```
┌─────────────────────────┐
│   Chat Header (fixed)   │ ← flex-shrink-0
├─────────────────────────┤
│                         │
│   Messages (scroll)     │ ← flex-1 overflow-y-auto
│                         │
│                         │
├─────────────────────────┤
│  Input Form (sticky)    │ ← flex-shrink-0
└─────────────────────────┘
```

### Other Views:
- Dashboard, Profile, Settings, MedicarePlans, HelpSupport all have `overflow-y-auto`
- They scroll normally within their containers
- Only ChatInterface has the special sticky bottom layout

## Files Modified

1. **src/components/layout/MainLayout.tsx** - Fixed container height
2. **src/components/chat/ChatInterface.tsx** - Added flex-shrink-0 and overflow classes
3. **src/icons/lucide-adapter.tsx** - Added ChevronLeft icon

## Testing Checklist

- [ ] Chat input stays at the bottom of the screen
- [ ] Chat messages scroll in the middle section
- [ ] Header stays fixed at top
- [ ] Input form stays fixed at bottom
- [ ] Send button and input are always visible
- [ ] Dashboard and other views still scroll properly
- [ ] Responsive on mobile and desktop
- [ ] Sidebar collapse/expand works
- [ ] No layout shifts when switching views

## Benefits

✅ **Fixed Layout:** Input always at bottom
✅ **Better UX:** Natural chat interface feel
✅ **Scrollable:** Messages scroll independently
✅ **Consistent:** Other views still scroll normally
✅ **Responsive:** Works on all screen sizes
