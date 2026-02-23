import React from 'react';

interface KwilChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
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
  className = '',
  ...props
}: KwilChipProps) {
  const variants = {
    primary: 'bg-[#00FF9C]/20 text-[#00FF9C] border-[#00FF9C]/40',
    secondary: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
    outline: 'bg-transparent text-[#FFFFFF] border-white/30'
  };

  const isInteractive = !!onClick;
  // If it's clickable and doesn't have a remove button, it's a simple button.
  const isButton = isInteractive && !onRemove;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && !isButton && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const commonClasses = `
    inline-flex items-center gap-2
    px-4 py-2
    rounded-full
    border
    text-sm
    transition-all duration-200
    ${variants[variant]}
    ${isInteractive ? 'hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]' : ''}
    ${className}
  `;

  if (isButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={commonClasses}
        {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}
      >
        {icon && <span className="text-current">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={commonClasses}
      {...props as React.HTMLAttributes<HTMLDivElement>}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-current hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] rounded-full p-0.5"
        >
          ×
        </button>
      )}
    </div>
  );
}
