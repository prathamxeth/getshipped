import { z } from 'zod';

export const WordTimestampSchema = z.object({
  word: z.string().min(1),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  confidence: z.number().min(0).max(1).default(0.98),
  emphasis: z.boolean().default(false),
  punctuation: z.string().optional(),
  color: z.string().optional(),
});

export const KineticCaptionsSchema = z.object({
  words: z.array(WordTimestampSchema).min(1),
  fontSize: z.number().positive().default(52),
  maxWordsPerBatch: z.number().int().positive().default(5),
  highlightColor: z.string().default('#10B981'), // Emerald glow
  activeGlow: z.string().default('rgba(16, 185, 129, 0.4)'),
  accentColor: z.string().default('#06B6D4'), // Cyan
  fontFamily: z.string().default('Inter, system-ui, sans-serif'),
  audioTrackUrl: z.string().optional(),
});

export type WordTimestamp = z.infer<typeof WordTimestampSchema>;
export type KineticCaptions = z.infer<typeof KineticCaptionsSchema>;
