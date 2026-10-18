import { z } from 'zod';

export const RestateChannelStatusSchema = z.object({
  channel: z.enum(['remotion_render', 'x_thread', 'linkedin', 'hashnode', 'github_pr']),
  status: z.enum(['idle', 'queued', 'processing', 'completed', 'failed', 'rolled_back']),
  progress: z.number().min(0).max(100),
  externalUrl: z.string().optional(),
  message: z.string().optional(),
  executionId: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

export const RestateDispatchPayloadSchema = z.object({
  launchPackId: z.string().min(1),
  version: z.string(),
  approvedBy: z.string().min(1),
  channels: z.array(z.enum(['x_thread', 'linkedin', 'hashnode', 'github_pr', 'remotion_render'])).min(1),
  videoConfig: z.object({
    aspectRatio: z.enum(['16:9', '9:16']),
    fps: z.literal(60),
    codec: z.enum(['h264', 'prores']),
  }),
  editedCopy: z.object({
    xThread: z.array(z.object({
      tweetNumber: z.number(),
      text: z.string(),
    })),
    linkedInPost: z.object({
      headline: z.string(),
      body: z.string(),
    }),
    hashnodeMarkdown: z.object({
      title: z.string(),
      content: z.string(),
    }),
    gitHubReadmeDiff: z.object({
      commitMessage: z.string(),
      afterSnippet: z.string(),
    }),
  }),
});

export const RestateDispatchResponseSchema = z.object({
  workflowId: z.string().min(1),
  restateInvocationId: z.string().min(1),
  status: z.enum(['accepted', 'running', 'completed', 'failed']),
  channels: z.array(RestateChannelStatusSchema),
  logs: z.array(z.object({
    timestamp: z.string(),
    level: z.enum(['info', 'warn', 'error', 'success']),
    message: z.string(),
    channel: z.string().optional(),
  })),
  createdAt: z.string(),
});

export type RestateChannelStatus = z.infer<typeof RestateChannelStatusSchema>;
export type RestateDispatchPayload = z.infer<typeof RestateDispatchPayloadSchema>;
export type RestateDispatchResponse = z.infer<typeof RestateDispatchResponseSchema>;
