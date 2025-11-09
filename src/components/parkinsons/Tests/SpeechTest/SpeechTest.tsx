import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useParkinsonStore } from '../../../../stores/useParkinsonStore';
import { parkinsonApi } from '../../../../lib/api/parkinsonApi';

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog",
  "Peter Piper picked a peck of pickled peppers",
  "She sells seashells by the seashore",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood",
  "I scream, you scream, we all scream for ice cream"
];

export const SpeechTest: React.FC = () => {
  const { selectedSubject } = useParkinsonStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSentence, setSelectedSentence] = useState(SENTENCES[0]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/webm'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|webm|m4a)$/i)) {
        setError('Invalid file type. Please upload WAV, MP3, or WebM audio files.');
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      setRecordedBlob(file);
      setError(null);
    }
  };

  const submitTest = async () => {
    if (!recordedBlob || !selectedSubject) {
      setError('Please record or upload audio first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('subject_id', selectedSubject.id);
      formData.append('audio_file', recordedBlob, 'speech-test.wav');
      formData.append('sentence', selectedSentence);

      const response = await parkinsonApi.tests.speech(formData);
      setResult(response);
      setRecordedBlob(null);
      setRecordingTime(0);
    } catch (err: any) {
      console.error('Test submission error:', err);
      const errorMsg = err.message || 'Failed to analyze audio. Please try again.';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTest = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setResult(null);
    setError(null);
  };

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Please select a subject first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Speech Test</h2>
        <p className="text-gray-600 text-sm">
          Read the sentence below clearly and naturally
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
            className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl"
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
                <p className="text-xs text-gray-500">
                  Probability of Parkinson's: {(result.probability_parkinsons * 100).toFixed(1)}%
                </p>
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
          {/* Sentence Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a sentence to read:
            </label>
            <select
              value={selectedSentence}
              onChange={(e) => setSelectedSentence(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              {SENTENCES.map((sentence, idx) => (
                <option key={idx} value={sentence}>
                  {sentence}
                </option>
              ))}
            </select>

            <div className="mt-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <p className="text-2xl font-serif text-gray-900 text-center leading-relaxed">
                "{selectedSentence}"
              </p>
            </div>
          </div>

          {/* Recording Interface */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="text-center mb-6">
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isRecording ? 'bg-red-500' : 'bg-green-500'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </motion.div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    {formatTime(recordingTime)}
                  </motion.div>
                )}

                <p className="text-gray-600 mb-4">
                  {isRecording 
                    ? 'Reading...' 
                    : recordedBlob 
                    ? 'Audio recorded! Ready to submit.' 
                    : 'Click the button below to start recording'}
                </p>

                {!isRecording && !recordedBlob && (
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Stop Recording
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Upload Option */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or upload an audio file</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.wav,.mp3,.webm,.m4a"
              onChange={handleFileUpload}
              className="hidden"
            />

            {recordedBlob && recordedBlob instanceof File ? (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{recordedBlob.name}</p>
                      <p className="text-sm text-gray-600">
                        {(recordedBlob.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRecordedBlob(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-primary-500 hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Upload Audio File</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          {recordedBlob && (
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
            <li>Select a sentence from the dropdown</li>
            <li>Read it once to familiarize yourself</li>
            <li>Click "Start Recording"</li>
            <li>Read the sentence clearly and naturally</li>
            <li>Click "Stop Recording"</li>
            <li>Submit for AI analysis</li>
          </ol>
        </div>
      )}
    </div>
  );
};
