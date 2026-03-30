import React from 'react';

interface KwilChipProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function KwilChip({ 
  children, 
  variant = 'primary',
  icon,
  onRemove,
  onClick,
  className = ''
}: KwilChipProps) {
  const variants = {
    primary: 'bg-[#00FF9C]/20 text-[#00FF9C] border-[#00FF9C]/40',
    secondary: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
    outline: 'bg-transparent text-[#FFFFFF] border-white/30'
  };

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        border
        text-sm
        transition-all duration-200
        ${variants[variant]}
        ${onClick ? 'hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-current hover:opacity-70"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
