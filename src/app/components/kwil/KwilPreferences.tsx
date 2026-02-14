import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  Dumbbell, 
  Leaf, 
  Flame, 
  Sparkles, 
  GraduationCap,
  Globe,
  Target,
  IndianRupee,
  ArrowRight,
  Check
} from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilCard } from './KwilCard';
import { KwilProgress } from './KwilProgress';

interface SelectableChipProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function SelectableChip({ children, icon, selected, onClick }: SelectableChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-full px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2"
      style={{
        background: selected 
          ? 'linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: selected 
          ? '1px solid rgba(0, 255, 156, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: selected ? '#00FF9C' : '#A0A0A0',
        boxShadow: selected 
          ? '0 0 20px rgba(0, 255, 156, 0.4), inset 0 0 20px rgba(0, 255, 156, 0.1)'
          : 'none',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <span className={selected ? 'text-[#00FF9C]' : 'text-[#A0A0A0]'}>{icon}</span>}
      <span>{children}</span>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
            boxShadow: '0 0 10px rgba(0, 255, 156, 0.6)',
          }}
        >
          <Check size={12} className="text-[#050B08]" />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function KwilPreferences() {
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState(200);

  const dietOptions = [
    { id: 'weight-loss', label: 'Weight Loss', icon: <TrendingDown size={16} /> },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: <Dumbbell size={16} /> },
    { id: 'vegan', label: 'Vegan', icon: <Leaf size={16} /> },
    { id: 'keto', label: 'Keto', icon: <Flame size={16} /> },
    { id: 'jain', label: 'Jain', icon: <Sparkles size={16} /> },
    { id: 'student', label: 'Student Diet', icon: <GraduationCap size={16} /> },
  ];

  const cuisineOptions = [
    { id: 'indian', label: 'Indian', emoji: '🍛' },
    { id: 'chinese', label: 'Chinese', emoji: '🥢' },
    { id: 'italian', label: 'Italian', emoji: '🍝' },
    { id: 'south-indian', label: 'South Indian', emoji: '🫓' },
  ];

  const goalOptions = [
    { id: 'high-protein', label: 'High Protein', icon: <Dumbbell size={16} /> },
    { id: 'low-carb', label: 'Low Carb', icon: <TrendingDown size={16} /> },
    { id: 'low-fat', label: 'Low Fat', icon: <Target size={16} /> },
  ];

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, id: string) => {
    if (array.includes(id)) {
      setArray(array.filter(item => item !== id));
    } else {
      setArray([...array, id]);
    }
  };

  // Calculate progress based on selections
  const totalSections = 4;
  let completedSections = 0;
  if (selectedDiets.length > 0) completedSections++;
  if (selectedCuisines.length > 0) completedSections++;
  if (selectedGoals.length > 0) completedSections++;
  if (budget) completedSections++;
  const progress = (completedSections / totalSections) * 100;

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
            radial-gradient(circle at 50% 10%, rgba(0, 255, 156, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%)
          `
        }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00FF9C]"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 px-6 pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-white">Customize Your Experience</h1>
          <p className="text-[#A0A0A0]">Help us personalize your meal plans</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#A0A0A0] text-sm">Setup Progress</span>
            <span className="text-[#00FF9C] text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <KwilProgress value={progress} />
        </motion.div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10">
        <div className="space-y-6">
          {/* Diet Type Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <KwilCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#00FF9C]" />
                  <h3 className="text-white font-medium">Diet Type</h3>
                </div>
                <p className="text-[#A0A0A0] text-sm">Select your dietary preferences</p>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map((diet) => (
                    <SelectableChip
                      key={diet.id}
                      icon={diet.icon}
                      selected={selectedDiets.includes(diet.id)}
                      onClick={() => toggleSelection(selectedDiets, setSelectedDiets, diet.id)}
                    >
                      {diet.label}
                    </SelectableChip>
                  ))}
                </div>
              </div>
            </KwilCard>
          </motion.div>

          {/* Cuisine Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <KwilCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-[#00FF9C]" />
                  <h3 className="text-white font-medium">Cuisine Preferences</h3>
                </div>
                <p className="text-[#A0A0A0] text-sm">Choose your favorite cuisines</p>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <SelectableChip
                      key={cuisine.id}
                      icon={<span className="text-base">{cuisine.emoji}</span>}
                      selected={selectedCuisines.includes(cuisine.id)}
                      onClick={() => toggleSelection(selectedCuisines, setSelectedCuisines, cuisine.id)}
                    >
                      {cuisine.label}
                    </SelectableChip>
                  ))}
                </div>
              </div>
            </KwilCard>
          </motion.div>

          {/* Goals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <KwilCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-[#00FF9C]" />
                  <h3 className="text-white font-medium">Nutritional Goals</h3>
                </div>
                <p className="text-[#A0A0A0] text-sm">Set your dietary goals</p>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map((goal) => (
                    <SelectableChip
                      key={goal.id}
                      icon={goal.icon}
                      selected={selectedGoals.includes(goal.id)}
                      onClick={() => toggleSelection(selectedGoals, setSelectedGoals, goal.id)}
                    >
                      {goal.label}
                    </SelectableChip>
                  ))}
                </div>
              </div>
            </KwilCard>
          </motion.div>

          {/* Budget Slider Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <KwilCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IndianRupee size={20} className="text-[#00FF9C]" />
                  <h3 className="text-white font-medium">Budget Range</h3>
                </div>
                <p className="text-[#A0A0A0] text-sm">Set your daily meal budget</p>
                
                {/* Budget Display */}
                <div 
                  className="text-center py-4 rounded-2xl"
                  style={{
                    background: 'rgba(0, 255, 156, 0.1)',
                    border: '1px solid rgba(0, 255, 156, 0.2)',
                  }}
                >
                  <div className="text-[#00FF9C] text-3xl font-bold flex items-center justify-center gap-1">
                    <IndianRupee size={28} />
                    <span>{budget}</span>
                  </div>
                  <p className="text-[#A0A0A0] text-xs mt-1">per day</p>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        #00FF9C 0%, 
                        #00FF9C ${((budget - 50) / 450) * 100}%, 
                        rgba(255, 255, 255, 0.1) ${((budget - 50) / 450) * 100}%, 
                        rgba(255, 255, 255, 0.1) 100%)`,
                      WebkitAppearance: 'none',
                    }}
                  />
                  <style>{`
                    input[type="range"]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, #00FF9C 0%, #10B981 100%);
                      cursor: pointer;
                      box-shadow: 0 0 20px rgba(0, 255, 156, 0.6);
                      border: 2px solid #050B08;
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, #00FF9C 0%, #10B981 100%);
                      cursor: pointer;
                      box-shadow: 0 0 20px rgba(0, 255, 156, 0.6);
                      border: 2px solid #050B08;
                    }
                  `}</style>
                  
                  {/* Range Labels */}
                  <div className="flex justify-between text-xs text-[#A0A0A0]">
                    <span>₹50</span>
                    <span>₹500</span>
                  </div>
                </div>

                {/* Budget Suggestions */}
                <div className="flex gap-2">
                  {[100, 200, 300].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBudget(amount)}
                      className="flex-1 py-2 px-3 rounded-full text-xs transition-all"
                      style={{
                        background: budget === amount 
                          ? 'rgba(0, 255, 156, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: budget === amount 
                          ? '1px solid rgba(0, 255, 156, 0.3)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: budget === amount ? '#00FF9C' : '#A0A0A0',
                      }}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
            </KwilCard>
          </motion.div>

          {/* Summary Section */}
          {completedSections > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <KwilCard glow>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
                        boxShadow: '0 0 20px rgba(0, 255, 156, 0.4)',
                      }}
                    >
                      <Check size={20} className="text-[#050B08]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Preferences Set</h3>
                      <p className="text-[#A0A0A0] text-sm">
                        {completedSections} of {totalSections} sections completed
                      </p>
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="space-y-2 pt-2">
                    {selectedDiets.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#00FF9C]" />
                        <span className="text-[#A0A0A0]">
                          {selectedDiets.length} diet{selectedDiets.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                    )}
                    {selectedCuisines.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#00FF9C]" />
                        <span className="text-[#A0A0A0]">
                          {selectedCuisines.length} cuisine{selectedCuisines.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                    )}
                    {selectedGoals.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#00FF9C]" />
                        <span className="text-[#A0A0A0]">
                          {selectedGoals.length} goal{selectedGoals.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </KwilCard>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 z-20"
        style={{
          background: 'linear-gradient(to top, #050B08 0%, #050B08 70%, transparent 100%)',
        }}
      >
        <KwilButton
          variant="primary"
          fullWidth
          disabled={progress < 100}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{progress < 100 ? 'Complete All Sections' : 'Continue'}</span>
            <ArrowRight size={20} />
          </div>
        </KwilButton>
        
        {progress < 100 && (
          <p className="text-center text-[#A0A0A0] text-xs mt-2">
            Select at least one option in each section
          </p>
        )}
      </div>
    </div>
  );
}
