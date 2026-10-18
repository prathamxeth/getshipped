import { z } from 'zod';

export const CodeDiffLineSchema = z.object({
  lineNumber: z.number().int().positive(),
  type: z.enum(['added', 'removed', 'context', 'modified']),
  content: z.string(),
  oldLineNumber: z.number().int().positive().optional(),
  newLineNumber: z.number().int().positive().optional(),
  highlight: z.boolean().default(false),
});

export const CodeDiffScenePropsSchema = z.object({
  title: z.string().min(1),
  filePath: z.string().min(1),
  fileLanguage: z.string().default('typescript'),
  branchName: z.string().default('main'),
  commitHash: z.string().default('a1b2c3d'),
  commitMessage: z.string().min(1),
  oldCode: z.string(),
  newCode: z.string(),
  lines: z.array(CodeDiffLineSchema).optional(),
  startFrame: z.number().int().nonnegative().default(0),
  durationInFrames: z.number().int().positive().default(600),
  focusLineRange: z.tuple([z.number(), z.number()]).optional(),
});

export type CodeDiffLine = z.infer<typeof CodeDiffLineSchema>;
export type CodeDiffSceneProps = z.infer<typeof CodeDiffScenePropsSchema>;
