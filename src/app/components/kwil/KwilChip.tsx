import React from 'react';

interface KwilChipProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export function KwilChip({ 
  children, 
  variant = 'primary',
  icon,
  onRemove,
  onClick,
  className = '',
  selected
}: KwilChipProps) {
  const variants = {
    primary: 'bg-[#00FF9C]/20 text-[#00FF9C] border-[#00FF9C]/40',
    secondary: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
    outline: 'bg-transparent text-[#FFFFFF] border-white/30'
  };

  const isInteractive = !!onClick;
  // If we have a remove button, we can't be a <button> ourselves (nested interactive controls).
  // So we use a div with role="button" in that case.
  // Otherwise, if interactive, use a real <button>.
  const Component = (isInteractive && !onRemove) ? 'button' : 'div';

  const commonProps = {
    className: `
      inline-flex items-center gap-2
      px-4 py-2
      rounded-full
      border
      text-sm
      transition-all duration-200
      ${variants[variant]}
      ${isInteractive ? 'hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]' : ''}
      ${className}
    `,
    onClick: onClick
  };

  const a11yProps = isInteractive ? {
    role: onRemove ? 'button' : undefined,
    tabIndex: onRemove ? 0 : undefined,
    'aria-pressed': selected,
    onKeyDown: onRemove ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    } : undefined
  } : {};

  // If it is a button, type="button" to prevent form submission
  const buttonProps = (Component === 'button') ? { type: 'button' as const } : {};

  return (
    <Component
      {...commonProps}
      {...a11yProps}
      {...buttonProps}
    >
      {icon && <span className="text-current" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-current hover:opacity-70 focus:outline-none focus:bg-white/20 rounded-full p-0.5"
          aria-label={`Remove ${typeof children === 'string' ? children : 'item'}`}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </Component>
  );
}
