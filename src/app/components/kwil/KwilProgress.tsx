import React from 'react';

interface KwilProgressProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function KwilProgress({ 
  value, 
  label,
  showPercentage = true,
  className = ''
}: KwilProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
    >
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && <span className="text-white text-sm">{label}</span>}
          {showPercentage && <span className="text-[#A0A0A0] text-sm">{clampedValue}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#00FF9C] to-[#10B981] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,156,0.5)]"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
