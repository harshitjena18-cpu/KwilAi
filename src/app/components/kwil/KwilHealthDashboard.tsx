import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  Target,
  Calendar,
  Trophy,
  Activity,
  ChevronDown,
  ArrowLeft
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

type TimePeriod = 'week' | 'month' | 'year';

export default function KwilHealthDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Weekly data for calories bar chart
  const weeklyCaloriesData = [
    { day: 'Mon', calories: 1800, goal: 2000 },
    { day: 'Tue', calories: 2100, goal: 2000 },
    { day: 'Wed', calories: 1900, goal: 2000 },
    { day: 'Thu', calories: 2200, goal: 2000 },
    { day: 'Fri', calories: 1850, goal: 2000 },
    { day: 'Sat', calories: 2300, goal: 2000 },
    { day: 'Sun', calories: 1950, goal: 2000 },
  ];

  // Monthly data
  const monthlyCaloriesData = [
    { day: 'W1', calories: 1850, goal: 2000 },
    { day: 'W2', calories: 1950, goal: 2000 },
    { day: 'W3', calories: 2100, goal: 2000 },
    { day: 'W4', calories: 1900, goal: 2000 },
  ];

  // Yearly data
  const yearlyCaloriesData = [
    { day: 'Jan', calories: 1900, goal: 2000 },
    { day: 'Feb', calories: 1950, goal: 2000 },
    { day: 'Mar', calories: 2050, goal: 2000 },
    { day: 'Apr', calories: 2100, goal: 2000 },
    { day: 'May', calories: 1850, goal: 2000 },
    { day: 'Jun', calories: 1950, goal: 2000 },
    { day: 'Jul', calories: 2000, goal: 2000 },
    { day: 'Aug', calories: 2100, goal: 2000 },
    { day: 'Sep', calories: 1900, goal: 2000 },
    { day: 'Oct', calories: 2050, goal: 2000 },
    { day: 'Nov', calories: 1950, goal: 2000 },
    { day: 'Dec', calories: 2000, goal: 2000 },
  ];

  // Protein line chart data
  const weeklyProteinData = [
    { day: 'Mon', protein: 85, goal: 100 },
    { day: 'Tue', protein: 92, goal: 100 },
    { day: 'Wed', protein: 88, goal: 100 },
    { day: 'Thu', protein: 105, goal: 100 },
    { day: 'Fri', protein: 78, goal: 100 },
    { day: 'Sat', protein: 95, goal: 100 },
    { day: 'Sun', protein: 90, goal: 100 },
  ];

  const monthlyProteinData = [
    { day: 'W1', protein: 88, goal: 100 },
    { day: 'W2', protein: 92, goal: 100 },
    { day: 'W3', protein: 95, goal: 100 },
    { day: 'W4', protein: 85, goal: 100 },
  ];

  const yearlyProteinData = [
    { day: 'Jan', protein: 85, goal: 100 },
    { day: 'Feb', protein: 88, goal: 100 },
    { day: 'Mar', protein: 92, goal: 100 },
    { day: 'Apr', protein: 95, goal: 100 },
    { day: 'May', protein: 90, goal: 100 },
    { day: 'Jun', protein: 88, goal: 100 },
    { day: 'Jul', protein: 93, goal: 100 },
    { day: 'Aug', protein: 96, goal: 100 },
    { day: 'Sep', protein: 91, goal: 100 },
    { day: 'Oct', protein: 94, goal: 100 },
    { day: 'Nov', protein: 89, goal: 100 },
    { day: 'Dec', protein: 92, goal: 100 },
  ];

  const caloriesData = selectedPeriod === 'week' 
    ? weeklyCaloriesData 
    : selectedPeriod === 'month' 
    ? monthlyCaloriesData 
    : yearlyCaloriesData;

  const proteinData = selectedPeriod === 'week' 
    ? weeklyProteinData 
    : selectedPeriod === 'month' 
    ? monthlyProteinData 
    : yearlyProteinData;

  // Stats calculations
  const weeklyAvgCalories = Math.round(
    weeklyCaloriesData.reduce((sum, day) => sum + day.calories, 0) / weeklyCaloriesData.length
  );
  const currentStreak = 7;
  const goalPercentage = 89;

  // Progress ring calculation
  const todayCalories = 1650;
  const todayGoal = 2000;
  const todayProgress = (todayCalories / todayGoal) * 100;
  const circumference = 2 * Math.PI * 70; // radius = 70
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

  const navigate = useNavigate();

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
            <p className="text-[#A0A0A0] text-xs">Weekly Avg</p>
          </motion.div>

          {/* Streak */}
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
            <p className="text-2xl font-bold text-white mb-1">{currentStreak}</p>
            <p className="text-[#A0A0A0] text-xs">Day Streak</p>
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
            <p className="text-[#A0A0A0] text-xs">Goal Met</p>
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
              <p className="text-[#00FF9C] text-lg font-bold">125g</p>
              <p className="text-[#A0A0A0] text-xs">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-[#FFD93D] text-lg font-bold">180g</p>
              <p className="text-[#A0A0A0] text-xs">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-[#FF9CEE] text-lg font-bold">55g</p>
              <p className="text-[#A0A0A0] text-xs">Fat</p>
            </div>
          </div>
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
              <p className="text-[#A0A0A0] text-xs">Daily tracking</p>
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
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 156, 0.8))',
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
            <p className="text-[#00FF9C] font-bold">90g</p>
            <p className="text-[#A0A0A0] text-xs">/ 100g goal</p>
          </div>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
}