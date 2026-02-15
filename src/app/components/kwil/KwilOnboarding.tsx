import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Camera, Sparkles, ChefHat, ArrowRight, X } from 'lucide-react';
import { KwilButton } from './KwilButton';

interface OnboardingScreen {
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export default function KwilOnboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens: OnboardingScreen[] = [
    {
      title: 'Scan Your Food',
      subtitle: 'Point camera to detect ingredients',
      illustration: <ScanIllustration />,
    },
    {
      title: 'AI Smart Recipes',
      subtitle: 'Personalized meals for your goals',
      illustration: <RecipeCardsIllustration />,
    },
    {
      title: 'Cook Like a Pro',
      subtitle: 'Step-by-step voice cooking',
      illustration: <CookingIllustration />,
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleSkip = () => {
    setCurrentScreen(screens.length - 1);
  };

  const isLastScreen = currentScreen === screens.length - 1;

  const navigate = useNavigate();

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, rgba(0, 255, 156, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* Skip Button */}
      {!isLastScreen && (
        <motion.div 
          className="absolute top-16 right-6 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-[#A0A0A0] hover:text-[#00FF9C] transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-sm">Skip</span>
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full space-y-8"
          >
            {/* Illustration */}
            <div className="flex items-center justify-center h-80">
              {screens[currentScreen].illustration}
            </div>

            {/* Text Content */}
            <div className="space-y-4 text-center">
              <motion.h2 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {screens[currentScreen].title}
              </motion.h2>
              <motion.p 
                className="text-[#A0A0A0] text-lg px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {screens[currentScreen].subtitle}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="pb-12 px-6 space-y-8 relative z-10">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {screens.map((_, index) => (
            <motion.div
              key={index}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: currentScreen === index ? '32px' : '8px',
                backgroundColor: currentScreen === index ? '#00FF9C' : 'rgba(160, 160, 160, 0.3)',
                boxShadow: currentScreen === index ? '0 0 12px rgba(0, 255, 156, 0.5)' : 'none',
              }}
              animate={{
                scale: currentScreen === index ? 1 : 0.9,
              }}
            />
          ))}
        </div>

        {/* Next/Get Started Button */}
        <KwilButton
          variant="primary"
          fullWidth
          onClick={isLastScreen ? () => navigate('/dashboard') : handleNext}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{isLastScreen ? 'Get Started' : 'Next'}</span>
            <ArrowRight size={20} />
          </div>
        </KwilButton>
      </div>
    </div>
  );
}

// Illustration Components

function ScanIllustration() {
  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Glow Background */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 156, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Phone Frame */}
      <motion.div
        className="relative rounded-3xl p-4 shadow-2xl"
        style={{
          width: '200px',
          height: '280px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 40px rgba(0, 255, 156, 0.2)',
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Camera Icon */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
              boxShadow: '0 0 20px rgba(0, 255, 156, 0.6)',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Camera size={20} className="text-[#050B08]" />
          </motion.div>
        </div>

        {/* Scanning Area */}
        <div className="w-full h-full rounded-2xl overflow-hidden relative" style={{ background: 'rgba(0, 255, 156, 0.05)' }}>
          {/* Vegetables Icons */}
          {[
            { icon: '🥕', x: 20, y: 30, delay: 0 },
            { icon: '🥬', x: 60, y: 50, delay: 0.2 },
            { icon: '🍅', x: 40, y: 70, delay: 0.4 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay + 0.5, duration: 0.5 }}
            >
              {item.icon}
            </motion.div>
          ))}

          {/* Scan Lines */}
          <motion.div
            className="absolute left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, transparent, #00FF9C, transparent)',
              boxShadow: '0 0 20px rgba(0, 255, 156, 0.8)',
            }}
            animate={{
              top: ['10%', '90%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Detection Boxes */}
          {[
            { x: 15, y: 25, w: 25, h: 25, delay: 0.6 },
            { x: 55, y: 45, w: 30, h: 30, delay: 0.8 },
          ].map((box, i) => (
            <motion.div
              key={i}
              className="absolute rounded-lg"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
                border: '2px solid #00FF9C',
                boxShadow: '0 0 15px rgba(0, 255, 156, 0.4)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: box.delay }}
            />
          ))}
        </div>

        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.1) 0%, transparent 50%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function RecipeCardsIllustration() {
  const cards = [
    { title: 'Buddha Bowl', icon: '🥗', color: '#00FF9C', rotate: -12, z: 3, y: 20 },
    { title: 'Pasta Delight', icon: '🍝', color: '#10B981', rotate: 0, z: 5, y: 0 },
    { title: 'Smoothie Bowl', icon: '🥤', color: '#5CFFD1', rotate: 12, z: 3, y: 20 },
  ];

  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Center Glow */}
      <div 
        className="absolute w-72 h-72 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 156, 0.4) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* AI Sparkle Icon */}
      <motion.div
        className="absolute top-8 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
          boxShadow: '0 0 30px rgba(0, 255, 156, 0.6)',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Sparkles size={24} className="text-[#050B08]" />
      </motion.div>

      {/* Floating Recipe Cards */}
      <div className="relative w-64 h-72">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 rounded-2xl p-6 shadow-2xl"
            style={{
              width: '180px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `0 0 30px ${card.color}40`,
              zIndex: card.z,
            }}
            initial={{ 
              x: '-50%', 
              y: '-50%',
              rotate: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: '-50%',
              y: `calc(-50% + ${card.y}px)`,
              rotate: card.rotate,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: index * 0.2,
              duration: 0.6,
              ease: 'easeOut',
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2 + index * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Card Content */}
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="text-5xl">{card.icon}</div>
                <h4 className="text-white text-sm font-medium text-center">{card.title}</h4>
                
                {/* Stats */}
                <div className="flex gap-2 text-xs">
                  <span 
                    className="px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    25 min
                  </span>
                  <span 
                    className="px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    Easy
                  </span>
                </div>
              </div>

              {/* Glow Border */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                style={{
                  border: `1px solid ${card.color}`,
                  boxShadow: `inset 0 0 20px ${card.color}30`,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: '#00FF9C',
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
}

function CookingIllustration() {
  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background Glow */}
      <div 
        className="absolute w-80 h-80 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 156, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Chef Hat Icon (User) */}
      <motion.div
        className="absolute bottom-8 w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(0, 255, 156, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 156, 0.2)',
        }}
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ChefHat size={40} className="text-[#00FF9C]" />
      </motion.div>

      {/* Holographic UI Elements */}
      <div className="relative w-full h-64">
        {/* Timer Card */}
        <motion.div
          className="absolute top-0 left-8 rounded-xl p-4 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(0, 255, 156, 0.3)',
            boxShadow: '0 0 20px rgba(0, 255, 156, 0.2)',
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 255, 156, 0.2)' }}
            >
              ⏱️
            </div>
            <div>
              <div className="text-[#00FF9C] text-xs">Timer</div>
              <div className="text-white text-sm font-bold">12:30</div>
            </div>
          </div>
        </motion.div>

        {/* Step Counter */}
        <motion.div
          className="absolute top-16 right-8 rounded-xl p-4 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(0, 255, 156, 0.3)',
            boxShadow: '0 0 20px rgba(0, 255, 156, 0.2)',
          }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 255, 156, 0.2)' }}
            >
              <span className="text-[#00FF9C] text-xs font-bold">3</span>
            </div>
            <div>
              <div className="text-[#00FF9C] text-xs">Step</div>
              <div className="text-white text-sm font-bold">of 8</div>
            </div>
          </div>
        </motion.div>

        {/* Main Instruction Card */}
        <motion.div
          className="absolute top-32 left-1/2 -translate-x-1/2 rounded-2xl p-6 shadow-2xl"
          style={{
            width: '260px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 156, 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 156, 0.3)',
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="space-y-3">
            {/* Voice Indicator */}
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#00FF9C]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-3 rounded-full bg-[#00FF9C]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-4 rounded-full bg-[#00FF9C]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-3 rounded-full bg-[#00FF9C]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-[#00FF9C]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>

            <div className="text-center">
              <p className="text-white text-sm leading-relaxed">
                "Heat oil in a pan over medium heat..."
              </p>
            </div>

            {/* Progress Bar */}
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00FF9C, #10B981)',
                  boxShadow: '0 0 10px rgba(0, 255, 156, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.9, duration: 1 }}
              />
            </div>
          </div>

          {/* Holographic Grid Effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
            style={{
              background: `
                linear-gradient(90deg, transparent 0%, rgba(0, 255, 156, 0.1) 50%, transparent 100%),
                repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0, 255, 156, 0.05) 10px, rgba(0, 255, 156, 0.05) 11px)
              `,
            }}
          />
        </motion.div>

        {/* Floating AI Indicators */}
        {[
          { icon: '🔥', x: 10, y: 40 },
          { icon: '✨', x: 80, y: 60 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {item.icon}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}