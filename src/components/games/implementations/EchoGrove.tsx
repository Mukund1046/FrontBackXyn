import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Music, Disc, Bell } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const SOUNDS = [
  { id: 'sound1', icon: Volume2, color: 'from-blue-400 to-blue-600', name: 'Chime' },
  { id: 'sound2', icon: Music, color: 'from-purple-400 to-purple-600', name: 'Bell' },
  { id: 'sound3', icon: Disc, color: 'from-pink-400 to-pink-600', name: 'Drum' },
  { id: 'sound4', icon: Bell, color: 'from-green-400 to-green-600', name: 'Gong' },
] as const;

type SoundId = typeof SOUNDS[number]['id'];

// Audio context for generating sounds
const audioContext = typeof window !== 'undefined' 
  ? new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() 
  : null;

// Generate musical tones for each sound
const playTone = (frequency: number, duration: number = 0.3) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Sound frequencies mapped to each sound button
const SOUND_FREQUENCIES: Record<SoundId, number> = {
  sound1: 523.25, // C5 - Chime
  sound2: 659.25, // E5 - Bell
  sound3: 783.99, // G5 - Drum
  sound4: 1046.50, // C6 - Gong
};

export const EchoGrove: React.FC = () => {
  const [sequence, setSequence] = useState<SoundId[]>([]);
  const [userSequence, setUserSequence] = useState<SoundId[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundId | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [message, setMessage] = useState('Listen carefully...');
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewRound = useCallback(() => {
    const newSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)].id;
    const newSequence = [...sequence, newSound];
    setSequence(newSequence);
    setUserSequence([]);
    setMessage('Listen carefully...');
    playSequence(newSequence);
  }, [sequence]);

  const playSequence = async (seq: SoundId[]) => {
    setPlaying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (const soundId of seq) {
      setActiveSound(soundId);
      // Play the corresponding tone
      playTone(SOUND_FREQUENCIES[soundId], 0.4);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveSound(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setPlaying(false);
    setMessage('Your turn! Repeat the sequence');
  };

  const handleSoundClick = (soundId: SoundId) => {
    if (playing || gameOver) return;

    const newUserSeq = [...userSequence, soundId];
    setUserSequence(newUserSeq);

    // Play sound feedback when user clicks
    playTone(SOUND_FREQUENCIES[soundId], 0.3);
    
    setActiveSound(soundId);
    setTimeout(() => setActiveSound(null), 200);

    if (sequence[newUserSeq.length - 1] !== soundId) {
      setGameOver(true);
      setMessage('Game Over!');
      recordSession({
        gameType: 'echo_grove',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setScore(score + level * 10);
      setLevel(level + 1);
      setMessage('Perfect! Next level...');
      setTimeout(startNewRound, 1000);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Game Over!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Level Reached</p>
              <p className="text-2xl font-bold text-blue-600">{level}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="w-full px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Level:</span>
              <span className="text-xl font-bold text-purple-600">{level}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Score:</span>
              <span className="text-xl font-bold text-primary-600">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Echo Grove</h2>
            <motion.p
              key={message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-medium text-primary-600"
            >
              {message}
            </motion.p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{userSequence.length} / {sequence.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: sequence.length > 0 ? `${(userSequence.length / sequence.length) * 100}%` : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {SOUNDS.map((sound) => {
              const Icon = sound.icon;
              const isActive = activeSound === sound.id;
              
              return (
                <motion.button
                  key={sound.id}
                  whileHover={!playing ? { scale: 1.05 } : {}}
                  whileTap={!playing ? { scale: 0.95 } : {}}
                  onClick={() => handleSoundClick(sound.id)}
                  disabled={playing}
                  className={`
                    h-32 rounded-2xl transition-all duration-200 relative overflow-hidden
                    ${playing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer shadow-lg hover:shadow-xl'}
                  `}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${sound.color} ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Icon className={`w-12 h-12 mb-2 ${isActive ? 'animate-bounce' : ''}`} />
                    <span className="font-medium">{sound.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
