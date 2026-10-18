'use client';

import React, { useState } from 'react';
import { BookOpen, GitPullRequest, CheckCircle2 } from 'lucide-react';
import { Copywriting } from '@getshipped/shared-types';
import { XIcon, LinkedInIcon } from '../ui/BrandIcons';
import { XThreadEditor } from './XThreadEditor';
import { LinkedInEditor } from './LinkedInEditor';
import { HashnodeBlogEditor } from './HashnodeBlogEditor';
import { GitDiffEditor } from './GitDiffEditor';

export interface ApprovalTabsProps {
  copywriting: Copywriting;
  onChange: (updatedCopywriting: Copywriting) => void;
}

type TabType = 'x_thread' | 'linkedin' | 'hashnode' | 'github_diff';

export const ApprovalTabs: React.FC<ApprovalTabsProps> = ({ copywriting, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('x_thread');

  return (
    <div className="flex flex-col h-full bg-surface-panel overflow-hidden">
      {/* Tab Switcher Navigation - Linear / Raycast Segmented Header */}
      <div className="flex items-center gap-1 border-b border-border-subtle bg-surface-elevated/70 px-4 py-2">
        <button
          type="button"
          onClick={() => setActiveTab('x_thread')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
            activeTab === 'x_thread'
              ? 'bg-white/10 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <XIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>X Thread</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
            {copywriting.xThread.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
            activeTab === 'linkedin'
              ? 'bg-white/10 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>LinkedIn Post</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hashnode')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
            activeTab === 'hashnode'
              ? 'bg-white/10 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hashnode / Dev.to</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
            Mermaid
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('github_diff')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
            activeTab === 'github_diff'
              ? 'bg-white/10 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
          <span>GitHub README Diff</span>
        </button>
      </div>

      {/* Active Tab Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'x_thread' && (
          <XThreadEditor
            tweets={copywriting.xThread}
            onChange={(updatedTweets) => onChange({ ...copywriting, xThread: updatedTweets })}
          />
        )}

        {activeTab === 'linkedin' && (
          <LinkedInEditor
            post={copywriting.linkedInPost}
            onChange={(updatedPost) => onChange({ ...copywriting, linkedInPost: updatedPost })}
          />
        )}

        {activeTab === 'hashnode' && (
          <HashnodeBlogEditor
            article={copywriting.hashnodeMarkdown}
            onChange={(updatedArticle) => onChange({ ...copywriting, hashnodeMarkdown: updatedArticle })}
          />
        )}

        {activeTab === 'github_diff' && (
          <GitDiffEditor
            diffData={copywriting.gitHubReadmeDiff}
            onChange={(updatedDiff) => onChange({ ...copywriting, gitHubReadmeDiff: updatedDiff })}
          />
        )}
      </div>
    </div>
  );
};
