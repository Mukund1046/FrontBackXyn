import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Play, Square, AlertCircle, CheckCircle } from 'lucide-react';
import { useParkinsonStore } from '../../../../stores/useParkinsonStore';
import { parkinsonApi } from '../../../../lib/api/parkinsonApi';

interface TapData {
  timestamp: number;
  x: number;
  y: number;
}

export const TappingTest: React.FC = () => {
  const { selectedSubject } = useParkinsonStore();
  const [isRecording, setIsRecording] = useState(false);
  const [taps, setTaps] = useState<TapData[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hand, setHand] = useState<'left' | 'right'>('right');

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTaps([]);
    setTimeLeft(10);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isRecording) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const tapData: TapData = {
      timestamp: Date.now() - startTimeRef.current,
      x: x / rect.width,
      y: y / rect.height,
    };

    setTaps((prev) => [...prev, tapData]);

    // Visual feedback
    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full bg-primary-400 pointer-events-none animate-ping';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    ripple.style.marginLeft = '-20px';
    ripple.style.marginTop = '-20px';
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const submitTest = async () => {
    if (taps.length === 0 || !selectedSubject) {
      setError('Please complete the tapping test first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const testData = {
        subject_id: selectedSubject.id,
        hand: hand,
        duration: 10000,
        taps: taps,
        tap_count: taps.length,
      };

      const response = await parkinsonApi.tests.tapping(testData);
      setResult(response);
      setTaps([]);
    } catch (err: any) {
      console.error('Test submission error:', err);
      const errorMsg = err.message || 'Failed to analyze tapping data. Please try again.';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const resetTest = () => {
    setTaps([]);
    setTimeLeft(10);
    setCountdown(null);
    setResult(null);
    setError(null);
  };

  const calculateTapMetrics = () => {
    if (taps.length < 2) return null;

    const intervals: number[] = [];
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i].timestamp - taps[i - 1].timestamp);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const tapsPerSecond = (1000 / avgInterval).toFixed(2);

    return {
      totalTaps: taps.length,
      avgInterval: avgInterval.toFixed(0),
      tapsPerSecond,
    };
  };

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Please select a subject first</p>
      </div>
    );
  }

  const metrics = calculateTapMetrics();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tapping Test</h2>
        <p className="text-gray-600 text-sm">
          Tap as fast and consistently as possible for 10 seconds
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                result.prediction === "Parkinson's Detected" ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {result.prediction === "Parkinson's Detected" ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {result.prediction}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Confidence: <span className="font-semibold">{(result.confidence_score * 100).toFixed(1)}%</span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Probability of Parkinson's: {(result.probability_parkinsons * 100).toFixed(1)}%
                </p>
                {result.metrics && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">
                      Total Taps: <span className="font-semibold">{result.metrics.tap_count}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Avg Taps/sec: <span className="font-semibold">{result.metrics.taps_per_second?.toFixed(2)}</span>
                    </p>
                  </div>
                )}
                <button
                  onClick={resetTest}
                  className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Take Another Test
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && (
        <>
          {/* Hand Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select hand:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setHand('right')}
                disabled={isRecording}
                className={`p-4 border-2 rounded-xl transition-all disabled:opacity-50 ${
                  hand === 'right'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🤚</div>
                  <p className="font-medium text-gray-900">Right Hand</p>
                </div>
              </button>
              <button
                onClick={() => setHand('left')}
                disabled={isRecording}
                className={`p-4 border-2 rounded-xl transition-all disabled:opacity-50 ${
                  hand === 'left'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🖐️</div>
                  <p className="font-medium text-gray-900">Left Hand</p>
                </div>
              </button>
            </div>
          </div>

          {/* Tapping Area */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200">
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="text-9xl font-bold text-primary-600"
                    >
                      {countdown}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {countdown === null && !isRecording && taps.length === 0 && (
                <div className="text-center py-20">
                  <Hand className="w-24 h-24 text-primary-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6">Ready to start?</p>
                  <button
                    onClick={startCountdown}
                    className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg inline-flex items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    Start Test
                  </button>
                </div>
              )}

              {isRecording && (
                <div
                  onClick={handleTap}
                  onTouchStart={handleTap}
                  className="relative bg-white rounded-xl border-4 border-primary-500 cursor-pointer select-none touch-none"
                  style={{ minHeight: '400px' }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-7xl font-bold text-primary-600 mb-4"
                    >
                      {timeLeft}
                    </motion.div>
                    <p className="text-2xl font-semibold text-gray-700">
                      Tap Here!
                    </p>
                    <p className="text-lg text-gray-500 mt-2">
                      Taps: {taps.length}
                    </p>
                  </div>
                </div>
              )}

              {!isRecording && taps.length > 0 && metrics && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Test Complete!</h3>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-3xl font-bold text-primary-600">{metrics.totalTaps}</p>
                      <p className="text-sm text-gray-600">Total Taps</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-3xl font-bold text-primary-600">{metrics.tapsPerSecond}</p>
                      <p className="text-sm text-gray-600">Taps/Second</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-3xl font-bold text-primary-600">{metrics.avgInterval}</p>
                      <p className="text-sm text-gray-600">Avg Interval (ms)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetTest}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {taps.length > 0 && !isRecording && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={submitTest}
              disabled={isUploading}
              className="w-full px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </span>
              ) : (
                'Submit for Analysis'
              )}
            </motion.button>
          )}
        </>
      )}

      {/* Instructions */}
      {!result && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-900 font-medium mb-2">
            📝 Instructions
          </p>
          <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Select which hand you'll use for tapping</li>
            <li>Click "Start Test" button</li>
            <li>Wait for the 3-2-1 countdown</li>
            <li>Tap the screen as fast as you can for 10 seconds</li>
            <li>Try to maintain consistent rhythm</li>
            <li>Review metrics and submit for analysis</li>
          </ol>
        </div>
      )}
    </div>
  );
};
