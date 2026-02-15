import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, TrendingUp, Clock, Flame, Star, ChevronRight } from 'lucide-react';
import { KwilInput, KwilChip, KwilCard } from '../components/kwil';
import { useNavigate } from 'react-router';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const trendingSearches = [
    'High protein meals',
    'Quick breakfast',
    'Vegan dinner',
    'Meal prep ideas',
  ];

  const filters = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'quick', label: 'Quick (<30min)' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'gluten-free', label: 'Gluten Free' },
  ];

  const recentSearches = [
    { id: '1', query: 'Chicken salad', time: '2h ago' },
    { id: '2', query: 'Protein smoothie', time: '1d ago' },
    { id: '3', query: 'Buddha bowl', time: '2d ago' },
  ];

  const suggestedRecipes = [
    { id: '1', name: 'Grilled Chicken Power Salad', calories: 450, time: 20, rating: 4.9, emoji: '🥙' },
    { id: '2', name: 'Protein Packed Smoothie Bowl', calories: 380, time: 10, rating: 4.8, emoji: '🥣' },
    { id: '3', name: 'Asian Fusion Buddha Bowl', calories: 420, time: 25, rating: 4.7, emoji: '🍜' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#050B08' }}>
      {/* Header */}
      <div className="px-6 pt-16 pb-4">
        <h1 className="text-white text-3xl font-bold mb-2">Search</h1>
        <p className="text-[#A0A0A0] text-sm">Find your perfect recipe</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <KwilInput
          placeholder="Search recipes, ingredients..."
          icon={<Search size={20} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-[#00FF9C]" />
          <p className="text-white text-sm font-medium">Filters</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map(filter => (
            <KwilChip
              key={filter.id}
              variant={selectedFilters.includes(filter.id) ? 'primary' : 'outline'}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </KwilChip>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        {searchQuery === '' ? (
          <>
            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-[#00FF9C]" />
                <h3 className="text-white font-semibold">Trending Searches</h3>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    className="w-full rounded-2xl p-4 flex items-center justify-between"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    whileHover={{ 
                      background: 'rgba(0, 255, 156, 0.1)',
                      borderColor: 'rgba(0, 255, 156, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSearchQuery(search)}
                  >
                    <p className="text-white">{search}</p>
                    <ChevronRight size={20} className="text-[#A0A0A0]" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-[#00FF9C]" />
                  <h3 className="text-white font-semibold">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search) => (
                    <motion.button
                      key={search.id}
                      className="w-full rounded-2xl p-4 flex items-center justify-between"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      whileHover={{ 
                        background: 'rgba(0, 255, 156, 0.1)',
                        borderColor: 'rgba(0, 255, 156, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSearchQuery(search.query)}
                    >
                      <div className="text-left">
                        <p className="text-white">{search.query}</p>
                        <p className="text-[#A0A0A0] text-xs">{search.time}</p>
                      </div>
                      <ChevronRight size={20} className="text-[#A0A0A0]" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">
                Results for "{searchQuery}"
              </h3>
              <p className="text-[#A0A0A0] text-sm">{suggestedRecipes.length} recipes</p>
            </div>
            <div className="space-y-3">
              {suggestedRecipes.map((recipe, index) => (
                <motion.button
                  key={recipe.id}
                  className="w-full rounded-3xl p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    background: 'rgba(0, 255, 156, 0.1)',
                    borderColor: 'rgba(0, 255, 156, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/app/recipe/${recipe.id}`)}
                >
                  <div className="flex gap-4">
                    {/* Recipe Image */}
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.2), rgba(16, 185, 129, 0.1))',
                      }}
                    >
                      {recipe.emoji}
                    </div>

                    {/* Recipe Info */}
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-semibold mb-1">{recipe.name}</h4>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-[#A0A0A0]" />
                          <p className="text-[#A0A0A0] text-xs">{recipe.time}m</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame size={14} className="text-[#FF6B6B]" />
                          <p className="text-[#A0A0A0] text-xs">{recipe.calories}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-[#FFD93D]" fill="#FFD93D" />
                          <p className="text-[#A0A0A0] text-xs">{recipe.rating}</p>
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={20} className="text-[#00FF9C] self-center" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}