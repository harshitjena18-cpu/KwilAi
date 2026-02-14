import React from 'react';

interface KwilInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function KwilInput({ 
  label, 
  error, 
  icon,
  className = '',
  ...props 
}: KwilInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[#FFFFFF] text-sm mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FF9C]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 ${icon ? 'pl-12' : ''}
            bg-white/5 backdrop-blur-md
            border border-[#00FF9C]/20
            rounded-2xl
            text-[#FFFFFF] placeholder:text-[#A0A0A0]
            transition-all duration-300
            focus:outline-none 
            focus:border-[#00FF9C]/50
            focus:shadow-[0_0_20px_rgba(0,255,156,0.2)]
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
