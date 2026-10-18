import React from 'react';

export interface AudioWaveformVisualizerProps {
  currentFrame: number;
  barsCount?: number;
  color?: string;
  secondaryColor?: string;
  style?: React.CSSProperties;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  currentFrame,
  barsCount = 28,
  color = '#10B981',
  secondaryColor = '#06B6D4',
  style,
}) => {
  const bars = Array.from({ length: barsCount }, (_, index) => {
    // Generate organic undulating wave dynamics using harmonized sinusoids
    const speed = 0.12;
    const offset = index * 0.35;
    const wave1 = Math.sin(currentFrame * speed + offset);
    const wave2 = Math.cos(currentFrame * (speed * 0.7) - offset * 0.5);
    const wave3 = Math.sin((currentFrame + index) * 0.05);

    // Normalized height between 15% and 95%
    const combined = (wave1 + wave2 + wave3) / 3;
    const heightPercent = Math.max(12, Math.min(95, Math.floor(40 + combined * 45)));

    return {
      id: index,
      heightPercent,
      isHighlighted: index % 4 === 0,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        height: 28,
        padding: '0 8px',
        ...style,
      }}
    >
      {bars.map((bar) => (
        <div
          key={bar.id}
          style={{
            width: 3,
            height: `${bar.heightPercent}%`,
            borderRadius: 9999,
            backgroundColor: bar.isHighlighted ? color : secondaryColor,
            opacity: 0.85,
            transition: 'height 0.05s ease-out',
            boxShadow: bar.isHighlighted ? `0 0 8px ${color}88` : 'none',
          }}
        />
      ))}
    </div>
  );
};
