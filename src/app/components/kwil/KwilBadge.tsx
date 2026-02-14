import React from 'react';

interface KwilBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function KwilBadge({ 
  children, 
  variant = 'primary',
  size = 'md',
  dot = false,
  className = ''
}: KwilBadgeProps) {
  const variants = {
    primary: 'bg-[#00FF9C]/20 text-[#00FF9C] border-[#00FF9C]/40',
    secondary: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
    success: 'bg-green-500/20 text-green-400 border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    danger: 'bg-red-500/20 text-red-400 border-red-500/40',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const dotColors = {
    primary: 'bg-[#00FF9C]',
    secondary: 'bg-[#10B981]',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
