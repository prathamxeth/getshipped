'use client';

import React, { useState } from 'react';
import { Plus, X, Clock, Briefcase, Share2, Check } from 'lucide-react';
import { LinkedInPost } from '@getshipped/shared-types';

export interface LinkedInEditorProps {
  post: LinkedInPost;
  onChange: (updatedPost: LinkedInPost) => void;
}

export const LinkedInEditor: React.FC<LinkedInEditorProps> = ({ post, onChange }) => {
  const [newTagInput, setNewTagInput] = useState('');

  const handleHeadlineChange = (headline: string) => {
    onChange({ ...post, headline });
  };

  const handleBodyChange = (body: string) => {
    onChange({ ...post, body });
  };

  const handleCtaChange = (callToAction: string) => {
    onChange({ ...post, callToAction });
  };

  const handleAddHashtag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    if (!post.hashtags.includes(cleanTag)) {
      onChange({
        ...post,
        hashtags: [...post.hashtags, cleanTag],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveHashtag = (tag: string) => {
    onChange({
      ...post,
      hashtags: post.hashtags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>LinkedIn Founder & Engineering Post</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Professional Launch
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Long-form thought leadership narrative focused on architectural trade-offs and team impact.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{post.estimatedReadTime} read</span>
        </div>
      </div>

      {/* Headline Input Card */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Post Headline / Hook
        </label>
        <input
          type="text"
          value={post.headline}
          onChange={(e) => handleHeadlineChange(e.target.value)}
          className="w-full bg-slate-900/80 rounded-xl p-3.5 text-sm font-semibold text-white border border-white/10 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          placeholder="e.g. 🚀 Rethinking RAG: Why we eliminated sequential vector search..."
        />
      </div>

      {/* Main Post Body */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Post Body Content
          </label>
          <span className="text-xs text-slate-400 font-mono">
            {post.body.length} characters • {post.body.split(/\s+/).length} words
          </span>
        </div>
        <textarea
          value={post.body}
          onChange={(e) => handleBodyChange(e.target.value)}
          rows={12}
          className="w-full bg-slate-900/80 rounded-xl p-4 text-sm text-slate-200 border border-white/10 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30 leading-relaxed font-sans resize-y"
          placeholder="Detailed breakdown of your release..."
        />
      </div>

      {/* Call to Action Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Call to Action (CTA) Link & Note
        </label>
        <input
          type="text"
          value={post.callToAction}
          onChange={(e) => handleCtaChange(e.target.value)}
          className="w-full bg-slate-900/80 rounded-xl p-3 text-sm text-slate-200 border border-white/10 focus:border-blue-500/60 focus:outline-none font-mono text-xs"
          placeholder="e.g. Explore the code on GitHub: https://github.com/..."
        />
      </div>

      {/* Hashtags Section */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Discovery Hashtags
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveHashtag(tag)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Add Hashtag Form */}
          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
              placeholder="#AddHashtag"
              className="w-28 bg-slate-950/60 rounded-lg px-2.5 py-1 text-xs text-white border border-white/15 focus:outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={handleAddHashtag}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
