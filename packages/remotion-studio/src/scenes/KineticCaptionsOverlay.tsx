import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { KineticCaptions, WordTimestamp } from '@getshipped/shared-types';

export interface KineticCaptionsOverlayProps {
  captionsData: KineticCaptions;
  aspectRatio?: '16:9' | '9:16';
  offsetMs?: number;
}

export const KineticCaptionsOverlay: React.FC<KineticCaptionsOverlayProps> = ({
  captionsData,
  aspectRatio = '16:9',
  offsetMs = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isVertical = aspectRatio === '9:16';

  // Current playback time in milliseconds
  const currentMs = (frame / fps) * 1000 + offsetMs;
  const words = captionsData.words || [];

  // Find currently active word index
  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (currentMs >= words[i].startMs && currentMs < words[i].endMs) {
      activeIndex = i;
      break;
    }
    // If between words, keep the most recent word highlighted
    if (i < words.length - 1 && currentMs >= words[i].endMs && currentMs < words[i + 1].startMs) {
      activeIndex = i;
      break;
    }
  }

  // If before first word or after last word
  if (activeIndex === -1 && words.length > 0) {
    if (currentMs < words[0].startMs) {
      activeIndex = 0;
    } else if (currentMs >= words[words.length - 1].endMs) {
      activeIndex = words.length - 1;
    }
  }

  // Group into sliding window batches of 4-6 words
  const batchSize = isVertical ? 4 : (captionsData.maxWordsPerBatch || 5);
  const currentBatchStart = Math.max(0, Math.floor(activeIndex / batchSize) * batchSize);
  const currentBatchWords = words.slice(currentBatchStart, currentBatchStart + batchSize);

  // If outside speech range by more than 2 seconds, fade out captions
  const firstWordMs = words[0]?.startMs ?? 0;
  const lastWordMs = words[words.length - 1]?.endMs ?? 0;
  const isSpeechActive = currentMs >= firstWordMs - 500 && currentMs <= lastWordMs + 1500;

  if (!isSpeechActive || currentBatchWords.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: isVertical ? 220 : 64, // Higher margin for 9:16 mobile UI safety
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isVertical ? '0 32px' : '0 80px',
        pointerEvents: 'none',
        zIndex: 500,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isVertical ? '8px 14px' : '10px 18px',
          padding: isVertical ? '14px 24px' : '18px 36px',
          borderRadius: 20,
          backgroundColor: 'rgba(9, 13, 22, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.2)',
          backdropFilter: 'blur(20px)',
          maxWidth: isVertical ? 860 : 1300,
        }}
      >
        {currentBatchWords.map((item, idx) => {
          const globalIdx = currentBatchStart + idx;
          const isCurrent = globalIdx === activeIndex;
          const isSpoken = globalIdx < activeIndex;

          // Frame offset for active word spring bounce
          const wordFrameOffset = Math.floor((item.startMs / 1000) * fps);
          const bounceSpring = spring({
            frame: Math.max(0, frame - wordFrameOffset),
            fps,
            config: { damping: 9, stiffness: 200, mass: 0.5 },
          });

          // Text size
          const baseSize = isVertical ? 42 : (captionsData.fontSize || 50);

          let color = '#64748B'; // upcoming: muted slate
          let transform = 'scale(1.0)';
          let textShadow = 'none';
          let fontWeight = 600;

          if (isCurrent) {
            color = item.color || captionsData.highlightColor || '#10B981';
            const scale = 1.0 + bounceSpring * 0.15;
            transform = `scale(${scale})`;
            textShadow = `0 0 25px ${captionsData.activeGlow || 'rgba(16, 185, 129, 0.6)'}`;
            fontWeight = 800;
          } else if (isSpoken) {
            color = '#F8FAFC'; // spoken: crisp white
            fontWeight = 700;
          }

          return (
            <span
              key={`${item.word}-${globalIdx}`}
              style={{
                fontFamily: captionsData.fontFamily || 'Inter, system-ui, sans-serif',
                fontSize: baseSize,
                fontWeight,
                color,
                transform,
                textShadow,
                letterSpacing: -0.5,
                display: 'inline-block',
                transition: 'color 0.1s ease, transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textTransform: item.emphasis ? 'uppercase' : 'none',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
