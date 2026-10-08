import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface KwilTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function KwilTabs({ 
  tabs, 
  defaultTab,
  onChange,
  className = ''
}: KwilTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-full border border-[#00FF9C]/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-6 py-3
                rounded-full
                text-sm
                transition-all duration-300
                focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]
                ${isActive 
                  ? 'bg-gradient-to-r from-[#00FF9C] to-[#10B981] text-[#050B08] shadow-[0_0_20px_rgba(0,255,156,0.4)]' 
                  : 'text-[#A0A0A0] hover:text-[#FFFFFF]'
                }
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
