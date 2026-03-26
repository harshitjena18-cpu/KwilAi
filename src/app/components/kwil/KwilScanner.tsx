import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  X,
  Zap,
  Check,
  Sparkles,
  Image as ImageIcon,
  RotateCw,
  AlertCircle,
  Edit3,
  ArrowRight
} from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilChip } from './KwilChip';
import { CameraService, compressImage, fileToBase64 } from '../../../utils/camera';
import pantryService, { DetectedIngredient } from '../../../services/pantryService';

interface DetectedItem {
  id: string;
  name: string;
  confidence: number;
  category: string;
  emoji: string;
}

// ⚡ Bolt Performance Optimization:
// Hoisted static arrays and objects to module level to prevent redundant
// allocations and garbage collection overhead during component render cycles.
const CATEGORY_VEGETABLES = ['tomato', 'potato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cabbage'];
const CATEGORY_FRUITS = ['apple', 'banana', 'orange', 'grape', 'strawberry', 'mango'];
const CATEGORY_PROTEIN = ['chicken', 'beef', 'pork', 'fish', 'egg'];
const CATEGORY_DAIRY = ['milk', 'cheese', 'yogurt', 'butter'];

const INGREDIENT_EMOJI_MAP: { [key: string]: string } = {
  tomato: '🍅', potato: '🥔', onion: '🧅', carrot: '🥕', broccoli: '🥦',
  spinach: '🥬', lettuce: '🥬', cabbage: '🥬', pepper: '🫑',
  apple: '🍎', banana: '🍌', orange: '🍊', grape: '🍇', strawberry: '🍓',
  mango: '🥭', pineapple: '🍍', watermelon: '🍉', lemon: '🍋',
  chicken: '🍗', beef: '🥩', pork: '🥓', fish: '🐟', egg: '🥚',
  milk: '🥛', cheese: '🧀', yogurt: '🥛', butter: '🧈',
  rice: '🍚', bread: '🍞', pasta: '🍝', noodle: '🍜',
};

// Pre-calculate entries to avoid Object.entries() on every lookup
const INGREDIENT_EMOJI_ENTRIES = Object.entries(INGREDIENT_EMOJI_MAP);

export default function KwilScanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraServiceRef = useRef<CameraService | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Check camera permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const status = await CameraService.checkCameraPermission();
      setPermissionStatus(status);
      
      // If permission was previously denied, show instructions immediately
      if (status === 'denied') {
        setShowPermissionPrompt(true);
        setError('Camera access was previously denied. Please enable it in your browser settings.');
      }
    };

    checkPermission();

    // Cleanup on unmount
    return () => {
      if (cameraServiceRef.current) {
        cameraServiceRef.current.stopCamera();
      }
    };
  }, []);

  // Initialize camera when user clicks enable button
  const handleEnableCamera = async () => {
    try {
      setError('');
      
      // Check permission status first
      const status = await CameraService.checkCameraPermission();
      setPermissionStatus(status);
      
      // If already denied, don't try again - show instructions
      if (status === 'denied') {
        setShowPermissionPrompt(true);
        setError('Camera access is blocked. Follow the instructions below to enable it.');
        return;
      }

      setShowPermissionPrompt(false);
      cameraServiceRef.current = new CameraService();
      
      if (videoRef.current) {
        await cameraServiceRef.current.startCamera(videoRef.current, {
          facingMode: 'environment',
          width: 1280,
          height: 720,
        });
        setIsCameraReady(true);
        setCameraInitialized(true);
        setPermissionStatus('granted');
      }
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      const errorMessage = err.message || 'Failed to access camera';
      setError(errorMessage);
      
      // Show permission prompt for permission denied errors
      if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        setShowPermissionPrompt(true);
        setPermissionStatus('denied');
      }
    }
  };

  // Retry camera access
  const handleRetryCamera = () => {
    setError('');
    setShowPermissionPrompt(false);
    window.location.reload();
  };

  // Capture and scan photo
  const handleCapture = async () => {
    if (!videoRef.current || !cameraServiceRef.current) {
      setError('Camera not ready');
      return;
    }

    try {
      setIsScanning(true);
      setIsProcessing(true);
      setError('');

      // Capture photo from video stream
      const base64Image = cameraServiceRef.current.capturePhoto(videoRef.current, 0.8);

      // Compress image for faster upload
      const compressedImage = await compressImage(base64Image, 1024, 1024, 0.7);

      // Send to backend for detection
      const response = await pantryService.scanAndAdd(compressedImage);

      if (response.success && response.detectedItems.length > 0) {
        // Convert detected items to display format
        const formattedItems: DetectedItem[] = response.detectedItems.map((item, index) => ({
          id: index.toString(),
          name: item.name,
          confidence: item.confidence,
          category: getCategoryFromName(item.name),
          emoji: getEmojiForIngredient(item.name)
        }));

        setDetectedItems(formattedItems);
      } else {
        setError('No ingredients detected. Try a different angle or better lighting.');
      }
    } catch (err: any) {
      console.error('Scanning error:', err);
      setError(err.response?.data?.message || 'Failed to scan image. Please try again.');
    } finally {
      setIsScanning(false);
      setIsProcessing(false);
    }
  };

  // Helper to get category from ingredient name
  const getCategoryFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (CATEGORY_VEGETABLES.some(v => lowerName.includes(v))) {
      return 'Vegetables';
    }
    if (CATEGORY_FRUITS.some(f => lowerName.includes(f))) {
      return 'Fruits';
    }
    if (CATEGORY_PROTEIN.some(m => lowerName.includes(m))) {
      return 'Protein';
    }
    if (CATEGORY_DAIRY.some(d => lowerName.includes(d))) {
      return 'Dairy';
    }
    return 'Other';
  };

  // Helper to get emoji for ingredient
  const getEmojiForIngredient = (name: string): string => {
    const lowerName = name.toLowerCase();

    for (const [key, emoji] of INGREDIENT_EMOJI_ENTRIES) {
      if (lowerName.includes(key)) return emoji;
    }

    return '🥘';
  };

  const handleRescan = () => {
    setDetectedItems([]);
    setError('');
  };

  const handleSwitchCamera = async () => {
    if (videoRef.current && cameraServiceRef.current) {
      try {
        await cameraServiceRef.current.switchCamera(videoRef.current);
      } catch (err) {
        console.error('Failed to switch camera:', err);
      }
    }
  };

  // Handle file upload from gallery
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setIsProcessing(true);
      setError('');

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Compress image
      const compressedImage = await compressImage(base64Image, 1024, 1024, 0.7);

      // Send to backend for detection
      const response = await pantryService.scanAndAdd(compressedImage);

      if (response.success && response.detectedItems.length > 0) {
        const formattedItems: DetectedItem[] = response.detectedItems.map((item, index) => ({
          id: index.toString(),
          name: item.name,
          confidence: item.confidence,
          category: getCategoryFromName(item.name),
          emoji: getEmojiForIngredient(item.name)
        }));

        setDetectedItems(formattedItems);
      } else {
        setError('No ingredients detected. Try a different image.');
      }
    } catch (err: any) {
      console.error('Upload scanning error:', err);
      setError(err.response?.data?.message || 'Failed to scan image. Please try again.');
    } finally {
      setIsScanning(false);
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Camera View Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={{
          backgroundImage: `
            linear-gradient(rgba(5, 11, 8, 0.3), rgba(5, 11, 8, 0.3)),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 156, 0.03) 2px, rgba(0, 255, 156, 0.03) 4px)
          `,
        }}
      >
        {/* Live Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Simulated camera grain */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Corner Brackets - AI HUD */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <svg className="absolute top-20 left-4 w-16 h-16" viewBox="0 0 64 64">
          <motion.path
            d="M 0 16 L 0 0 L 16 0"
            stroke="#00FF9C"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="0"
            cy="0"
            r="3"
            fill="#00FF9C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </svg>

        {/* Top Right */}
        <svg className="absolute top-20 right-4 w-16 h-16" viewBox="0 0 64 64">
          <motion.path
            d="M 64 16 L 64 0 L 48 0"
            stroke="#00FF9C"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="64"
            cy="0"
            r="3"
            fill="#00FF9C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </svg>

        {/* Bottom Left */}
        <svg className="absolute bottom-64 left-4 w-16 h-16" viewBox="0 0 64 64">
          <motion.path
            d="M 0 48 L 0 64 L 16 64"
            stroke="#00FF9C"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="0"
            cy="64"
            r="3"
            fill="#00FF9C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </svg>

        {/* Bottom Right */}
        <svg className="absolute bottom-64 right-4 w-16 h-16" viewBox="0 0 64 64">
          <motion.path
            d="M 64 48 L 64 64 L 48 64"
            stroke="#00FF9C"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="64"
            cy="64"
            r="3"
            fill="#00FF9C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="relative z-20 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between">
          {/* Close Button */}
          <motion.button
            aria-label="Close scanner"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-white" />
          </motion.button>

          {/* Status Indicator */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 156, 0.3)',
            }}
            animate={{
              boxShadow: isScanning 
                ? ['0 0 10px rgba(0, 255, 156, 0.3)', '0 0 20px rgba(0, 255, 156, 0.6)', '0 0 10px rgba(0, 255, 156, 0.3)']
                : '0 0 10px rgba(0, 255, 156, 0.3)',
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isScanning ? (
              <>
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00FF9C]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[#00FF9C] text-sm font-medium">Scanning...</span>
              </>
            ) : (
              <>
                <Check size={16} className="text-[#00FF9C]" />
                <span className="text-[#00FF9C] text-sm font-medium">Detected</span>
              </>
            )}
          </motion.div>

          {/* Flash Toggle */}
          <motion.button
            aria-label={flashEnabled ? "Disable flash" : "Enable flash"}
            onClick={() => setFlashEnabled(!flashEnabled)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: flashEnabled ? 'rgba(0, 255, 156, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              border: flashEnabled ? '1px solid rgba(0, 255, 156, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Zap size={20} className={flashEnabled ? 'text-[#00FF9C]' : 'text-white'} />
          </motion.button>
        </div>
      </div>

      {/* Center Scanning Frame */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="relative" style={{ width: '280px', height: '280px' }}>
          {/* Main Scanning Frame */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              border: '3px solid rgba(0, 255, 156, 0.6)',
              boxShadow: '0 0 40px rgba(0, 255, 156, 0.4), inset 0 0 40px rgba(0, 255, 156, 0.1)',
            }}
            animate={{
              boxShadow: isScanning
                ? [
                    '0 0 40px rgba(0, 255, 156, 0.4), inset 0 0 40px rgba(0, 255, 156, 0.1)',
                    '0 0 60px rgba(0, 255, 156, 0.6), inset 0 0 60px rgba(0, 255, 156, 0.2)',
                    '0 0 40px rgba(0, 255, 156, 0.4), inset 0 0 40px rgba(0, 255, 156, 0.1)',
                  ]
                : '0 0 30px rgba(0, 255, 156, 0.3), inset 0 0 30px rgba(0, 255, 156, 0.1)',
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-30">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(0, 255, 156, 0.2) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(0, 255, 156, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Horizontal Scan Lines */}
          <AnimatePresence>
            {isScanning && (
              <>
                <motion.div
                  className="absolute left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #00FF9C, transparent)',
                    boxShadow: '0 0 20px rgba(0, 255, 156, 0.8)',
                  }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 156, 0.6), transparent)',
                    boxShadow: '0 0 15px rgba(0, 255, 156, 0.6)',
                  }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 1,
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* AI Detection Markers */}
          {!isScanning && detectedItems.length > 0 && (
            <>
              {/* Detection boxes */}
              <motion.div
                className="absolute rounded-lg"
                style={{
                  top: '15%',
                  left: '20%',
                  width: '25%',
                  height: '25%',
                  border: '2px solid #00FF9C',
                  boxShadow: '0 0 15px rgba(0, 255, 156, 0.5)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div 
                  className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    background: 'rgba(0, 255, 156, 0.9)',
                    color: '#050B08',
                  }}
                >
                  {detectedItems[0].emoji} {detectedItems[0].confidence}%
                </div>
              </motion.div>

              <motion.div
                className="absolute rounded-lg"
                style={{
                  top: '20%',
                  right: '15%',
                  width: '30%',
                  height: '30%',
                  border: '2px solid #00FF9C',
                  boxShadow: '0 0 15px rgba(0, 255, 156, 0.5)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div 
                  className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    background: 'rgba(0, 255, 156, 0.9)',
                    color: '#050B08',
                  }}
                >
                  {detectedItems[1].emoji} {detectedItems[1].confidence}%
                </div>
              </motion.div>

              <motion.div
                className="absolute rounded-lg"
                style={{
                  bottom: '25%',
                  left: '15%',
                  width: '28%',
                  height: '28%',
                  border: '2px solid #00FF9C',
                  boxShadow: '0 0 15px rgba(0, 255, 156, 0.5)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div 
                  className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    background: 'rgba(0, 255, 156, 0.9)',
                    color: '#050B08',
                  }}
                >
                  {detectedItems[2].emoji} {detectedItems[2].confidence}%
                </div>
              </motion.div>
            </>
          )}

          {/* Center AI Icon */}
          {isScanning && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0, 255, 156, 0.1)',
                  border: '2px solid rgba(0, 255, 156, 0.5)',
                }}
              >
                <Sparkles size={32} className="text-[#00FF9C]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Gallery Button */}
        <motion.button
          aria-label="Upload from gallery"
          className="absolute bottom-8 right-6 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ImageIcon size={24} className="text-white" />
        </motion.button>

        {/* Capture Button */}
        <motion.button
          onClick={handleCapture}
          disabled={!isCameraReady || isProcessing}
          aria-label="Capture photo"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: isCameraReady && !isProcessing 
              ? 'linear-gradient(135deg, #00FF9C, #00D97E)'
              : 'rgba(128, 128, 128, 0.5)',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 255, 156, 0.5)',
          }}
          whileHover={isCameraReady && !isProcessing ? { scale: 1.1 } : {}}
          whileTap={isCameraReady && !isProcessing ? { scale: 0.9 } : {}}
          animate={isCameraReady && !isProcessing ? {
            boxShadow: [
              '0 10px 30px rgba(0, 255, 156, 0.5)',
              '0 10px 40px rgba(0, 255, 156, 0.8)',
              '0 10px 30px rgba(0, 255, 156, 0.5)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>
          ) : (
            <Camera size={32} className="text-white" />
          )}
        </motion.button>

        {/* Switch Camera Button */}
        <motion.button
          onClick={handleSwitchCamera}
          aria-label="Switch camera"
          className="absolute bottom-8 left-6 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCw size={24} className="text-white" />
        </motion.button>
      </div>

      {/* Bottom Detection Panel */}
      <motion.div
        className="relative z-20 rounded-t-3xl overflow-hidden"
        style={{
          background: 'rgba(5, 11, 8, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 255, 156, 0.3)',
          boxShadow: '0 -10px 40px rgba(0, 255, 156, 0.1)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20 }}
      >
        <div className="px-6 py-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">
                {isScanning ? 'Analyzing...' : 'Detected Ingredients'}
              </h3>
              <p className="text-[#A0A0A0] text-sm">
                {isScanning ? 'AI is identifying items' : `${detectedItems.length} items found`}
              </p>
            </div>
            {!isScanning && (
              <motion.button
                onClick={handleRescan}
                aria-label="Rescan"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(0, 255, 156, 0.3)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera size={20} className="text-[#00FF9C]" />
              </motion.button>
            )}
          </div>

          {/* Detected Items List */}
          {isScanning ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-16 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {detectedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="rounded-2xl p-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Emoji */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: 'rgba(0, 255, 156, 0.1)',
                        border: '1px solid rgba(0, 255, 156, 0.2)',
                      }}
                    >
                      {item.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-[#A0A0A0] text-xs">{item.category}</p>
                    </div>

                    {/* Confidence */}
                    <div className="text-right">
                      <div 
                        className="text-sm font-bold mb-1"
                        style={{
                          color: item.confidence >= 90 ? '#00FF9C' : item.confidence >= 80 ? '#FFD93D' : '#FF9CEE',
                        }}
                      >
                        {item.confidence}%
                      </div>
                      <div 
                        className="w-12 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: item.confidence >= 90 
                              ? 'linear-gradient(90deg, #00FF9C, #10B981)'
                              : item.confidence >= 80
                              ? 'linear-gradient(90deg, #FFD93D, #FFC93D)'
                              : 'linear-gradient(90deg, #FF9CEE, #FF6BCF)',
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.confidence}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {!isScanning && (
            <motion.div
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className="flex-1 py-3 rounded-full flex items-center justify-center gap-2 font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#A0A0A0',
                }}
              >
                <Edit3 size={18} />
                <span>Edit</span>
              </button>

              <KwilButton variant="primary" className="flex-1" onClick={() => navigate('/app/recipes')}>
                <div className="flex items-center justify-center gap-2">
                  <span>Find Recipes</span>
                  <ArrowRight size={18} />
                </div>
              </KwilButton>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* AI Processing Indicator */}
      {isScanning && (
        <motion.div
          className="absolute bottom-80 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full z-30"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 156, 0.5)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={16} className="text-[#00FF9C]" />
            </motion.div>
            <span className="text-[#00FF9C] text-sm font-medium">AI Processing...</span>
          </div>
        </motion.div>
      )}

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="mx-6 p-8 rounded-3xl max-w-sm"
            style={{
              background: 'rgba(5, 11, 8, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '2px solid rgba(255, 107, 107, 0.3)',
                }}
              >
                <AlertCircle size={48} className="text-[#FF6B6B]" />
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-2xl">
                Camera Access Required
              </h3>

              {/* Message */}
              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                {error}
              </p>

              {/* Instructions */}
              <div
                className="w-full p-4 rounded-xl text-left space-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-white text-xs font-semibold">How to enable:</p>
                <ol className="text-[#A0A0A0] text-xs space-y-1 list-decimal list-inside">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera permissions</li>
                  <li>Reload the page</li>
                </ol>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate('/app')}
                  className="flex-1 py-3 rounded-full font-medium transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#A0A0A0',
                  }}
                >
                  Go Back
                </button>
                <button
                  onClick={handleRetryCamera}
                  className="flex-1 py-3 rounded-full font-medium transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #00FF9C, #00D97E)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0, 255, 156, 0.3)',
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Error Message Overlay (for non-permission errors) */}
      {error && !showPermissionPrompt && (
        <motion.div
          className="absolute bottom-[420px] left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl z-30 max-w-sm mx-6"
          style={{
            background: 'rgba(255, 107, 107, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Enable Camera Button - Shows when camera not initialized */}
      {!cameraInitialized && !showPermissionPrompt && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="mx-6 p-8 rounded-3xl max-w-sm text-center"
            style={{
              background: 'rgba(5, 11, 8, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(0, 255, 156, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 255, 156, 0.3)',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex flex-col items-center space-y-6">
              {/* Icon */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0, 255, 156, 0.1)',
                  border: '3px solid rgba(0, 255, 156, 0.3)',
                }}
              >
                <Camera size={56} className="text-[#00FF9C]" />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-white font-bold text-2xl mb-2">
                  AI Ingredient Scanner
                </h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">
                  Tap the button below to activate your camera and start scanning ingredients with AI-powered detection.
                </p>
              </div>

              {/* Features */}
              <div
                className="w-full p-4 rounded-xl text-left space-y-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 255, 156, 0.2)' }}>
                    <Sparkles size={16} className="text-[#00FF9C]" />
                  </div>
                  <p className="text-white text-xs">AI-powered recognition</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 255, 156, 0.2)' }}>
                    <Check size={16} className="text-[#00FF9C]" />
                  </div>
                  <p className="text-white text-xs">Instant pantry updates</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 255, 156, 0.2)' }}>
                    <Zap size={16} className="text-[#00FF9C]" />
                  </div>
                  <p className="text-white text-xs">Smart recipe matching</p>
                </div>
              </div>

              {/* Enable Button */}
              <motion.button
                onClick={handleEnableCamera}
                className="w-full py-4 rounded-full font-bold text-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00FF9C, #00D97E)',
                  color: '#050B08',
                  boxShadow: '0 8px 24px rgba(0, 255, 156, 0.4)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enable Camera
              </motion.button>

              {/* Skip Button */}
              <button
                onClick={() => navigate('/app')}
                className="text-[#A0A0A0] text-sm hover:text-white transition-colors"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
