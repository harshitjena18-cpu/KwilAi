import { useState } from 'react';
import { 
  Home, 
  Search, 
  BookOpen, 
  User, 
  Sparkles, 
  ChefHat, 
  Heart,
  Clock,
  Flame,
  Apple,
  Settings
} from 'lucide-react';
import { 
  KwilButton, 
  KwilInput, 
  KwilCard, 
  KwilChip, 
  KwilTabs,
  KwilNavBar,
  KwilSwitch,
  KwilProgress,
  KwilAvatar,
  KwilBadge
} from './components/kwil';

export default function App() {
  const [selectedSection, setSelectedSection] = useState('components');

  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'search', icon: <Search size={20} />, label: 'Search' },
    { id: 'recipes', icon: <BookOpen size={20} />, label: 'Recipes' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const tabs = [
    { id: 'components', label: 'Components', icon: <Sparkles size={16} /> },
    { id: 'preview', label: 'Preview', icon: <ChefHat size={16} /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#050B08' }}>
      {/* Mobile Frame */}
      <div 
        className="relative overflow-hidden rounded-[3rem] shadow-2xl border-8 border-gray-900"
        style={{ 
          width: '390px', 
          height: '844px',
          backgroundColor: '#050B08'
        }}
      >
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-between px-8">
          <span className="text-white text-sm">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-4 bg-white/80 rounded-sm"></div>
            <div className="w-4 h-4 bg-white/60 rounded-sm"></div>
            <div className="w-4 h-4 bg-white/40 rounded-sm"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-full overflow-y-auto pb-24 pt-12">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 pt-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="text-[#00FF9C]" size={32} />
                <h1 className="text-4xl font-bold text-white">Kwil AI</h1>
              </div>
              <p className="text-[#A0A0A0]">Design System Showcase</p>
            </div>

            {/* Section Tabs */}
            <KwilTabs 
              tabs={tabs} 
              defaultTab={selectedSection}
              onChange={setSelectedSection}
            />

            {selectedSection === 'components' ? (
              <>
                {/* Buttons Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Buttons</h3>
                  <KwilCard>
                    <div className="space-y-3">
                      <KwilButton variant="primary" fullWidth>
                        Primary Button
                      </KwilButton>
                      <KwilButton variant="secondary" fullWidth>
                        Secondary Button
                      </KwilButton>
                      <KwilButton variant="outline" fullWidth>
                        Outline Button
                      </KwilButton>
                      <div className="flex gap-2">
                        <KwilButton variant="primary" size="sm">
                          Small
                        </KwilButton>
                        <KwilButton variant="primary" size="md">
                          Medium
                        </KwilButton>
                        <KwilButton variant="primary" size="lg">
                          Large
                        </KwilButton>
                      </div>
                    </div>
                  </KwilCard>
                </div>

                {/* Inputs Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Inputs</h3>
                  <KwilCard>
                    <div className="space-y-4">
                      <KwilInput 
                        placeholder="Search recipes..." 
                        icon={<Search size={20} />}
                      />
                      <KwilInput 
                        label="Email"
                        type="email"
                        placeholder="Enter your email" 
                      />
                      <KwilInput 
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        error="Password is required"
                      />
                    </div>
                  </KwilCard>
                </div>

                {/* Cards Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Cards</h3>
                  <KwilCard glow hover>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00FF9C] to-[#10B981] flex items-center justify-center">
                        <ChefHat className="text-[#050B08]" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white">Glowing Card</h4>
                        <p className="text-[#A0A0A0] text-sm">With hover effect</p>
                      </div>
                    </div>
                  </KwilCard>
                  <KwilCard>
                    <div className="space-y-2">
                      <h4 className="text-white">AI Recipe Suggestions</h4>
                      <p className="text-[#A0A0A0] text-sm">
                        Get personalized recipe recommendations based on your preferences and dietary needs.
                      </p>
                    </div>
                  </KwilCard>
                </div>

                {/* Chips Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Chips</h3>
                  <KwilCard>
                    <div className="flex flex-wrap gap-2">
                      <KwilChip variant="primary" icon={<Flame size={14} />}>
                        Trending
                      </KwilChip>
                      <KwilChip variant="secondary" icon={<Heart size={14} />}>
                        Favorites
                      </KwilChip>
                      <KwilChip variant="outline" icon={<Clock size={14} />}>
                        Quick
                      </KwilChip>
                      <KwilChip variant="primary" icon={<Apple size={14} />} onRemove={() => {}}>
                        Vegan
                      </KwilChip>
                    </div>
                  </KwilCard>
                </div>

                {/* Color Palette */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Color Palette</h3>
                  <KwilCard>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: '#00FF9C' }}></div>
                        <div>
                          <p className="text-white text-sm">Neon Green</p>
                          <p className="text-[#A0A0A0] text-xs">#00FF9C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: '#10B981' }}></div>
                        <div>
                          <p className="text-white text-sm">Emerald</p>
                          <p className="text-[#A0A0A0] text-xs">#10B981</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: '#5CFFD1' }}></div>
                        <div>
                          <p className="text-white text-sm">Mint Glow</p>
                          <p className="text-[#A0A0A0] text-xs">#5CFFD1</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-white/20" style={{ backgroundColor: '#050B08' }}></div>
                        <div>
                          <p className="text-white text-sm">Background</p>
                          <p className="text-[#A0A0A0] text-xs">#050B08</p>
                        </div>
                      </div>
                    </div>
                  </KwilCard>
                </div>

                {/* Switch Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Switch</h3>
                  <KwilCard>
                    <div className="space-y-3">
                      <KwilSwitch label="Dark Mode" />
                      <KwilSwitch label="Notifications" />
                      <KwilSwitch label="Email Alerts" />
                    </div>
                  </KwilCard>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Progress</h3>
                  <KwilCard>
                    <div className="space-y-3">
                      <KwilProgress value={30} />
                      <KwilProgress value={60} />
                      <KwilProgress value={90} />
                    </div>
                  </KwilCard>
                </div>

                {/* Avatar Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Avatar</h3>
                  <KwilCard>
                    <div className="flex gap-3 items-center">
                      <KwilAvatar name="John Doe" size="sm" />
                      <KwilAvatar name="Jane Smith" size="md" />
                      <KwilAvatar name="Sarah Logan" size="lg" glow />
                    </div>
                  </KwilCard>
                </div>

                {/* Badge Section */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Badges</h3>
                  <KwilCard>
                    <div className="flex flex-wrap gap-2">
                      <KwilBadge variant="primary" dot>New</KwilBadge>
                      <KwilBadge variant="secondary" dot>Hot</KwilBadge>
                      <KwilBadge variant="success">Verified</KwilBadge>
                      <KwilBadge variant="warning">Beta</KwilBadge>
                      <KwilBadge variant="danger">Limited</KwilBadge>
                    </div>
                  </KwilCard>
                </div>
              </>
            ) : (
              <>
                {/* Preview App Screen */}
                <div className="space-y-6">
                  {/* Welcome Header */}
                  <div className="space-y-2">
                    <h2 className="text-white text-2xl">Good Morning! 👋</h2>
                    <p className="text-[#A0A0A0]">What would you like to cook today?</p>
                  </div>

                  {/* AI Search Bar */}
                  <KwilCard glow>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FF9C] to-[#10B981] flex items-center justify-center animate-pulse">
                        <Sparkles className="text-[#050B08]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Ask Kwil AI</p>
                        <p className="text-[#A0A0A0] text-xs">Your personal chef assistant</p>
                      </div>
                    </div>
                  </KwilCard>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <KwilCard hover className="text-center py-4">
                        <ChefHat className="text-[#00FF9C] mx-auto mb-2" size={28} />
                        <p className="text-white text-sm">New Recipe</p>
                      </KwilCard>
                      <KwilCard hover className="text-center py-4">
                        <Settings className="text-[#00FF9C] mx-auto mb-2" size={28} />
                        <p className="text-white text-sm">Meal Plan</p>
                      </KwilCard>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <h3 className="text-white">Categories</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      <KwilChip variant="primary" icon={<Flame size={14} />}>Trending</KwilChip>
                      <KwilChip variant="outline">Breakfast</KwilChip>
                      <KwilChip variant="outline">Lunch</KwilChip>
                      <KwilChip variant="outline">Dinner</KwilChip>
                    </div>
                  </div>

                  {/* Featured Recipe */}
                  <div className="space-y-3">
                    <h3 className="text-white">Featured Today</h3>
                    <KwilCard glow hover>
                      <div className="space-y-3">
                        <div className="h-40 bg-gradient-to-br from-[#00FF9C]/20 to-[#10B981]/20 rounded-2xl flex items-center justify-center">
                          <ChefHat className="text-[#00FF9C]" size={64} />
                        </div>
                        <div>
                          <h4 className="text-white">Healthy Buddha Bowl</h4>
                          <p className="text-[#A0A0A0] text-sm">Fresh, nutritious & delicious</p>
                        </div>
                        <div className="flex gap-2">
                          <KwilChip variant="primary" icon={<Clock size={12} />}>
                            <span className="text-xs">25 min</span>
                          </KwilChip>
                          <KwilChip variant="secondary" icon={<Apple size={12} />}>
                            <span className="text-xs">Vegan</span>
                          </KwilChip>
                        </div>
                      </div>
                    </KwilCard>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <KwilNavBar items={navItems} defaultActive="home" />
      </div>
    </div>
  );
}