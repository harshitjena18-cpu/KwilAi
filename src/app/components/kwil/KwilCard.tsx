import React from 'react';

interface KwilCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function KwilCard({ 
  children, 
  className = '', 
  glow = false,
  hover = false,
  onClick 
}: KwilCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        bg-white/5 backdrop-blur-md
        border border-[#00FF9C]/20
        rounded-3xl
        p-6
        transition-all duration-300
        ${glow ? 'shadow-[0_0_30px_rgba(0,255,156,0.15)]' : ''}
        ${hover ? 'hover:border-[#00FF9C]/40 hover:shadow-[0_0_40px_rgba(0,255,156,0.25)] hover:scale-[1.02] cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
