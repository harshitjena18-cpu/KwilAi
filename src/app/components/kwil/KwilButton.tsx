import React from 'react';
import { Loader2 } from 'lucide-react';

interface KwilButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function KwilButton({ 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children, 
  className = '',
  disabled,
  ...props 
}: KwilButtonProps) {
  const baseStyles = "relative rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: `bg-gradient-to-r from-[#00FF9C] to-[#10B981] text-[#050B08] 
               shadow-[0_0_20px_rgba(0,255,156,0.4)] 
               hover:shadow-[0_0_30px_rgba(0,255,156,0.6)] 
               hover:scale-[1.02]`,
    secondary: `bg-[#0A1410] text-[#00FF9C] 
                border border-[#00FF9C]/30 
                shadow-[0_0_15px_rgba(0,255,156,0.2)] 
                hover:border-[#00FF9C]/50 
                hover:shadow-[0_0_25px_rgba(0,255,156,0.3)]`,
    outline: `bg-transparent text-[#00FF9C] 
              border border-[#00FF9C]/50 
              hover:bg-[#00FF9C]/10 
              hover:border-[#00FF9C]`,
    ghost: `bg-transparent text-[#FFFFFF] 
            hover:bg-white/5`
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}
