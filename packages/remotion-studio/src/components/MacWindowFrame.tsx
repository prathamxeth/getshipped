import React from 'react';

export interface MacWindowFrameProps {
  title: string;
  filePath?: string;
  branchName?: string;
  commitHash?: string;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  aspectRatio?: '16:9' | '9:16';
  style?: React.CSSProperties;
}

export const MacWindowFrame: React.FC<MacWindowFrameProps> = ({
  title,
  filePath,
  branchName = 'main',
  commitHash,
  children,
  width = '100%',
  height = '100%',
  aspectRatio = '16:9',
  style,
}) => {
  const isVertical = aspectRatio === '9:16';

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(11, 15, 25, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.1)',
        backdropFilter: 'blur(24px)',
        position: 'relative',
        ...style,
      }}
    >
      {/* macOS Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isVertical ? '14px 18px' : '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(17, 24, 39, 0.75)',
          userSelect: 'none',
        }}
      >
        {/* Traffic Light Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FF5F56',
              boxShadow: '0 0 6px rgba(255, 95, 86, 0.5)',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FFBD2E',
              boxShadow: '0 0 6px rgba(255, 189, 46, 0.5)',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#27C93F',
              boxShadow: '0 0 6px rgba(39, 201, 63, 0.5)',
            }}
          />
        </div>

        {/* Center Title / File Path */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: isVertical ? 14 : 15,
            fontWeight: 500,
            color: '#E2E8F0',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            maxWidth: isVertical ? '60%' : '70%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#06B6D4' }}>✦</span>
          <span>{filePath || title}</span>
        </div>

        {/* Right Badges: Git Branch & Commit Hash */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {branchName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              <span>⎇</span>
              <span>{branchName}</span>
            </div>
          )}
          {commitHash && (
            <div
              style={{
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 11,
                color: '#94A3B8',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              #{commitHash.slice(0, 7)}
            </div>
          )}
        </div>
      </div>

      {/* Window Body Container */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
