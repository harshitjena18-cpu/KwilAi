import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Star,
  Clock,
  Flame,
  Apple,
  Heart,
  Bookmark,
  TrendingUp
} from 'lucide-react';
import { KwilChip } from './KwilChip';

interface Recipe {
  id: string;
  name: string;
  image: string;
  rating: number;
  time: string;
  calories: number;
  protein: number;
  category: string;
  isFavorite?: boolean;
}

export default function KwilRecipes() {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['high-protein']);

  const filters = [
    { id: 'high-protein', label: 'High Protein', icon: <Apple size={14} /> },
    { id: 'low-cal', label: 'Low Cal', icon: <Flame size={14} /> },
    { id: 'veg', label: 'Veg', icon: <Apple size={14} /> },
    { id: 'fast', label: 'Fast', icon: <Clock size={14} /> },
  ];

  const recipes: Recipe[] = [
    {
      id: '1',
      name: 'Protein Power Bowl',
      image: '🥗',
      rating: 4.8,
      time: '15 min',
      calories: 450,
      protein: 35,
      category: 'High Protein',
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      image: '🥙',
      rating: 4.9,
      time: '20 min',
      calories: 380,
      protein: 42,
      category: 'High Protein',
    },
    {
      id: '3',
      name: 'Veggie Stir Fry',
      image: '🥘',
      rating: 4.7,
      time: '12 min',
      calories: 280,
      protein: 12,
      category: 'Vegan',
    },
    {
      id: '4',
      name: 'Quinoa Buddha Bowl',
      image: '🍲',
      rating: 4.6,
      time: '18 min',
      calories: 350,
      protein: 18,
      category: 'Vegan',
    },
    {
      id: '5',
      name: 'Salmon & Avocado',
      image: '🍣',
      rating: 4.9,
      time: '25 min',
      calories: 520,
      protein: 38,
      category: 'High Protein',
      isFavorite: true,
    },
    {
      id: '6',
      name: 'Greek Yogurt Parfait',
      image: '🥤',
      rating: 4.5,
      time: '5 min',
      calories: 220,
      protein: 20,
      category: 'Quick',
    },
    {
      id: '7',
      name: 'Turkey Wrap',
      image: '🌯',
      rating: 4.7,
      time: '10 min',
      calories: 340,
      protein: 28,
      category: 'Quick',
    },
    {
      id: '8',
      name: 'Egg White Omelette',
      image: '🍳',
      rating: 4.8,
      time: '8 min',
      calories: 180,
      protein: 24,
      category: 'Low Cal',
    },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '10%',
            right: '-20%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 px-6 pt-16 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <motion.button
            aria-label="Go back"
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
            <h1 className="text-white text-2xl font-bold">AI Recipes</h1>
            <p className="text-[#A0A0A0] text-sm">Personalized for you</p>
          </div>

          {/* Favorites Icon */}
          <motion.button
            aria-label="View favorites"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={20} className="text-[#00FF9C]" fill="#00FF9C" />
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <motion.div 
        className="relative z-10 px-6 pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter, index) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <button
                onClick={() => toggleFilter(filter.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-all"
                style={{
                  background: selectedFilters.includes(filter.id)
                    ? 'linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: selectedFilters.includes(filter.id)
                    ? '1px solid rgba(0, 255, 156, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedFilters.includes(filter.id)
                    ? '0 0 20px rgba(0, 255, 156, 0.3)'
                    : 'none',
                }}
              >
                <span
                  style={{
                    color: selectedFilters.includes(filter.id) ? '#00FF9C' : '#A0A0A0',
                  }}
                >
                  {filter.icon}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: selectedFilters.includes(filter.id) ? '#00FF9C' : '#A0A0A0',
                  }}
                >
                  {filter.label}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recipe Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10">
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 32px rgba(0, 255, 156, 0.2)',
                border: '1px solid rgba(0, 255, 156, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Recipe Image */}
              <div className="relative">
                <div 
                  className="h-32 flex items-center justify-center text-5xl relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  }}
                >
                  {recipe.image}
                  
                  {/* Favorite Badge */}
                  {recipe.isFavorite && (
                    <motion.div
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05, type: 'spring' }}
                    >
                      <Heart size={14} className="text-[#FF6B6B]" fill="#FF6B6B" />
                    </motion.div>
                  )}

                  {/* Rating Badge */}
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Star size={10} className="text-[#FFD93D]" fill="#FFD93D" />
                    <span className="text-white text-xs font-medium">{recipe.rating}</span>
                  </div>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-3 space-y-2">
                {/* Name */}
                <h3 className="text-white font-medium text-sm line-clamp-1">
                  {recipe.name}
                </h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Time */}
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-[#00FF9C]" />
                    <span className="text-[#A0A0A0] text-xs">{recipe.time}</span>
                  </div>

                  {/* Calories */}
                  <div className="flex items-center gap-1">
                    <Flame size={12} className="text-[#FF6B6B]" />
                    <span className="text-[#A0A0A0] text-xs">{recipe.calories}</span>
                  </div>

                  {/* Protein */}
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-[#00FF9C]" />
                    <span className="text-[#A0A0A0] text-xs">{recipe.protein}g</span>
                  </div>

                  {/* Category Badge */}
                  <div 
                    className="px-2 py-0.5 rounded text-xs text-center"
                    style={{
                      background: 'rgba(0, 255, 156, 0.1)',
                      color: '#00FF9C',
                    }}
                  >
                    {recipe.category.split(' ')[0]}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full py-2 rounded-full text-xs font-medium transition-all mt-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                    border: '1px solid rgba(0, 255, 156, 0.3)',
                    color: '#00FF9C',
                  }}
                  onClick={() => navigate(`/app/recipe/${recipe.id}`)}
                >
                  View Recipe
                </button>
              </div>

              {/* Glow Effect on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.05) 0%, transparent 50%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            className="px-6 py-3 rounded-full font-medium transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#A0A0A0',
            }}
          >
            Load More Recipes
          </button>
        </motion.div>
      </div>

      {/* Floating Action Indicator */}
      <motion.div
        className="absolute bottom-6 right-6 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: 'spring', damping: 10 }}
      >
        <button
          aria-label="View saved bookmarks"
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
            boxShadow: '0 0 30px rgba(0, 255, 156, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Bookmark size={24} className="text-[#050B08]" />
        </button>
      </motion.div>
    </div>
  );
}