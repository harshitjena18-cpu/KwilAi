import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  Flame,
  Zap,
  Target,
  Calendar,
  Trophy,
  Activity,
  ChevronDown,
  ArrowLeft,
  Loader2,
  Plus,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  getDailySummary,
  getWeeklySummary,
  getTodayDateString,
  type DailySummary,
  type WeeklySummary,
} from '../../../services/nutritionService';
import { getCookingStats, type CookingStats } from '../../../services/cookingSessionService';

type TimePeriod = 'week' | 'month' | 'year';

const DEMO_USER_ID = 'demo-user-001';

export default function KwilHealthDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todaySummary, setTodaySummary] = useState<DailySummary | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [cookingStats, setCookingStats] = useState<CookingStats | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const today = getTodayDateString();
      const [daily, weekly, stats] = await Promise.allSettled([
        getDailySummary(DEMO_USER_ID, today),
        getWeeklySummary(DEMO_USER_ID),
        getCookingStats(DEMO_USER_ID),
      ]);

      if (daily.status === 'fulfilled') setTodaySummary(daily.value);
      if (weekly.status === 'fulfilled') setWeeklySummary(weekly.value);
      if (stats.status === 'fulfilled') setCookingStats(stats.value);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Nutrition goals
  const todayGoal = 2000;
  const proteinGoal = 100;
  const carbsGoal = 250;
  const fatsGoal = 65;

  // Today's data
  const todayCalories = todaySummary?.totalCalories || 0;
  const todayProtein = todaySummary?.totalProtein || 0;
  const todayCarbs = todaySummary?.totalCarbs || 0;
  const todayFats = todaySummary?.totalFats || 0;
  const todayProgress = todayGoal > 0 ? Math.min((todayCalories / todayGoal) * 100, 100) : 0;

  // Weekly chart data
  const caloriesData = weeklySummary?.dailySummaries?.map((day) => {
    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
    return {
      day: dayName,
      calories: day.totalCalories,
      goal: todayGoal,
    };
  }) || [
    { day: 'Mon', calories: 0, goal: todayGoal },
    { day: 'Tue', calories: 0, goal: todayGoal },
    { day: 'Wed', calories: 0, goal: todayGoal },
    { day: 'Thu', calories: 0, goal: todayGoal },
    { day: 'Fri', calories: 0, goal: todayGoal },
    { day: 'Sat', calories: 0, goal: todayGoal },
    { day: 'Sun', calories: 0, goal: todayGoal },
  ];

  const proteinData = weeklySummary?.dailySummaries?.map((day) => {
    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
    return {
      day: dayName,
      protein: day.totalProtein,
      goal: proteinGoal,
    };
  }) || [
    { day: 'Mon', protein: 0, goal: proteinGoal },
    { day: 'Tue', protein: 0, goal: proteinGoal },
    { day: 'Wed', protein: 0, goal: proteinGoal },
    { day: 'Thu', protein: 0, goal: proteinGoal },
    { day: 'Fri', protein: 0, goal: proteinGoal },
    { day: 'Sat', protein: 0, goal: proteinGoal },
    { day: 'Sun', protein: 0, goal: proteinGoal },
  ];

  // Stats
  const weeklyAvgCalories = weeklySummary?.averageDaily?.calories || 0;
  const completedMeals = cookingStats?.completedSessions || 0;
  const daysWithData = weeklySummary?.dailySummaries?.filter(d => d.entries.length > 0).length || 0;
  const goalMetDays = weeklySummary?.dailySummaries?.filter(
    d => d.totalCalories >= todayGoal * 0.8 && d.totalCalories <= todayGoal * 1.2
  ).length || 0;
  const goalPercentage = daysWithData > 0 ? Math.round((goalMetDays / daysWithData) * 100) : 0;

  // Progress ring
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (todayProgress / 100) * circumference;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 156, 0.3)',
          }}
        >
          <p className="text-white text-sm font-medium">{payload[0].value}</p>
          <p className="text-[#A0A0A0] text-xs">{payload[0].payload.day}</p>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { id: 'week', label: 'Week', icon: <Calendar size={14} /> },
    { id: 'month', label: 'Month', icon: <Calendar size={14} /> },
    { id: 'year', label: 'Year', icon: <Calendar size={14} /> },
  ];

  if (loading) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ backgroundColor: '#050B08' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-[#00FF9C] animate-spin" />
          <p className="text-[#A0A0A0] text-sm">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Header */}
      <div className="px-6 pt-16 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <motion.button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>

            {/* Title */}
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold">Health Dashboard</h1>
              <p className="text-[#A0A0A0] text-sm">Track your nutrition & progress</p>
            </div>
          </div>

          {/* Period Filter - Dropdown Style */}
          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#00FF9C]" />
                <span className="text-white font-medium capitalize">{selectedPeriod}</span>
              </div>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-[#A0A0A0]" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-10"
                style={{
                  background: 'rgba(0, 0, 0, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 156, 0.2)',
                  boxShadow: '0 0 30px rgba(0, 255, 156, 0.2)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {periods.map((period) => (
                  <motion.button
                    key={period.id}
                    onClick={() => {
                      setSelectedPeriod(period.id as TimePeriod);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 transition-all"
                    style={{
                      background: selectedPeriod === period.id 
                        ? 'rgba(0, 255, 156, 0.1)' 
                        : 'transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                    whileHover={{ background: 'rgba(0, 255, 156, 0.05)' }}
                  >
                    {period.icon}
                    <span className={`font-medium ${
                      selectedPeriod === period.id ? 'text-[#00FF9C]' : 'text-white'
                    }`}>
                      {period.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Weekly Average */}
          <motion.div
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 156, 0.2)',
              boxShadow: '0 0 20px rgba(0, 255, 156, 0.1)',
            }}
            whileHover={{ 
              boxShadow: '0 0 30px rgba(0, 255, 156, 0.2)',
              scale: 1.02,
            }}
          >
            <Zap size={24} className="text-[#00FF9C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">{weeklyAvgCalories}</p>
            <p className="text-[#A0A0A0] text-xs">Avg Cal</p>
          </motion.div>

          {/* Meals Cooked */}
          <motion.div
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
            }}
            whileHover={{ 
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
              scale: 1.02,
            }}
          >
            <Trophy size={24} className="text-[#FFD700] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">{completedMeals}</p>
            <p className="text-[#A0A0A0] text-xs">Cooked</p>
          </motion.div>

          {/* Goal % */}
          <motion.div
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
            }}
            whileHover={{ 
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
              scale: 1.02,
            }}
          >
            <Target size={24} className="text-[#10B981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">{goalPercentage}%</p>
            <p className="text-[#A0A0A0] text-xs">On Target</p>
          </motion.div>
        </div>

        {/* Progress Ring Card */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 156, 0.2)',
            boxShadow: '0 0 30px rgba(0, 255, 156, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today's Progress</h3>
            <Activity size={20} className="text-[#00FF9C]" />
          </div>

          <div className="flex items-center justify-center py-4">
            {/* SVG Progress Ring */}
            <div className="relative">
              <svg width="180" height="180" className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 156, 0.5))',
                  }}
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FF9C" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flame size={32} className="text-[#00FF9C] mb-2" />
                <p className="text-white text-3xl font-bold">{todayCalories}</p>
                <p className="text-[#A0A0A0] text-sm">/ {todayGoal} cal</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-[#00FF9C]" />
                  <p className="text-[#00FF9C] text-xs font-medium">
                    {Math.round(todayProgress)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Macros Breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="text-center">
              <p className="text-[#00FF9C] text-lg font-bold">{todayProtein}g</p>
              <p className="text-[#A0A0A0] text-xs">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-[#FFD93D] text-lg font-bold">{todayCarbs}g</p>
              <p className="text-[#A0A0A0] text-xs">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-[#FF9CEE] text-lg font-bold">{todayFats}g</p>
              <p className="text-[#A0A0A0] text-xs">Fat</p>
            </div>
          </div>

          {/* Empty State Hint */}
          {todayCalories === 0 && (
            <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <p className="text-[#A0A0A0] text-xs mb-2">No meals logged today</p>
              <motion.button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{
                  background: 'rgba(0, 255, 156, 0.15)',
                  border: '1px solid rgba(0, 255, 156, 0.3)',
                  color: '#00FF9C',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app/recipes')}
              >
                <Plus size={16} />
                Cook a recipe to start tracking
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Calories Bar Chart */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 107, 0.2)',
            boxShadow: '0 0 30px rgba(255, 107, 107, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Calories Intake</h3>
              <p className="text-[#A0A0A0] text-xs">Weekly tracking</p>
            </div>
            <Flame size={20} className="text-[#FF6B6B]" />
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255, 255, 255, 0.3)"
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.3)"
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 255, 156, 0.05)' }} />
                <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                  {caloriesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.calories >= entry.goal ? '#FF6B6B' : '#00FF9C'}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#00FF9C' }} />
              <p className="text-[#A0A0A0] text-xs">Under Goal</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF6B6B' }} />
              <p className="text-[#A0A0A0] text-xs">Over Goal</p>
            </div>
          </div>
        </motion.div>

        {/* Protein Line Chart */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 156, 0.2)',
            boxShadow: '0 0 30px rgba(0, 255, 156, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Protein Intake</h3>
              <p className="text-[#A0A0A0] text-xs">Tracking over time</p>
            </div>
            <TrendingUp size={20} className="text-[#00FF9C]" />
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={proteinData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255, 255, 255, 0.3)"
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.3)"
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 156, 0.5)', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="protein" 
                  stroke="url(#proteinGradient)" 
                  strokeWidth={3}
                  dot={{ 
                    fill: '#00FF9C', 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: '#050B08',
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: '#00FF9C',
                    stroke: '#050B08',
                    strokeWidth: 2,
                  }}
                />
                <defs>
                  <linearGradient id="proteinGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00FF9C" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Average Display */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <p className="text-[#A0A0A0] text-xs">Average:</p>
            <p className="text-[#00FF9C] font-bold">{weeklySummary?.averageDaily?.protein || 0}g</p>
            <p className="text-[#A0A0A0] text-xs">/ {proteinGoal}g goal</p>
          </div>
        </motion.div>

        {/* Recent Meals */}
        {todaySummary && todaySummary.entries.length > 0 && (
          <motion.div
            className="rounded-3xl p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4">Today's Meals</h3>
            <div className="space-y-3">
              {todaySummary.entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="rounded-2xl p-3 flex items-center justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {entry.recipeName || 'Manual Entry'}
                    </p>
                    <p className="text-[#A0A0A0] text-xs">
                      P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fats}g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00FF9C] font-bold">{entry.calories}</p>
                    <p className="text-[#A0A0A0] text-xs">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
}
