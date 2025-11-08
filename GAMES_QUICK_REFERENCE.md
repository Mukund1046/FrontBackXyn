# 🎮 Cognitive Games - Quick Reference Guide

## Game Type Mapping

| Game Name | Game Type (ID) | Category | File |
|-----------|----------------|----------|------|
| Mindful Breathing | `breathing_exercise` | Anxiety | BreathingExercise.tsx |
| Echo Grove | `echo_grove` | Anxiety | EchoGrove.tsx |
| Grounding Colors | `grounding_technique` | Anxiety | GroundingColors.tsx |
| Go/No-Go Challenge | `go_nogo` | ADHD | GoNoGo.tsx |
| Task Switcher | `task_switching` | ADHD | TaskSwitcher.tsx |
| Growth Path | `growth_path` | ADHD | GrowthPath.tsx |
| Reaction Time Test | `reaction_time` | ADHD | ReactionTime.tsx |
| Pattern Recognition | `pattern_recognition` | Depression | PatternRecognition.tsx |
| Positive Memory Journal | `journaling` | Depression | PositiveJournal.tsx |
| Stroop Test | `stroop_test` | Stress | StroopTest.tsx |
| Target Tracker | `target_tracker` | Stress | TargetTracker.tsx |
| Memory Sequence | `memory_sequence` | General | MemorySequence.tsx |
| Card Matching | `card_matching` | General | CardMatching.tsx |
| Memory Blossoms | `memory_blossoms` | General | MemoryBlossoms.tsx |
| Emotion Explorer | `social_cognition` | Autism | EmotionExplorer.tsx |

---

## How to Add More Games

### 1. Create Game Component
```typescript
// src/components/games/implementations/NewGame.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

export const NewGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const handleComplete = () => {
    setGameOver(true);
    recordSession({
      gameType: 'new_game',
      score,
      completedAt: new Date(),
      duration: Math.floor((Date.now() - startTime) / 1000),
    });
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold">Game Complete!</h2>
          <p className="text-4xl font-bold text-primary-600">{score}</p>
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl"
          >
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="p-6">
        <button
          onClick={() => setCurrentView('cognitive-games')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {/* Your game content here */}
      </div>
    </div>
  );
};
```

### 2. Add to GamePlayer.tsx
```typescript
import { NewGame } from './implementations/NewGame';

// In switch statement:
case 'new_game':
  return <NewGame />;
```

### 3. Add to Backend game_library.py
```python
GameConcept(
    title="New Game",
    description="Your game description",
    game_type="new_game",
    cognitive_domain="Your Domain",
    mechanics_list=[
        GameMechanicsDetail(step_number=1, instruction="Step 1"),
        GameMechanicsDetail(step_number=2, instruction="Step 2"),
    ],
    scoring_rules="Your scoring rules",
    difficulty=1
)
```

---

## Common Patterns

### Scoring System
```typescript
// Fixed points per action
setScore(score + 10);

// Level-based scoring
setScore(score + level * 10);

// Streak bonus
setScore(score + 10 + streak * 5);

// Time-based penalty
score: Math.max(0, 1000 - moves * 10)
```

### Lives System
```typescript
const [lives, setLives] = useState(3);

// Lose a life
setLives(lives - 1);

// Check game over
if (lives <= 0) {
  setGameOver(true);
}

// Display
<span>{'❤️'.repeat(lives)}</span>
```

### Timer System
```typescript
const [timeLeft, setTimeLeft] = useState(60);

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        setGameOver(true);
        return 0;
      }
      return t - 1;
    });
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

### Progress Bar
```typescript
<div className="w-full h-2 bg-gray-200 rounded-full">
  <motion.div
    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
    animate={{ width: `${(current / total) * 100}%` }}
  />
</div>
```

### Feedback Animation
```typescript
const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

// Show feedback
setFeedback(isCorrect ? 'correct' : 'incorrect');

// Clear after delay
setTimeout(() => setFeedback(null), 1000);

// Render
{feedback && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className={feedback === 'correct' ? 'text-green-600' : 'text-red-600'}
  >
    {feedback === 'correct' ? '✓' : '✗'}
  </motion.div>
)}
```

---

## Styling Guide

### Gradient Backgrounds
```typescript
className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
```

### Button Styles
```typescript
// Primary button
className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"

// Secondary button
className="px-6 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50"

// Disabled button
className="px-8 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
disabled={true}
```

### Card Styles
```typescript
className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
```

### Header Layout
```typescript
<div className="p-6">
  <div className="flex items-center justify-between max-w-2xl mx-auto">
    <button>Back</button>
    <div className="flex gap-4">
      <div className="bg-white px-4 py-2 rounded-full shadow-md">
        <span className="text-sm text-gray-600">Label:</span>
        <span className="text-xl font-bold text-primary-600">{value}</span>
      </div>
    </div>
  </div>
</div>
```

---

## Animation Presets

### Fade In
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

### Scale In
```typescript
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: 'spring', duration: 0.8 }}
```

### Slide In
```typescript
initial={{ x: -20, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ duration: 0.3 }}
```

### Bounce
```typescript
animate={{ y: [0, -10, 0] }}
transition={{ duration: 0.5, repeat: Infinity }}
```

### Pulse
```typescript
animate={{ scale: [1, 1.1, 1] }}
transition={{ duration: 1, repeat: Infinity }}
```

### Button Hover
```typescript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## Session Recording

### Required Fields
```typescript
recordSession({
  gameType: 'game_identifier',    // Must match backend
  score: 100,                      // Number
  completedAt: new Date(),         // Current timestamp
  duration: 180,                   // Seconds
});
```

### When to Record
- ✅ On game completion
- ✅ On game over (failure)
- ✅ On time expiration
- ❌ On game abandonment (back button)

---

## Responsive Breakpoints

```css
/* Mobile First */
className="text-2xl md:text-3xl lg:text-4xl"

/* Grid Layouts */
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"

/* Spacing */
className="p-4 md:p-6 lg:p-8"

/* Container Width */
className="max-w-md md:max-w-lg lg:max-w-2xl"
```

---

## Testing Checklist

- [ ] Build compiles without errors
- [ ] Game loads correctly
- [ ] Back button returns to library
- [ ] Score updates properly
- [ ] Completion screen shows
- [ ] Session records to store
- [ ] Animations run smoothly
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] TypeScript types correct

---

## Common Issues & Fixes

### Issue: Icons not found
**Fix**: Add to `lucide-adapter.tsx`
```typescript
export const IconName = makeIcon('nucleo-file-name');
```

### Issue: Animation not smooth
**Fix**: Use hardware-accelerated properties
```typescript
// Good: transform, opacity
animate={{ scale: 1, opacity: 1 }}

// Avoid: width, height, margin
```

### Issue: Memory leak warning
**Fix**: Clean up timers and subscriptions
```typescript
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

### Issue: State not updating
**Fix**: Use functional updates
```typescript
// Good
setScore(s => s + 10);

// Risky
setScore(score + 10);
```

---

## Performance Tips

1. **Memoize callbacks**
```typescript
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);
```

2. **Lazy load components**
```typescript
const GameComponent = lazy(() => import('./GameComponent'));
```

3. **Optimize animations**
```typescript
// Use layoutId for smooth transitions
<motion.div layoutId="element-id" />
```

4. **Reduce re-renders**
```typescript
// Extract static content
const staticContent = useMemo(() => <ExpensiveComponent />, []);
```

---

## Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Lucide Icons**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hooks**: https://react.dev/reference/react

---

**Quick Start**: Copy an existing game component as a template and modify the mechanics!
