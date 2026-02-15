import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Search, BookOpen, User } from 'lucide-react';
import { KwilNavBar } from '../components/kwil';
import { useEffect } from 'react';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home', path: '/app/home' },
    { id: 'search', icon: <Search size={20} />, label: 'Search', path: '/app/search' },
    { id: 'recipes', icon: <BookOpen size={20} />, label: 'Recipes', path: '/app/recipes' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile', path: '/app/profile' },
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/app/home')) return 'home';
    if (path.startsWith('/app/search')) return 'search';
    if (path.startsWith('/app/recipes')) return 'recipes';
    if (path.startsWith('/app/profile') || path.startsWith('/app/health')) return 'profile';
    if (path.startsWith('/app/scanner')) return 'home';
    if (path.startsWith('/app/upgrade')) return 'profile';
    return 'home';
  };

  const handleNavChange = (itemId: string) => {
    const item = navItems.find(i => i.id === itemId);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
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

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      {/* Bottom Navigation - Hide on certain screens */}
      {!location.pathname.includes('/cook') && !location.pathname.includes('/scanner') && (
        <KwilNavBar 
          items={navItems} 
          defaultActive={getActiveTab()}
          onChange={handleNavChange}
        />
      )}
    </div>
  );
}