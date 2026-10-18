import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, Video } from 'remotion';
import { UICursorZoomSceneProps } from '@getshipped/shared-types';
import { interpolateCameraKeyframes } from '../utils/springPhysics';
import { CursorPointer } from '../components/CursorPointer';
import { SimulatedAppUI } from '../components/SimulatedAppUI';

export interface UICursorZoomSceneComponentProps {
  sceneData: UICursorZoomSceneProps;
  aspectRatio?: '16:9' | '9:16';
}

export const UICursorZoomScene: React.FC<UICursorZoomSceneComponentProps> = ({
  sceneData,
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps, width: compositionWidth, height: compositionHeight } = useVideoConfig();
  const isVertical = aspectRatio === '9:16';

  // Smooth entry transition
  const sceneEntry = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Calculate current interpolated camera parameters from cursor keyframes
  const camera = interpolateCameraKeyframes(frame, sceneData.cursorKeyframes);

  // Compute camera pan offset based on cursor coordinate so the camera centers on the action
  // When zoomScale is 1.0, pan is 0. When zoomScale increases, pan moves toward the cursor.
  const zoomFactor = Math.max(1, camera.zoomScale);
  const panOffsetFactor = (zoomFactor - 1) / zoomFactor;
  const panX = (camera.x - 50) * panOffsetFactor * (isVertical ? 0.8 : 1.0);
  const panY = (camera.y - 50) * panOffsetFactor * (isVertical ? 0.8 : 1.0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060911',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1200,
        opacity: sceneEntry,
      }}
    >
      {/* 3D Camera Gimbal Wrapper */}
      <div
        style={{
          width: 1920,
          height: 1080,
          position: 'absolute',
          transformOrigin: `${camera.x}% ${camera.y}%`,
          transform: `
            perspective(1200px)
            scale(${zoomFactor})
            rotateX(${camera.rotateX}deg)
            rotateY(${camera.rotateY}deg)
            translate(${-panX}%, ${-panY}%)
          `,
          transition: 'transform 0.05s linear',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Render either recorded video or high-fidelity simulated UI */}
        {sceneData.screenRecordingUrl ? (
          <Video
            src={sceneData.screenRecordingUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <SimulatedAppUI
            currentFrame={frame}
            activeElement={camera.activeElement}
            metrics={sceneData.mockMetrics}
          />
        )}

        {/* Dynamic Cursor Pointer pinned to coordinates on the simulated canvas */}
        <CursorPointer
          x={camera.x}
          y={camera.y}
          isClicking={camera.isClicking}
          clickProgress={camera.clickProgress}
          label={camera.annotationText}
          color="#10B981"
        />
      </div>

      {/* Floating HUD Telemetry Overlay (stays fixed relative to screen) */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 40 : 32,
          left: isVertical ? 24 : 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px',
          borderRadius: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{sceneData.title}</span>
        <span style={{ fontSize: 12, color: '#64748B' }}>|</span>
        <span style={{ fontSize: 12, color: '#38BDF8', fontFamily: 'monospace' }}>
          Zoom: {zoomFactor.toFixed(1)}x
        </span>
        <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>
          3D Tilt: ({camera.rotateX.toFixed(0)}°, {camera.rotateY.toFixed(0)}°)
        </span>
      </div>

      {/* Camera Target Action Callout at Bottom Right */}
      {camera.annotationText && (
        <div
          style={{
            position: 'absolute',
            bottom: isVertical ? 160 : 48,
            right: isVertical ? 24 : 40,
            padding: '10px 18px',
            borderRadius: 12,
            backgroundColor: 'rgba(9, 13, 22, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 100,
          }}
        >
          <span style={{ fontSize: 14 }}>🎯</span>
          <div>
            <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Action Focus
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#10B981' }}>
              {camera.annotationText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
