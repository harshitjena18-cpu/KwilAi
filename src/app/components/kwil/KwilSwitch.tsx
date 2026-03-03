import React, { useState, useId } from 'react';

interface KwilSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'checked'> {
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
  className = '',
  id,
  ...props
}: KwilSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  const generatedId = useId();
  const switchId = id || generatedId;
  const labelId = `${switchId}-label`;

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
        role="switch"
        aria-checked={isChecked}
        aria-labelledby={label ? labelId : undefined}
        onClick={handleToggle}
        id={switchId}
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]
          ${isChecked 
            ? 'bg-gradient-to-r from-[#00FF9C] to-[#10B981] shadow-[0_0_20px_rgba(0,255,156,0.4)]' 
            : 'bg-white/10 border border-white/20'
          }
        `}
        {...props}
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
        <span
          id={labelId}
          onClick={handleToggle}
          className="text-white text-sm cursor-pointer"
        >
          {label}
        </span>
      )}
    </div>
  );
}
