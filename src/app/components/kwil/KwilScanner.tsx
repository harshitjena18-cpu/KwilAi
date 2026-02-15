import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  X,
  Zap,
  Image as ImageIcon,
  Camera,
  Check,
  Edit3,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilChip } from './KwilChip';

interface DetectedItem {
  id: string;
  name: string;
  confidence: number;
  category: string;
  emoji: string;
}

export default function KwilScanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Simulate detection after scanning
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        setDetectedItems([
          { id: '1', name: 'Tomatoes', confidence: 95, category: 'Vegetables', emoji: '🍅' },
          { id: '2', name: 'Spinach', confidence: 89, category: 'Leafy Greens', emoji: '🥬' },
          { id: '3', name: 'Carrots', confidence: 92, category: 'Vegetables', emoji: '🥕' },
          { id: '4', name: 'Bell Pepper', confidence: 87, category: 'Vegetables', emoji: '🫑' },
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleRescan = () => {
    setDetectedItems([]);
    setIsScanning(true);
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
    </div>
  );
}