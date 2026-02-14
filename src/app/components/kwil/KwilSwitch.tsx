import React, { useState } from 'react';

interface KwilSwitchProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function KwilSwitch({ 
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  label,
  className = ''
}: KwilSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    const newValue = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300
          ${isChecked 
            ? 'bg-gradient-to-r from-[#00FF9C] to-[#10B981] shadow-[0_0_20px_rgba(0,255,156,0.4)]' 
            : 'bg-white/10 border border-white/20'
          }
        `}
      >
        <div 
          className={`
            absolute top-1 w-6 h-6 rounded-full bg-white
            transition-all duration-300 shadow-lg
            ${isChecked ? 'right-1' : 'left-1'}
          `}
        />
      </button>
      {label && (
        <span className="text-white text-sm">{label}</span>
      )}
    </div>
  );
}
