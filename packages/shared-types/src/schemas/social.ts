import { z } from 'zod';

export const XTweetSchema = z.object({
  id: z.string().min(1),
  tweetNumber: z.number().int().positive(),
  totalTweets: z.number().int().positive(),
  text: z.string().min(1).max(280),
  mediaPlaceholder: z.string().optional(),
  mediaType: z.enum(['video', 'image', 'code_diff', 'diagram', 'none']).default('none'),
  characterCount: z.number().int().nonnegative(),
});

export const LinkedInPostSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
  hashtags: z.array(z.string()).default([]),
  callToAction: z.string().min(1),
  estimatedReadTime: z.string().default('2 min'),
});

export const MermaidDiagramSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  code: z.string().min(1),
});

export const HashnodeMarkdownSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  slug: z.string().min(1),
  coverImageUrl: z.string().url(),
  tags: z.array(z.string()).min(1),
  content: z.string().min(1),
  mermaidDiagrams: z.array(MermaidDiagramSchema).default([]),
});

export const GitHubReadmeDiffSchema = z.object({
  filename: z.string().min(1),
  targetBranch: z.string().default('main'),
  commitMessage: z.string().min(1),
  beforeSnippet: z.string(),
  afterSnippet: z.string(),
  diffUnified: z.string().optional(),
});

export const CopywritingSchema = z.object({
  xThread: z.array(XTweetSchema).min(1),
  linkedInPost: LinkedInPostSchema,
  hashnodeMarkdown: HashnodeMarkdownSchema,
  gitHubReadmeDiff: GitHubReadmeDiffSchema,
});

export type XTweet = z.infer<typeof XTweetSchema>;
export type LinkedInPost = z.infer<typeof LinkedInPostSchema>;
export type MermaidDiagram = z.infer<typeof MermaidDiagramSchema>;
export type HashnodeMarkdown = z.infer<typeof HashnodeMarkdownSchema>;
export type GitHubReadmeDiff = z.infer<typeof GitHubReadmeDiffSchema>;
export type Copywriting = z.infer<typeof CopywritingSchema>;
