import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Camera, 
  Sparkles,
  Flame,
  Apple,
  IndianRupee,
  Zap,
  Heart,
  Clock,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilCard } from './KwilCard';
import { KwilAvatar } from './KwilAvatar';
import { KwilBadge } from './KwilBadge';
import { useNavigate } from 'react-router';
import { getDailySummary, getTodayDateString, type DailySummary } from '../../../services/nutritionService';
import { getPlanSummary, type UsageSummary } from '../../../services/planService';

const DEMO_USER_ID = 'demo-user-001';

interface RecipeCard {
  id: string;
  name: string;
  image: string;
  cookTime: string;
  calories: string;
  difficulty: string;
  category: string;
}

export default function KwilDashboard() {
  const navigate = useNavigate();
  const [todaySummary, setTodaySummary] = useState<DailySummary | null>(null);
  const [planSummary, setPlanSummary] = useState<UsageSummary | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [daily, plan] = await Promise.allSettled([
        getDailySummary(DEMO_USER_ID, getTodayDateString()),
        getPlanSummary(DEMO_USER_ID),
      ]);
      if (daily.status === 'fulfilled') setTodaySummary(daily.value);
      if (plan.status === 'fulfilled') setPlanSummary(plan.value);
    } catch (error) {
      console.error('Dashboard data load error:', error);
    }
  };

  const calGoal = 2000;
  const proteinGoal = 80;
  const todayCal = todaySummary?.totalCalories || 0;
  const todayProtein = todaySummary?.totalProtein || 0;
  const calPct = calGoal > 0 ? Math.min((todayCal / calGoal) * 100, 100) : 0;
  const proteinPct = proteinGoal > 0 ? Math.min((todayProtein / proteinGoal) * 100, 100) : 0;
  const isPro = planSummary?.plan === 'pro';

  const quickActions = [
    { id: 'protein', label: 'Protein', icon: <Flame size={18} />, color: '#FF6B6B' },
    { id: 'diet', label: 'Diet', icon: <Apple size={18} />, color: '#00FF9C' },
    { id: 'budget', label: 'Budget', icon: <IndianRupee size={18} />, color: '#FFD93D' },
    { id: 'quick', label: 'Quick', icon: <Zap size={18} />, color: '#6BCF7F' },
    { id: 'healthy', label: 'Healthy', icon: <Heart size={18} />, color: '#FF9CEE' },
  ];

  const recommendedRecipes: RecipeCard[] = [
    {
      id: '1',
      name: 'Protein Power Bowl',
      image: '\u{1F957}',
      cookTime: '15 min',
      calories: '450 kcal',
      difficulty: 'Easy',
      category: 'High Protein'
    },
    {
      id: '2',
      name: 'Keto Avocado Toast',
      image: '\u{1F951}',
      cookTime: '10 min',
      calories: '320 kcal',
      difficulty: 'Easy',
      category: 'Keto'
    },
    {
      id: '3',
      name: 'Muscle Gain Smoothie',
      image: '\u{1F964}',
      cookTime: '5 min',
      calories: '550 kcal',
      difficulty: 'Easy',
      category: 'Muscle Gain'
    },
  ];

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00FF9C]"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Top Bar */}
      <motion.div 
        className="relative z-10 px-6 pt-16 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          {/* Profile & Greeting */}
          <div className="flex items-center gap-3">
            <KwilAvatar name="Harsh" size="md" glow />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-lg font-bold">Hi Harsh</h2>
                {planSummary && (
                  <KwilBadge variant={isPro ? 'warning' : 'primary'}>
                    {isPro ? 'Pro' : 'Free'}
                  </KwilBadge>
                )}
              </div>
              <p className="text-[#A0A0A0] text-xs">Ready to cook something amazing?</p>
            </div>
          </div>

          {/* Notification */}
          <motion.button
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} className="text-[#A0A0A0]" />
            <div 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{
                background: '#FF6B6B',
                boxShadow: '0 0 10px #FF6B6B',
              }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10">
        <div className="space-y-6">

          {/* Plan Usage Banner (Free users) */}
          {planSummary && !isPro && (
            <motion.button
              className="w-full rounded-2xl p-4 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 165, 0, 0.05))',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
              onClick={() => navigate('/app/upgrade')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <Crown size={20} className="text-[#FFD700]" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {planSummary.today.scans.remaining} scans left today
                  </p>
                  <p className="text-[#A0A0A0] text-xs">Upgrade to Pro for unlimited</p>
                </div>
              </div>
              <KwilBadge variant="warning">Upgrade</KwilBadge>
            </motion.button>
          )}

          {/* AI Orb Section */}
          <motion.div
            className="py-8 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Large Glowing AI Orb */}
            <div className="relative mb-6">
              {/* Outer Ring 1 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '200px',
                  height: '200px',
                  border: '2px solid rgba(0, 255, 156, 0.3)',
                  boxShadow: '0 0 30px rgba(0, 255, 156, 0.3)',
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* Outer Ring 2 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '200px',
                  height: '200px',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
                  margin: '10px',
                }}
                animate={{
                  rotate: -360,
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                }}
              />

              {/* Center Orb */}
              <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: '160px',
                  height: '160px',
                  margin: '20px',
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(92, 255, 209, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                    linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)
                  `,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 156, 0.4)',
                  boxShadow: `
                    0 0 60px rgba(0, 255, 156, 0.5),
                    inset 0 0 40px rgba(0, 255, 156, 0.2)
                  `,
                }}
                animate={{
                  boxShadow: [
                    '0 0 60px rgba(0, 255, 156, 0.5), inset 0 0 40px rgba(0, 255, 156, 0.2)',
                    '0 0 80px rgba(0, 255, 156, 0.7), inset 0 0 60px rgba(0, 255, 156, 0.3)',
                    '0 0 60px rgba(0, 255, 156, 0.5), inset 0 0 40px rgba(0, 255, 156, 0.2)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles size={60} className="text-[#00FF9C]" />
                </motion.div>

                {/* Inner Glow Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[#00FF9C]"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos((i * Math.PI * 2) / 8) * 40, 0],
                      y: [0, Math.sin((i * Math.PI * 2) / 8) * 40, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* AI Prompt Text */}
            <motion.h3 
              className="text-white text-2xl font-bold mb-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              What can I cook today?
            </motion.h3>
            <motion.p 
              className="text-[#A0A0A0] text-sm text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Let AI suggest personalized recipes
            </motion.p>

            {/* Primary Scan Button */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <KwilButton 
                variant="primary" 
                fullWidth
                onClick={() => navigate('/app/scanner')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Camera size={20} />
                  <span>Scan Ingredients</span>
                </div>
              </KwilButton>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-white font-medium">Quick Actions</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[80px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `${action.color}20`,
                      boxShadow: `0 0 15px ${action.color}30`,
                    }}
                  >
                    <span style={{ color: action.color }}>
                      {action.icon}
                    </span>
                  </div>
                  <span className="text-white text-xs font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recommended Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Recommended for You</h4>
              <button 
                className="text-[#00FF9C] text-sm"
                onClick={() => navigate('/app/recipes')}
              >
                See All
              </button>
            </div>

            {/* Horizontal Recipe Cards */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
              {recommendedRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden relative"
                  style={{
                    width: '260px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 156, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 255, 156, 0.2)',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 40px rgba(0, 255, 156, 0.4)',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {/* Recipe Image */}
                  <div 
                    className="h-32 flex items-center justify-center text-6xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(0, 255, 156, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)`,
                    }}
                  >
                    {recipe.image}
                  </div>

                  {/* Recipe Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h5 className="text-white font-medium mb-1">{recipe.name}</h5>
                      <KwilBadge variant="primary">{recipe.category}</KwilBadge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <Clock size={14} className="text-[#00FF9C]" />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <Flame size={14} className="text-[#FF6B6B]" />
                        <span>{recipe.calories}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <TrendingUp size={14} className="text-[#FFD93D]" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full py-2 rounded-full text-sm font-medium transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                        border: '1px solid rgba(0, 255, 156, 0.3)',
                        color: '#00FF9C',
                      }}
                      onClick={() => navigate(`/app/recipe/${recipe.id}`)}
                    >
                      View Recipe
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Today's Goals - Live Data */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Today's Goals</h4>
              <button 
                className="text-[#00FF9C] text-sm"
                onClick={() => navigate('/app/health')}
              >
                Details
              </button>
            </div>
            <KwilCard glow>
              <div className="space-y-4">
                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-[#FF6B6B]" />
                      <span className="text-white text-sm">Calories</span>
                    </div>
                    <span className="text-[#A0A0A0] text-sm">
                      {todayCal.toLocaleString()} / {calGoal.toLocaleString()} kcal
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <motion.div 
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #FF6B6B, #FF9CEE)',
                        boxShadow: '0 0 10px #FF6B6B',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${calPct}%` }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                    />
                  </div>
                </div>

                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Apple size={16} className="text-[#00FF9C]" />
                      <span className="text-white text-sm">Protein</span>
                    </div>
                    <span className="text-[#A0A0A0] text-sm">
                      {todayProtein} / {proteinGoal} g
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <motion.div 
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #00FF9C, #10B981)',
                        boxShadow: '0 0 10px #00FF9C',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${proteinPct}%` }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                    />
                  </div>
                </div>
              </div>
            </KwilCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
