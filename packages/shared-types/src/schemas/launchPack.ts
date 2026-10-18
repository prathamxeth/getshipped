import { z } from 'zod';
import { CodeDiffScenePropsSchema } from './codeDiff';
import { UICursorZoomScenePropsSchema } from './cursorKeyframe';
import { KineticCaptionsSchema } from './captions';
import { CopywritingSchema } from './social';

export const AspectRatioSchema = z.enum(['16:9', '9:16']);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const LaunchPackAuthorSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatarUrl: z.string().url(),
  githubHandle: z.string().min(1),
  twitterHandle: z.string().min(1),
});

export const VideoScenesConfigSchema = z.object({
  fps: z.literal(60).default(60),
  durationInFrames: z.number().int().positive().default(1800), // 30s @ 60fps
  aspectRatio: AspectRatioSchema.default('16:9'),
  audioTrackUrl: z.string().optional(),
  backgroundMusicUrl: z.string().optional(),
  scenes: z.object({
    codeDiff: CodeDiffScenePropsSchema,
    uiCursorZoom: UICursorZoomScenePropsSchema,
    captions: KineticCaptionsSchema,
  }),
});

export const LaunchPackPropsSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  createdAt: z.string(),
  projectName: z.string().min(1),
  tagline: z.string().min(1),
  repoUrl: z.string().url(),
  commitHash: z.string().min(6),
  commitMessage: z.string().min(1),
  author: LaunchPackAuthorSchema,
  video: VideoScenesConfigSchema,
  copywriting: CopywritingSchema,
  approvalStatus: z.enum(['draft', 'review_ready', 'approved', 'shipping', 'shipped']).default('review_ready'),
  ragVerificationScore: z.number().min(0).max(100).default(99.4),
  restateEndpoint: z.string().url().default('https://restate.getshipped.internal/v1/ship'),
});

export type LaunchPackAuthor = z.infer<typeof LaunchPackAuthorSchema>;
export type VideoScenesConfig = z.infer<typeof VideoScenesConfigSchema>;
export type LaunchPackProps = z.infer<typeof LaunchPackPropsSchema>;
