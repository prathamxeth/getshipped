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
    <div className="flex flex-col h-full bg-[#0B0F19] overflow-hidden">
      {/* Tab Switcher Navigation */}
      <div className="flex items-center border-b border-white/10 bg-slate-900/60 px-4 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('x_thread')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'x_thread'
              ? 'border-cyan-400 text-cyan-300 bg-white/5 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <XIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>X Thread</span>
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
            {copywriting.xThread.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'linkedin'
              ? 'border-blue-400 text-blue-300 bg-white/5 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>LinkedIn Post</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hashnode')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'hashnode'
              ? 'border-emerald-400 text-emerald-300 bg-white/5 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hashnode / Dev.to</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
            Mermaid Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('github_diff')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'github_diff'
              ? 'border-purple-400 text-purple-300 bg-white/5 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
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
