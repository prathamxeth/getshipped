import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CodeDiffSceneProps } from '@getshipped/shared-types';
import { MacWindowFrame } from '../components/MacWindowFrame';
import { tokenizeLine } from '../utils/syntaxHighlight';

export interface CodeDiffSceneComponentProps {
  sceneData: CodeDiffSceneProps;
  aspectRatio?: '16:9' | '9:16';
}

export const CodeDiffScene: React.FC<CodeDiffSceneComponentProps> = ({
  sceneData,
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isVertical = aspectRatio === '9:16';

  // Overall window entry spring
  const windowSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Code morphing phase kicks in at frame 60
  const morphProgress = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 18, stiffness: 90, mass: 1 },
  });

  // Smooth subtle camera drift
  const cameraZoom = interpolate(frame, [0, 600], [1.0, 1.04], {
    extrapolateRight: 'clamp',
  });
  const cameraPanY = interpolate(frame, [0, 600], [0, -18], {
    extrapolateRight: 'clamp',
  });

  const lines = sceneData.lines || [];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isVertical ? '32px 24px' : '64px 80px',
        position: 'relative',
        transform: `scale(${cameraZoom}) translateY(${cameraPanY}px)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 700,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Animated macOS Window */}
      <div
        style={{
          width: '100%',
          maxWidth: isVertical ? '100%' : 1440,
          height: isVertical ? '88%' : 780,
          opacity: windowSpring,
          transform: `translateY(${(1 - windowSpring) * 40}px)`,
        }}
      >
        <MacWindowFrame
          title={sceneData.title}
          filePath={sceneData.filePath}
          branchName={sceneData.branchName}
          commitHash={sceneData.commitHash}
          aspectRatio={aspectRatio}
        >
          {/* Commit Message Header Bar */}
          <div
            style={{
              padding: isVertical ? '10px 16px' : '12px 24px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: isVertical ? 12 : 13, color: '#94A3B8' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>Commit:</span>
              <span style={{ color: '#F1F5F9', fontWeight: 500 }}>{sceneData.commitMessage}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#64748B',
              }}
            >
              <span style={{ color: '#EF4444' }}>-5 lines</span>
              <span>/</span>
              <span style={{ color: '#10B981' }}>+12 lines</span>
            </div>
          </div>

          {/* Code Diff Lines Container */}
          <div
            style={{
              flex: 1,
              padding: isVertical ? '16px 12px' : '24px 28px',
              overflow: 'hidden',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: isVertical ? 12 : 15,
              lineHeight: isVertical ? 1.6 : 1.75,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#090D16',
            }}
          >
            {lines.map((line, idx) => {
              const tokens = tokenizeLine(line.content);

              // Line morphing states
              const isAdded = line.type === 'added';
              const isRemoved = line.type === 'removed';
              const isContext = line.type === 'context';

              // Individual line stagger spring
              const lineDelay = 50 + idx * 4;
              const lineSpring = spring({
                frame: Math.max(0, frame - lineDelay),
                fps,
                config: { damping: 14, stiffness: 140, mass: 0.6 },
              });

              // Removed lines fade & collapse as morph progresses
              if (isRemoved && morphProgress > 0.8) {
                // Dim down removed lines to clear focus on new code
              }

              let lineBg = 'transparent';
              let indicatorColor = '#475569';
              let indicatorSign = ' ';
              let opacity = 1;
              let transformX = 0;

              if (isAdded) {
                indicatorSign = '+';
                indicatorColor = '#10B981';
                lineBg = line.highlight
                  ? 'rgba(16, 185, 129, 0.16)'
                  : 'rgba(16, 185, 129, 0.07)';
                opacity = lineSpring;
                transformX = (1 - lineSpring) * 20;
              } else if (isRemoved) {
                indicatorSign = '-';
                indicatorColor = '#EF4444';
                lineBg = 'rgba(239, 68, 68, 0.08)';
                opacity = Math.max(0.2, 1 - morphProgress * 0.75);
                transformX = -morphProgress * 8;
              }

              return (
                <div
                  key={`${line.lineNumber}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: lineBg,
                    opacity,
                    transform: `translateX(${transformX}px)`,
                    borderLeft: isAdded
                      ? '3px solid #10B981'
                      : isRemoved
                      ? '3px solid #EF4444'
                      : '3px solid transparent',
                    boxShadow: isAdded && line.highlight
                      ? '0 0 20px rgba(16, 185, 129, 0.12)'
                      : 'none',
                    margin: '1px 0',
                  }}
                >
                  {/* Line Number Gutter */}
                  <div
                    style={{
                      width: isVertical ? 28 : 42,
                      textAlign: 'right',
                      paddingRight: 12,
                      color: isAdded ? '#10B981' : isRemoved ? '#EF4444' : '#475569',
                      userSelect: 'none',
                      fontSize: isVertical ? 11 : 13,
                    }}
                  >
                    {isAdded ? line.newLineNumber : isRemoved ? line.oldLineNumber : line.lineNumber}
                  </div>

                  {/* Diff Sign Indicator */}
                  <div
                    style={{
                      width: 18,
                      textAlign: 'center',
                      color: indicatorColor,
                      fontWeight: 700,
                      userSelect: 'none',
                      fontSize: isVertical ? 12 : 14,
                    }}
                  >
                    {indicatorSign}
                  </div>

                  {/* Tokenized Syntax Highlighting Code Content */}
                  <div
                    style={{
                      flex: 1,
                      whiteSpace: 'pre',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingLeft: 6,
                    }}
                  >
                    {tokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          color: isRemoved ? '#EF4444' : token.color,
                          fontStyle: (token.fontStyle as React.CSSProperties['fontStyle']) || 'normal',
                          textDecoration: isRemoved && morphProgress > 0.5 ? 'line-through' : 'none',
                          fontWeight: isAdded && line.highlight ? 600 : 400,
                        }}
                      >
                        {token.content}
                      </span>
                    ))}
                  </div>

                  {/* Highlighting Tag for Key Innovations */}
                  {isAdded && line.highlight && idx === 3 && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        backgroundColor: '#10B981',
                        color: '#090D16',
                        marginLeft: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        opacity: lineSpring,
                      }}
                    >
                      FAST-PATH PREDICTOR
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </MacWindowFrame>
      </div>
    </div>
  );
};
