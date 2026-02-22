import React, { useId } from 'react';

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
  id,
  ...props 
}: KwilInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[#FFFFFF] text-sm mb-2">
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
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
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
            focus-visible:ring-2 focus-visible:ring-[#00FF9C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
