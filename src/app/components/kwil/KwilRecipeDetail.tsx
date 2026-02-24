import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Flame,
  TrendingUp,
  IndianRupee,
  Mic,
  Check,
  Star,
  User,
  Info,
  ChefHat
} from 'lucide-react';
import { KwilTabs } from './KwilTabs';
import { KwilCard } from './KwilCard';
import { KwilBadge } from './KwilBadge';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  checked?: boolean;
}

interface Step {
  id: string;
  number: number;
  instruction: string;
  completed?: boolean;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function KwilRecipeDetail() {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('steps');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Chicken Breast', amount: '500g', checked: false },
    { id: '2', name: 'Mixed Greens', amount: '2 cups', checked: false },
    { id: '3', name: 'Cherry Tomatoes', amount: '1 cup', checked: false },
    { id: '4', name: 'Avocado', amount: '1 whole', checked: false },
    { id: '5', name: 'Olive Oil', amount: '2 tbsp', checked: false },
    { id: '6', name: 'Lemon Juice', amount: '1 tbsp', checked: false },
  ]);

  const [steps, setSteps] = useState<Step[]>([
    { id: '1', number: 1, instruction: 'Season chicken breast with salt, pepper, and your favorite herbs.', completed: false },
    { id: '2', number: 2, instruction: 'Heat olive oil in a pan over medium-high heat.', completed: false },
    { id: '3', number: 3, instruction: 'Cook chicken for 6-7 minutes on each side until golden and cooked through.', completed: false },
    { id: '4', number: 4, instruction: 'Let chicken rest for 5 minutes, then slice into strips.', completed: false },
    { id: '5', number: 5, instruction: 'Prepare salad base with mixed greens and cherry tomatoes.', completed: false },
    { id: '6', number: 6, instruction: 'Top with sliced chicken, avocado, and drizzle with lemon juice.', completed: false },
  ]);

  const nutrition = [
    { label: 'Calories', value: '450', unit: 'kcal', color: '#FF6B6B' },
    { label: 'Protein', value: '42', unit: 'g', color: '#00FF9C' },
    { label: 'Carbs', value: '18', unit: 'g', color: '#FFD93D' },
    { label: 'Fat', value: '24', unit: 'g', color: '#FF9CEE' },
    { label: 'Fiber', value: '6', unit: 'g', color: '#6BCF7F' },
    { label: 'Sugar', value: '4', unit: 'g', color: '#FFA07A' },
  ];

  const reviews: Review[] = [
    { id: '1', userName: 'Sarah M.', rating: 5, comment: 'Amazing recipe! Perfect for meal prep. The chicken was so juicy!', date: '2 days ago' },
    { id: '2', userName: 'Mike R.', rating: 4, comment: 'Great recipe but I added more veggies. Still delicious!', date: '1 week ago' },
    { id: '3', userName: 'Emma K.', rating: 5, comment: 'Best protein bowl recipe I\'ve tried. Will make again!', date: '2 weeks ago' },
  ];

  const tabs = [
    { id: 'ingredients', label: 'Ingredients', icon: <ChefHat size={14} /> },
    { id: 'steps', label: 'Steps', icon: <Info size={14} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <TrendingUp size={14} /> },
    { id: 'reviews', label: 'Reviews', icon: <Star size={14} /> },
  ];

  const toggleIngredient = (id: string) => {
    setIngredients(prev => 
      prev.map(ing => ing.id === id ? { ...ing, checked: !ing.checked } : ing)
    );
  };

  const toggleStep = (id: string) => {
    setSteps(prev => 
      prev.map(step => step.id === id ? { ...step, completed: !step.completed } : step)
    );
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Hero Image Section */}
      <div className="relative h-80 flex-shrink-0">
        {/* Recipe Image Background */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-9xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
          }}
        >
          🥙
        </div>

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(5, 11, 8, 0.3) 0%, rgba(5, 11, 8, 0.95) 100%)',
          }}
        />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-16 pb-4 z-10">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <motion.button
              aria-label="Go back"
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isFavorite ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: isFavorite ? '1px solid rgba(255, 107, 107, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'text-[#FF6B6B]' : 'text-white'} 
                  fill={isFavorite ? '#FF6B6B' : 'none'}
                />
              </motion.button>

              <motion.button
                aria-label="Share recipe"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={20} className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Recipe Title & Rating */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Star size={14} className="text-[#FFD93D]" fill="#FFD93D" />
                <span className="text-white text-sm font-medium">4.9</span>
              </div>
              <KwilBadge variant="primary">High Protein</KwilBadge>
            </div>
            <h1 className="text-white text-3xl font-bold mb-1">
              Grilled Chicken Power Salad
            </h1>
            <p className="text-[#A0A0A0] text-sm">
              Healthy & delicious protein-packed meal
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div 
        className="flex-shrink-0 px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-4 gap-3">
          {/* Time */}
          <div 
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Clock size={20} className="text-[#00FF9C] mx-auto mb-1" />
            <p className="text-white text-sm font-medium">20m</p>
            <p className="text-[#A0A0A0] text-xs">Time</p>
          </div>

          {/* Calories */}
          <div 
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Flame size={20} className="text-[#FF6B6B] mx-auto mb-1" />
            <p className="text-white text-sm font-medium">450</p>
            <p className="text-[#A0A0A0] text-xs">Calories</p>
          </div>

          {/* Protein */}
          <div 
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <TrendingUp size={20} className="text-[#00FF9C] mx-auto mb-1" />
            <p className="text-white text-sm font-medium">42g</p>
            <p className="text-[#A0A0A0] text-xs">Protein</p>
          </div>

          {/* Cost */}
          <div 
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <IndianRupee size={20} className="text-[#FFD93D] mx-auto mb-1" />
            <p className="text-white text-sm font-medium">₹120</p>
            <p className="text-[#A0A0A0] text-xs">Cost</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex-shrink-0 px-6 pb-4">
        <KwilTabs 
          tabs={tabs}
          defaultTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'ingredients' && (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    role="checkbox"
                    aria-checked={ingredient.checked}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all"
                    style={{
                      background: ingredient.checked 
                        ? 'rgba(0, 255, 156, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: ingredient.checked 
                        ? '1px solid rgba(0, 255, 156, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Checkbox */}
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: ingredient.checked 
                          ? 'linear-gradient(135deg, #00FF9C, #10B981)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: ingredient.checked ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {ingredient.checked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check size={14} className="text-[#050B08]" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>

                    {/* Ingredient Info */}
                    <div className="flex-1 text-left">
                      <p 
                        className={`font-medium ${ingredient.checked ? 'text-[#00FF9C] line-through' : 'text-white'}`}
                      >
                        {ingredient.name}
                      </p>
                    </div>

                    {/* Amount */}
                    <p className="text-[#A0A0A0] text-sm font-medium">
                      {ingredient.amount}
                    </p>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'steps' && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div 
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-medium">Progress</p>
                  <p className="text-[#00FF9C] text-sm font-bold">
                    {completedSteps}/{totalSteps}
                  </p>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #00FF9C, #10B981)',
                      boxShadow: '0 0 10px rgba(0, 255, 156, 0.5)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Steps */}
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    role="checkbox"
                    aria-checked={step.completed}
                    onClick={() => toggleStep(step.id)}
                    className="w-full rounded-2xl p-4 text-left transition-all"
                    style={{
                      background: step.completed 
                        ? 'rgba(0, 255, 156, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: step.completed 
                        ? '1px solid rgba(0, 255, 156, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex gap-3">
                      {/* Step Number / Checkbox */}
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: step.completed 
                            ? 'linear-gradient(135deg, #00FF9C, #10B981)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          border: step.completed ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {step.completed ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                          >
                            <Check size={16} className="text-[#050B08]" strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <span className="text-white text-sm font-bold">{step.number}</span>
                        )}
                      </div>

                      {/* Instruction */}
                      <p 
                        className={`flex-1 ${step.completed ? 'text-[#A0A0A0] line-through' : 'text-white'}`}
                      >
                        {step.instruction}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {nutrition.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-white font-bold">
                      {item.value}
                      <span className="text-[#A0A0A0] text-sm ml-1">{item.unit}</span>
                    </p>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 10px ${item.color}`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseInt(item.value) / 100) * 100}%` }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.3), rgba(16, 185, 129, 0.3))',
                      }}
                    >
                      <User size={20} className="text-[#00FF9C]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-medium">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={12} className="text-[#FFD93D]" fill="#FFD93D" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#A0A0A0] text-sm mb-2">{review.comment}</p>
                      <p className="text-[#A0A0A0] text-xs">{review.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 py-4"
        style={{
          background: 'linear-gradient(to top, rgba(5, 11, 8, 0.98) 60%, transparent 100%)',
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            aria-label="Start voice command"
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(0, 255, 156, 0.15)',
              border: '2px solid rgba(0, 255, 156, 0.4)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mic size={24} className="text-[#00FF9C]" />
          </motion.button>
          <motion.button
            className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #00FF9C, #10B981)',
              color: '#050B08',
              boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/recipes/recipe-demo-001/cook')}
          >
            <ChefHat size={22} />
            Start Cooking
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}