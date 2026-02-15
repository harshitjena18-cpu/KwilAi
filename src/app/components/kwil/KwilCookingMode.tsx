import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  X,
  Mic,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Check,
  Trophy,
  Loader2,
} from 'lucide-react';
import {
  startCookingSession,
  nextStep as apiNextStep,
  previousStep as apiPreviousStep,
  finishCookingSession,
  getActiveSession,
  type CookingSession,
} from '../../../services/cookingSessionService';

interface CookingStep {
  id: string;
  number: number;
  instruction: string;
  duration?: number; // in seconds
}

interface KwilCookingModeProps {
  recipeId?: string;
  recipeName?: string;
  steps?: CookingStep[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  onComplete?: () => void;
  onExit?: () => void;
}

const DEMO_USER_ID = 'demo-user-001';

const DEFAULT_STEPS: CookingStep[] = [
  { id: '1', number: 1, instruction: 'Season chicken breast with salt, pepper, and your favorite herbs.', duration: 60 },
  { id: '2', number: 2, instruction: 'Heat olive oil in a pan over medium-high heat.', duration: 120 },
  { id: '3', number: 3, instruction: 'Cook chicken for 6-7 minutes on each side until golden brown.', duration: 420 },
  { id: '4', number: 4, instruction: 'Let chicken rest for 5 minutes, then slice into strips.', duration: 300 },
  { id: '5', number: 5, instruction: 'Prepare salad base with mixed greens and cherry tomatoes.' },
  { id: '6', number: 6, instruction: 'Top with sliced chicken, avocado, and drizzle with lemon juice.' },
];

export default function KwilCookingMode({
  recipeId = 'recipe-demo-001',
  recipeName = 'Grilled Chicken Power Salad',
  steps = DEFAULT_STEPS,
  nutrition = { calories: 450, protein: 42, carbs: 18, fats: 24 },
  onComplete,
  onExit,
}: KwilCookingModeProps) {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState<CookingSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completing, setCompleting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Start or resume cooking session on mount
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      // Check for existing active session
      const existing = await getActiveSession(DEMO_USER_ID, recipeId);
      if (existing) {
        setSession(existing);
        setCurrentStepIndex(Math.min(existing.currentStep, totalSteps - 1));
      } else {
        // Start new session
        const newSession = await startCookingSession(
          DEMO_USER_ID,
          recipeId,
          recipeName,
          totalSteps
        );
        setSession(newSession);
      }
    } catch (error) {
      console.error('Failed to init cooking session:', error);
      // Continue without session - still allow cooking
    } finally {
      setSessionLoading(false);
    }
  };

  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep.duration) {
      setTimeRemaining(currentStep.duration);
      setIsTimerRunning(false);
    } else {
      setTimeRemaining(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex]);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timeRemaining]);

  const goToNextStep = async () => {
    if (currentStepIndex < totalSteps - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);

      // Update server session
      if (session) {
        try {
          const updated = await apiNextStep(DEMO_USER_ID, session.id);
          setSession(updated);
        } catch (error) {
          console.error('Failed to update session step:', error);
        }
      }
    }
  };

  const goToPreviousStep = async () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);

      // Update server session
      if (session) {
        try {
          const updated = await apiPreviousStep(DEMO_USER_ID, session.id);
          setSession(updated);
        } catch (error) {
          console.error('Failed to update session step:', error);
        }
      }
    }
  };

  const handleCompleteRecipe = async () => {
    setCompleting(true);
    try {
      if (session) {
        await finishCookingSession(DEMO_USER_ID, session.id, nutrition);
      }
      setShowCompletion(true);
    } catch (error) {
      console.error('Failed to finish cooking session:', error);
      setShowCompletion(true); // Still show completion UI
    } finally {
      setCompleting(false);
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate(-1);
    }
  };

  const handleCompletionDone = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/app/health');
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    if (currentStep.duration) {
      setTimeRemaining(currentStep.duration);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVoiceAssistant = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  if (sessionLoading) {
    return (
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ backgroundColor: '#000000' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-[#00FF9C] animate-spin" />
          <p className="text-[#A0A0A0] text-sm">Starting cooking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isListening ? [1, 1.3, 1] : 1,
            opacity: isListening ? [0.15, 0.25, 0.15] : 0.15,
          }}
          transition={{
            duration: 2,
            repeat: isListening ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 px-6 pt-16 pb-6">
        <div className="flex items-center justify-between mb-6">
          {/* Exit Button */}
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleExit}
          >
            <X size={24} className="text-white" />
          </motion.button>

          {/* Step Counter */}
          <div className="text-center">
            <p className="text-[#00FF9C] text-sm font-medium">COOKING MODE</p>
            {session && (
              <p className="text-[#A0A0A0] text-xs mt-0.5">
                Session active
              </p>
            )}
          </div>

          {/* Sound Toggle */}
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 size={24} className="text-white" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">
              Step {currentStepIndex + 1} of {totalSteps}
            </p>
            <p className="text-[#A0A0A0] text-sm">
              {Math.round(progress)}%
            </p>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00FF9C, #10B981)',
                boxShadow: '0 0 20px rgba(0, 255, 156, 0.6)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Current Step */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            className="text-center space-y-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Number Badge */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.2), rgba(16, 185, 129, 0.2))',
                border: '2px solid rgba(0, 255, 156, 0.5)',
                boxShadow: '0 0 30px rgba(0, 255, 156, 0.3)',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <span className="text-[#00FF9C] text-2xl font-bold">
                {currentStep.number}
              </span>
            </motion.div>

            {/* Step Instruction - Large Font */}
            <motion.p 
              className="text-white text-3xl font-medium leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentStep.instruction}
            </motion.p>

            {/* Timer Section */}
            {timeRemaining !== null && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid rgba(0, 255, 156, 0.3)',
                    boxShadow: isTimerRunning 
                      ? '0 0 40px rgba(0, 255, 156, 0.4)' 
                      : '0 0 20px rgba(0, 255, 156, 0.2)',
                  }}
                >
                  <motion.p 
                    className="text-6xl font-bold tabular-nums"
                    style={{
                      color: timeRemaining <= 10 ? '#FF6B6B' : '#00FF9C',
                    }}
                    animate={{
                      scale: timeRemaining <= 10 && isTimerRunning ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: timeRemaining <= 10 && isTimerRunning ? Infinity : 0,
                    }}
                  >
                    {formatTime(timeRemaining)}
                  </motion.p>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={toggleTimer}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: isTimerRunning 
                        ? 'linear-gradient(135deg, #00FF9C, #10B981)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: isTimerRunning ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isTimerRunning ? (
                      <Pause size={24} className="text-[#000000]" fill="#000000" />
                    ) : (
                      <Play size={24} className="text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={resetTimer}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9, rotate: -180 }}
                  >
                    <RotateCcw size={20} className="text-white" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Completion Button on Last Step */}
            {currentStepIndex === totalSteps - 1 && (
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={handleCompleteRecipe}
                  disabled={completing}
                  className="px-6 py-3 rounded-full flex items-center gap-2 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #00FF9C, #10B981)',
                    boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
                  }}
                >
                  {completing ? (
                    <Loader2 size={20} className="text-[#000000] animate-spin" />
                  ) : (
                    <Check size={20} className="text-[#000000]" />
                  )}
                  <span className="text-[#000000] font-bold">
                    {completing ? 'Saving...' : 'Complete Recipe'}
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 px-6 pb-8">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <motion.button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: currentStepIndex === 0 
                ? 'rgba(255, 255, 255, 0.03)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              opacity: currentStepIndex === 0 ? 0.3 : 1,
            }}
            whileHover={currentStepIndex !== 0 ? { scale: 1.1 } : {}}
            whileTap={currentStepIndex !== 0 ? { scale: 0.9 } : {}}
          >
            <ChevronLeft size={28} className="text-white" />
          </motion.button>

          {/* Voice Assistant Button */}
          <motion.button
            onClick={toggleVoiceAssistant}
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: isListening 
                ? 'linear-gradient(135deg, #00FF9C, #10B981)' 
                : 'rgba(0, 255, 156, 0.15)',
              border: '3px solid #00FF9C',
              boxShadow: isListening 
                ? '0 0 60px rgba(0, 255, 156, 0.8)' 
                : '0 0 40px rgba(0, 255, 156, 0.5)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isListening 
                ? [
                    '0 0 60px rgba(0, 255, 156, 0.8)',
                    '0 0 80px rgba(0, 255, 156, 1)',
                    '0 0 60px rgba(0, 255, 156, 0.8)',
                  ]
                : '0 0 40px rgba(0, 255, 156, 0.5)',
            }}
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0,
            }}
          >
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#00FF9C]"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#00FF9C]"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}
            <Mic 
              size={40} 
              className={isListening ? 'text-[#000000]' : 'text-[#00FF9C]'} 
              strokeWidth={2.5}
            />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={goToNextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: currentStepIndex === totalSteps - 1 
                ? 'rgba(255, 255, 255, 0.03)' 
                : 'rgba(0, 255, 156, 0.2)',
              border: currentStepIndex === totalSteps - 1 
                ? '1px solid rgba(255, 255, 255, 0.2)' 
                : '2px solid rgba(0, 255, 156, 0.5)',
              boxShadow: currentStepIndex === totalSteps - 1 
                ? 'none' 
                : '0 0 20px rgba(0, 255, 156, 0.3)',
              opacity: currentStepIndex === totalSteps - 1 ? 0.3 : 1,
            }}
            whileHover={currentStepIndex !== totalSteps - 1 ? { 
              scale: 1.1,
              boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
            } : {}}
            whileTap={currentStepIndex !== totalSteps - 1 ? { scale: 0.9 } : {}}
          >
            <ChevronRight size={28} className="text-[#00FF9C]" />
          </motion.button>
        </div>

        {/* Voice Command Hint */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(0, 255, 156, 0.1)',
                  border: '1px solid rgba(0, 255, 156, 0.3)',
                }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00FF9C]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <p className="text-[#00FF9C] text-sm font-medium">
                  Listening... Say "Next" or "Back"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timer Alert Overlay */}
      <AnimatePresence>
        {timeRemaining === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center space-y-6"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <motion.div
                className="w-32 h-32 rounded-full mx-auto flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00FF9C, #10B981)',
                  boxShadow: '0 0 60px rgba(0, 255, 156, 0.8)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 60px rgba(0, 255, 156, 0.8)',
                    '0 0 80px rgba(0, 255, 156, 1)',
                    '0 0 60px rgba(0, 255, 156, 0.8)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Check size={64} className="text-[#000000]" strokeWidth={3} />
              </motion.div>
              <div>
                <h2 className="text-white text-4xl font-bold mb-2">Time's Up!</h2>
                <p className="text-[#A0A0A0] text-lg">Step {currentStep.number} complete</p>
              </div>
              <button
                onClick={goToNextStep}
                className="px-8 py-4 rounded-full font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, #00FF9C, #10B981)',
                  color: '#000000',
                  boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
                }}
              >
                Continue to Next Step
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center space-y-6 px-8"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.div
                className="w-28 h-28 rounded-full mx-auto flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  boxShadow: '0 0 60px rgba(255, 215, 0, 0.6)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy size={56} className="text-[#050B08]" />
              </motion.div>

              <div>
                <h2 className="text-white text-3xl font-bold mb-2">
                  Recipe Complete!
                </h2>
                <p className="text-[#A0A0A0] text-lg mb-1">{recipeName}</p>
                <p className="text-[#00FF9C] text-sm">
                  Nutrition logged automatically
                </p>
              </div>

              {/* Nutrition Summary */}
              <div
                className="rounded-2xl p-4 mx-auto max-w-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 255, 156, 0.2)',
                }}
              >
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-[#FF6B6B] font-bold">{nutrition.calories}</p>
                    <p className="text-[#A0A0A0] text-xs">kcal</p>
                  </div>
                  <div>
                    <p className="text-[#00FF9C] font-bold">{nutrition.protein}g</p>
                    <p className="text-[#A0A0A0] text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="text-[#FFD93D] font-bold">{nutrition.carbs}g</p>
                    <p className="text-[#A0A0A0] text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="text-[#FF9CEE] font-bold">{nutrition.fats}g</p>
                    <p className="text-[#A0A0A0] text-xs">Fat</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCompletionDone}
                  className="w-full px-6 py-4 rounded-full font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #00FF9C, #10B981)',
                    color: '#050B08',
                    boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
                  }}
                >
                  View Health Dashboard
                </button>
                <button
                  onClick={handleExit}
                  className="w-full px-6 py-3 rounded-full font-medium text-[#A0A0A0]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Back to Recipes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
