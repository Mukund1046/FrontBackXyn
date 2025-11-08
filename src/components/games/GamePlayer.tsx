import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { BreathingExercise } from './implementations/BreathingExercise';
import { MemorySequence } from './implementations/MemorySequence';
import { EchoGrove } from './implementations/EchoGrove';
import { GroundingColors } from './implementations/GroundingColors';
import { GoNoGo } from './implementations/GoNoGo';
import { TaskSwitcher } from './implementations/TaskSwitcher';
import { GrowthPath } from './implementations/GrowthPath';
import { ReactionTime } from './implementations/ReactionTime';
import { PatternRecognition } from './implementations/PatternRecognition';
import { PositiveJournal } from './implementations/PositiveJournal';
import { StroopTest } from './implementations/StroopTest';
import { TargetTracker } from './implementations/TargetTracker';
import { CardMatching } from './implementations/CardMatching';
import { MemoryBlossoms } from './implementations/MemoryBlossoms';
import { EmotionExplorer } from './implementations/EmotionExplorer';

export const GamePlayer: React.FC = () => {
  const { ui } = useAppStore();
  
  // Ensure currentView is always defined
  const currentView = ui?.currentView || '';
  
  // Extract game type from currentView (e.g., "game:breathing_exercise")
  const gameType = currentView.startsWith('game:') 
    ? currentView.replace('game:', '') 
    : null;

  if (!gameType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No game selected</p>
      </div>
    );
  }

  // Route to appropriate game component
  switch (gameType) {
    case 'breathing_exercise':
      return <BreathingExercise />;
    case 'memory_sequence':
      return <MemorySequence />;
    case 'echo_grove':
      return <EchoGrove />;
    case 'grounding_technique':
      return <GroundingColors />;
    case 'go_nogo':
      return <GoNoGo />;
    case 'task_switching':
      return <TaskSwitcher />;
    case 'growth_path':
      return <GrowthPath />;
    case 'reaction_time':
      return <ReactionTime />;
    case 'pattern_recognition':
      return <PatternRecognition />;
    case 'journaling':
      return <PositiveJournal />;
    case 'stroop_test':
      return <StroopTest />;
    case 'target_tracker':
      return <TargetTracker />;
    case 'card_matching':
      return <CardMatching />;
    case 'memory_blossoms':
      return <MemoryBlossoms />;
    case 'social_cognition':
      return <EmotionExplorer />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold text-gray-900">Coming Soon!</p>
            <p className="text-gray-600">This game is currently being developed.</p>
          </div>
        </div>
      );
  }
};
