import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

interface KwilNavBarProps {
  items: NavItem[];
  defaultActive?: string;
  onChange?: (itemId: string) => void;
  className?: string;
}

export function KwilNavBar({ 
  items, 
  defaultActive,
  onChange,
  className = ''
}: KwilNavBarProps) {
  const [activeItem, setActiveItem] = useState(defaultActive || items[0]?.id);

  // Update active item when defaultActive changes (for route changes)
  useEffect(() => {
    if (defaultActive) {
      setActiveItem(defaultActive);
    }
  }, [defaultActive]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    onChange?.(itemId);
  };

  return (
    <nav className={`
      fixed bottom-0 left-0 right-0 z-50
      bg-[#0A1410]/95 backdrop-blur-xl
      border-t border-[#00FF9C]/20
      px-4 py-3
      ${className}
    `}
      style={{
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Gradient Fade at Top */}
      <div 
        className="absolute bottom-full left-0 right-0 h-8 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(5, 11, 8, 0.8) 0%, transparent 100%)',
        }}
      />
      
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08] rounded-2xl"
            >
              <div className={`
                p-3 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-[#00FF9C] to-[#10B981] text-[#050B08] shadow-[0_0_20px_rgba(0,255,156,0.5)]' 
                  : 'text-[#A0A0A0]'
                }
              `}>
                {item.icon}
              </div>
              <span className={`
                text-xs transition-all duration-300
                ${isActive ? 'text-[#00FF9C]' : 'text-[#A0A0A0]'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}