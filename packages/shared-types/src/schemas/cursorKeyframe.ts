import { z } from 'zod';

export const CursorKeyframeSchema = z.object({
  frame: z.number().int().nonnegative(),
  x: z.number().min(0).max(100), // Percentage relative to viewport (0 to 100%)
  y: z.number().min(0).max(100), // Percentage relative to viewport (0 to 100%)
  zoomScale: z.number().min(1.0).max(3.5).default(1.0),
  rotateX: z.number().min(-30).max(30).default(0), // 3D tilt in degrees
  rotateY: z.number().min(-30).max(30).default(0), // 3D tilt in degrees
  click: z.boolean().default(false),
  activeElement: z.string().optional(),
  annotationText: z.string().optional(),
});

export const UICursorZoomScenePropsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  screenRecordingUrl: z.string().optional(),
  cursorKeyframes: z.array(CursorKeyframeSchema).min(1),
  startFrame: z.number().int().nonnegative().default(600),
  durationInFrames: z.number().int().positive().default(600),
  mockMetrics: z.object({
    latencyMs: z.number(),
    qps: z.number(),
    cacheHitRate: z.number(),
    accuracyScore: z.number(),
  }).optional(),
  activeTab: z.string().default('RAG Pipeline Visualizer'),
});

export type CursorKeyframe = z.infer<typeof CursorKeyframeSchema>;
export type UICursorZoomSceneProps = z.infer<typeof UICursorZoomScenePropsSchema>;
