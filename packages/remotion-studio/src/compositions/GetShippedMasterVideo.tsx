import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { LaunchPackProps } from '@getshipped/shared-types';
import { mockLaunchPack } from '../data';
import { CodeDiffScene } from '../scenes/CodeDiffScene';
import { UICursorZoomScene } from '../scenes/UICursorZoomScene';
import { KineticCaptionsOverlay } from '../scenes/KineticCaptionsOverlay';
import { AudioWaveformVisualizer } from '../components/AudioWaveformVisualizer';

export interface GetShippedMasterVideoProps {
  launchPack?: LaunchPackProps;
  aspectRatio?: '16:9' | '9:16';
}

export const GetShippedMasterVideo: React.FC<GetShippedMasterVideoProps> = ({
  launchPack = mockLaunchPack,
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16';

  const scenes = launchPack.video.scenes;
  const audioTrackUrl = launchPack.video.audioTrackUrl;
  const backgroundMusicUrl = launchPack.video.backgroundMusicUrl;

  const resolveAudioSrc = (src?: string) => {
    if (!src) return null;
    if (src.includes('cdn.getshipped.ai')) {
      try {
        return staticFile('audio/synthwave-ambient.wav');
      } catch {
        return null;
      }
    }
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    try {
      return staticFile(src.replace(/^\//, ''));
    } catch {
      return null;
    }
  };

  const resolvedAudioTrack = resolveAudioSrc(audioTrackUrl);
  const resolvedMusicTrack = resolveAudioSrc(backgroundMusicUrl);

  // Scene timing definitions (at 60fps)
  // Scene 1 (CodeDiff): 0 - 600 frames (10 seconds)
  // Scene 2 (UICursorZoom): 600 - 1200 frames (10 seconds)
  // Scene 3 (Outro / Summary): 1200 - 1800 frames (10 seconds)
  const SCENE_1_DURATION = 600;
  const SCENE_2_DURATION = 600;
  const SCENE_3_DURATION = 600;

  // Crossfade transitions between scenes
  const scene1Opacity = interpolate(frame, [570, 600], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scene2Opacity = interpolate(
    frame,
    [585, 615, 1170, 1200],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scene3Opacity = interpolate(frame, [1185, 1215], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro spring animation
  const outroSpring = spring({
    frame: Math.max(0, frame - 1200),
    fps,
    config: { damping: 15, stiffness: 110, mass: 0.9 },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#05070D',
        position: 'relative',
        overflow: 'hidden',
        color: '#F8FAFC',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background Animated Gradient Mesh & Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Cyberpunk Blueprint Subtitle Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Persistent Brand Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 32 : 28,
          left: isVertical ? 24 : 40,
          right: isVertical ? 24 : 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 600,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
            }}
          >
            <span>⚡ GETSHIPPED AUTONOMOUS LAUNCH</span>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              fontSize: 11,
              color: '#94A3B8',
              fontFamily: 'monospace',
            }}
          >
            60 FPS | {launchPack.projectName}
          </div>
        </div>

        {/* Real-time Audio Waveform Visualizer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 14px',
            borderRadius: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>AUDIO TRACK</span>
          <AudioWaveformVisualizer currentFrame={frame} barsCount={isVertical ? 16 : 24} />
        </div>
      </div>

      {/* SCENE 1: Animated macOS Code Diff Scene (0 - 10s) */}
      <Sequence from={0} durationInFrames={SCENE_1_DURATION}>
        <div style={{ width: '100%', height: '100%', opacity: scene1Opacity }}>
          <CodeDiffScene
            sceneData={scenes.codeDiff}
            aspectRatio={aspectRatio}
          />
        </div>
      </Sequence>

      {/* SCENE 2: UI Cursor Zoom 3D Scene (10 - 20s) */}
      <Sequence from={SCENE_1_DURATION} durationInFrames={SCENE_2_DURATION}>
        <div style={{ width: '100%', height: '100%', opacity: scene2Opacity }}>
          <UICursorZoomScene
            sceneData={scenes.uiCursorZoom}
            aspectRatio={aspectRatio}
          />
        </div>
      </Sequence>

      {/* SCENE 3: Launch Summary & Omnichannel Outro (20 - 30s) */}
      <Sequence from={SCENE_1_DURATION + SCENE_2_DURATION} durationInFrames={SCENE_3_DURATION}>
        <div
          style={{
            width: '100%',
            height: '100%',
            opacity: scene3Opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isVertical ? '40px 24px' : '64px 80px',
            transform: `scale(${0.92 + outroSpring * 0.08})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              padding: isVertical ? '28px 20px' : '48px 56px',
              borderRadius: 24,
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8), 0 0 60px rgba(16, 185, 129, 0.25)',
              backdropFilter: 'blur(30px)',
              maxWidth: isVertical ? 960 : 1200,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isVertical ? 16 : 24,
            }}
          >
            {/* Glow badge */}
            <div
              style={{
                padding: '6px 18px',
                borderRadius: 9999,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: 1,
              }}
            >
              LAUNCH COMPLETE • SHIPPED EVERYWHERE
            </div>

            <h1
              style={{
                fontSize: isVertical ? 42 : 56,
                fontWeight: 900,
                letterSpacing: -1.5,
                background: 'linear-gradient(135deg, #FFFFFF 30%, #38BDF8 70%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              {launchPack.projectName}
            </h1>

            <p
              style={{
                fontSize: isVertical ? 18 : 22,
                color: '#94A3B8',
                maxWidth: 800,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {launchPack.tagline}
            </p>

            {/* Metric highlight pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isVertical ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 16,
                width: '100%',
                marginTop: 12,
              }}
            >
              {[
                { label: 'Latency Drop', val: '-84%', color: '#10B981' },
                { label: 'Time To First Token', val: '14.2ms', color: '#38BDF8' },
                { label: 'Peak Throughput', val: '48.2k QPS', color: '#A855F7' },
                { label: 'License', val: 'MIT Open Source', color: '#F59E0B' },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: '16px 14px',
                    borderRadius: 14,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: m.color, marginTop: 4 }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Repos & CTA Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginTop: 16,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  padding: '12px 28px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                  color: '#090D16',
                  fontWeight: 800,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
                }}
              >
                <span>⭐ Star on GitHub</span>
                <span style={{ opacity: 0.7 }}>|</span>
                <span style={{ fontFamily: 'monospace' }}>github.com/getshipped/hyperscale-rag</span>
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* CONTINUOUS KINETIC CAPTIONS OVERLAY (Synchronized across full 30s) */}
      <KineticCaptionsOverlay
        captionsData={scenes.captions}
        aspectRatio={aspectRatio}
      />

      {/* Audio narration track (if audio file provided) */}
      {resolvedAudioTrack && <Audio src={resolvedAudioTrack} volume={1.0} />}
      {resolvedMusicTrack && <Audio src={resolvedMusicTrack} volume={0.18} />}
    </div>
  );
};
