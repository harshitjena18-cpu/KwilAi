import React from 'react';

interface KwilAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  className?: string;
}

export function KwilAvatar({ 
  src, 
  alt,
  name,
  size = 'md',
  glow = false,
  className = ''
}: KwilAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-2xl'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={`
        ${sizes[size]}
        rounded-full 
        overflow-hidden 
        flex items-center justify-center
        border-2 border-[#00FF9C]/30
        ${glow ? 'shadow-[0_0_20px_rgba(0,255,156,0.4)]' : ''}
        ${className}
      `}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt || name || 'Avatar'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#00FF9C] to-[#10B981] flex items-center justify-center text-[#050B08]">
          {name ? getInitials(name) : '?'}
        </div>
      )}
    </div>
  );
}
