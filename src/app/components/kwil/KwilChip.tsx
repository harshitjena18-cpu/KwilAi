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

  const isInteractive = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        border
        text-sm
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]
        ${variants[variant]}
        ${isInteractive ? 'hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
    >
      {icon && <span className="text-current" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={`Remove ${typeof children === 'string' ? children : 'item'}`}
          className="ml-1 text-current hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-full px-1"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
