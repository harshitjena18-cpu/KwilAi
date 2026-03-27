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
  const childText = typeof children === 'string' ? children : 'chip';

  return (
    <div
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        border
        text-sm
        transition-all duration-200
        ${variants[variant]}
        ${isInteractive ? 'hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C]' : ''}
        ${className}
      `}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${childText}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            // Prevent Enter/Space from bubbling up to the div if it is also interactive
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
          className="ml-1 text-current hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] rounded-full"
        >
          ×
        </button>
      )}
    </div>
  );
}
