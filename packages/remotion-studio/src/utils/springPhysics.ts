import { spring, interpolate } from 'remotion';

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  overshootClamping?: boolean;
}

export const SPRING_PRESETS = {
  snappy: { damping: 14, stiffness: 180, mass: 0.6 },
  smooth: { damping: 20, stiffness: 100, mass: 1 },
  bouncy: { damping: 8, stiffness: 140, mass: 0.8 },
  gentle: { damping: 24, stiffness: 60, mass: 1.2 },
} as const;

/**
 * Calculates a normalized 0-1 spring progress value from a given frame offset.
 */
export function getSpringProgress(
  frame: number,
  fps: number = 60,
  config: SpringConfig = SPRING_PRESETS.snappy,
  delay: number = 0
): number {
  if (frame < delay) return 0;
  return spring({
    frame: frame - delay,
    fps,
    config,
  });
}

/**
 * Interpolates smoothly between cursor keyframes for 3D camera pan, zoom, and tilt.
 */
export interface CameraTransform {
  x: number;
  y: number;
  zoomScale: number;
  rotateX: number;
  rotateY: number;
  activeElement?: string;
  annotationText?: string;
  isClicking: boolean;
  clickProgress: number;
}

export interface KeyframePoint {
  frame: number;
  x: number;
  y: number;
  zoomScale: number;
  rotateX: number;
  rotateY: number;
  click?: boolean;
  activeElement?: string;
  annotationText?: string;
}

export function interpolateCameraKeyframes(
  currentFrame: number,
  keyframes: KeyframePoint[]
): CameraTransform {
  if (!keyframes || keyframes.length === 0) {
    return {
      x: 50,
      y: 50,
      zoomScale: 1.0,
      rotateX: 0,
      rotateY: 0,
      isClicking: false,
      clickProgress: 0,
    };
  }

  // Before first keyframe
  if (currentFrame <= keyframes[0].frame) {
    const k = keyframes[0];
    return {
      x: k.x,
      y: k.y,
      zoomScale: k.zoomScale,
      rotateX: k.rotateX,
      rotateY: k.rotateY,
      activeElement: k.activeElement,
      annotationText: k.annotationText,
      isClicking: false,
      clickProgress: 0,
    };
  }

  // After last keyframe
  const lastKeyframe = keyframes[keyframes.length - 1];
  if (currentFrame >= lastKeyframe.frame) {
    return {
      x: lastKeyframe.x,
      y: lastKeyframe.y,
      zoomScale: lastKeyframe.zoomScale,
      rotateX: lastKeyframe.rotateX,
      rotateY: lastKeyframe.rotateY,
      activeElement: lastKeyframe.activeElement,
      annotationText: lastKeyframe.annotationText,
      isClicking: false,
      clickProgress: 0,
    };
  }

  // Find surrounding keyframe segments
  let prevIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (currentFrame >= keyframes[i].frame && currentFrame < keyframes[i + 1].frame) {
      prevIdx = i;
      break;
    }
  }

  const k1 = keyframes[prevIdx];
  const k2 = keyframes[prevIdx + 1];
  const frameSpan = k2.frame - k1.frame;
  const localOffset = currentFrame - k1.frame;
  const rawProgress = frameSpan > 0 ? localOffset / frameSpan : 1;

  // Smooth ease-in-out cubic progression
  const t = rawProgress < 0.5 ? 4 * rawProgress * rawProgress * rawProgress : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

  const x = interpolate(t, [0, 1], [k1.x, k2.x]);
  const y = interpolate(t, [0, 1], [k1.y, k2.y]);
  const zoomScale = interpolate(t, [0, 1], [k1.zoomScale, k2.zoomScale]);
  const rotateX = interpolate(t, [0, 1], [k1.rotateX, k2.rotateX]);
  const rotateY = interpolate(t, [0, 1], [k1.rotateY, k2.rotateY]);

  // Click detection: if currentFrame is near a click keyframe (within 18 frames)
  let isClicking = false;
  let clickProgress = 0;
  for (const kf of keyframes) {
    if (kf.click && currentFrame >= kf.frame && currentFrame < kf.frame + 24) {
      isClicking = true;
      clickProgress = (currentFrame - kf.frame) / 24;
      break;
    }
  }

  return {
    x,
    y,
    zoomScale,
    rotateX,
    rotateY,
    activeElement: t > 0.5 ? k2.activeElement : k1.activeElement,
    annotationText: t > 0.5 ? k2.annotationText : k1.annotationText,
    isClicking,
    clickProgress,
  };
}
