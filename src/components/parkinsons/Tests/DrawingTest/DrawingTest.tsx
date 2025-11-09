import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pen, RotateCcw, Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useParkinsonStore } from '../../../../stores/useParkinsonStore';
import { parkinsonApi } from '../../../../lib/api/parkinsonApi';

type DrawingType = 'spiral' | 'wave';

export const DrawingTest: React.FC = () => {
  const { selectedSubject } = useParkinsonStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState<ImageData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawingType, setDrawingType] = useState<DrawingType>('spiral');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        // Set canvas size
        canvas.width = 600;
        canvas.height = 600;
        
        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw template
        drawTemplate(ctx, drawingType);
      }
    }
  }, [drawingType]);

  const drawTemplate = (ctx: CanvasRenderingContext2D, type: DrawingType) => {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (type === 'spiral') {
      // Draw spiral template
      const centerX = 300;
      const centerY = 300;
      let angle = 0;
      let radius = 0;
      
      ctx.beginPath();
      while (radius < 200) {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        angle += 0.1;
        radius += 0.5;
      }
      ctx.stroke();
    } else {
      // Draw wave template
      ctx.beginPath();
      ctx.moveTo(50, 300);
      
      for (let x = 50; x <= 550; x += 5) {
        const y = 300 + 80 * Math.sin((x - 50) / 40);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setDrawingData(imageData);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawTemplate(ctx, drawingType);
        setDrawingData(null);
        setError(null);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PNG or JPEG images.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setDrawingData(imageData);
            setError(null);
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const submitTest = async () => {
    if (!drawingData || !selectedSubject) {
      setError('Please draw something first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      const formData = new FormData();
      formData.append('subject_id', selectedSubject.id);
      formData.append('image_file', blob, 'drawing.png');
      formData.append('drawing_type', drawingType);

      const response = await parkinsonApi.tests.drawing(formData);
      setResult(response);
      setDrawingData(null);
    } catch (err: any) {
      console.error('Test submission error:', err);
      const errorMsg = err.message || 'Failed to analyze drawing. Please try again.';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${drawingType}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const resetTest = () => {
    clearCanvas();
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Drawing Test</h2>
        <p className="text-gray-600 text-sm">
          Draw the pattern as smoothly and accurately as possible
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
            className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl"
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
          {/* Drawing Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select pattern type:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setDrawingType('spiral');
                  clearCanvas();
                }}
                className={`p-4 border-2 rounded-xl transition-all ${
                  drawingType === 'spiral'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🌀</div>
                  <p className="font-medium text-gray-900">Spiral</p>
                  <p className="text-xs text-gray-600">Draw from center outward</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setDrawingType('wave');
                  clearCanvas();
                }}
                className={`p-4 border-2 rounded-xl transition-all ${
                  drawingType === 'wave'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">〰️</div>
                  <p className="font-medium text-gray-900">Wave</p>
                  <p className="text-xs text-gray-600">Follow the wavy line</p>
                </div>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full border-2 border-gray-300 rounded-xl cursor-crosshair bg-white touch-none"
                style={{ maxWidth: '600px', aspectRatio: '1/1' }}
              />
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={clearCanvas}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Clear
                </button>
                <button
                  onClick={downloadDrawing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
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
                <span className="px-2 bg-white text-gray-500">Or upload an image</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-primary-500 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Upload Image</span>
            </button>
          </div>

          {/* Submit Button */}
          {drawingData && (
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
            <li>Select pattern type (Spiral or Wave)</li>
            <li>Place your mouse/finger at the starting point</li>
            <li>Draw smoothly following the dotted guide</li>
            <li>Try to maintain consistent speed</li>
            <li>Click "Clear" to start over if needed</li>
            <li>Submit when satisfied with your drawing</li>
          </ol>
        </div>
      )}
    </div>
  );
};
