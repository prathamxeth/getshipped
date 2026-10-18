import React from 'react';

export interface CursorPointerProps {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  isClicking?: boolean;
  clickProgress?: number; // 0 to 1
  label?: string;
  color?: string;
}

export const CursorPointer: React.FC<CursorPointerProps> = ({
  x,
  y,
  isClicking = false,
  clickProgress = 0,
  label,
  color = '#10B981',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-2px, -2px)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.05s ease-out',
      }}
    >
      {/* Click Ripple Wave */}
      {isClicking && clickProgress > 0 && clickProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 2,
            top: 2,
            width: 44,
            height: 44,
            transform: `translate(-50%, -50%) scale(${1 + clickProgress * 1.8})`,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            backgroundColor: `${color}33`,
            opacity: Math.max(0, 1 - clickProgress),
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Modern High-Precision SVG Cursor */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6))',
          transform: isClicking ? 'scale(0.88)' : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      >
        <path
          d="M5.5 3.2L18.4 12.3C19.2 12.9 18.9 14.1 17.9 14.2L12.7 14.7L9.9 20.3C9.5 21.1 8.4 21.4 7.6 20.9L6.1 20.1C5.3 19.6 5.0 18.5 5.5 17.7L8.2 12.4L4.3 9.4C3.5 8.8 3.8 7.5 4.8 7.4L5.5 3.2Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Accent dot inside cursor */}
        <circle cx="9" cy="9" r="2" fill={color} />
      </svg>

      {/* Floating Action Tooltip / Tag */}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 14,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            color: '#F8FAFC',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            border: `1px solid ${color}66`,
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};
