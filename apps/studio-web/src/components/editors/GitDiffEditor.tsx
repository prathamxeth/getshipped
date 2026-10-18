'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitCommit, FileText, Check, Plus, Minus } from 'lucide-react';
import { GitHubReadmeDiff } from '@getshipped/shared-types';

export interface GitDiffEditorProps {
  diffData: GitHubReadmeDiff;
  onChange: (updatedDiff: GitHubReadmeDiff) => void;
}

export const GitDiffEditor: React.FC<GitDiffEditorProps> = ({ diffData, onChange }) => {
  const [diffViewMode, setDiffViewMode] = useState<'unified' | 'split'>('unified');

  const handleCommitMessageChange = (commitMessage: string) => {
    onChange({ ...diffData, commitMessage });
  };

  const handleAfterSnippetChange = (afterSnippet: string) => {
    onChange({ ...diffData, afterSnippet });
  };

  const beforeLines = diffData.beforeSnippet.split('\n');
  const afterLines = diffData.afterSnippet.split('\n');

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            <span>GitHub Pull Request & README Diff</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Branch: {diffData.targetBranch}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Automated PR updating benchmark tables, quickstarts, and badges on release.
          </p>
        </div>

        {/* Diff view mode switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setDiffViewMode('unified')}
            className={`px-3 py-1 rounded font-medium ${
              diffViewMode === 'unified' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unified Diff
          </button>
          <button
            type="button"
            onClick={() => setDiffViewMode('split')}
            className={`px-3 py-1 rounded font-medium ${
              diffViewMode === 'split' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Commit Message Box */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Commit Message</span>
        </label>
        <input
          type="text"
          value={diffData.commitMessage}
          onChange={(e) => handleCommitMessageChange(e.target.value)}
          className="w-full bg-slate-900/80 rounded-xl p-3 text-sm font-mono text-cyan-300 border border-white/10 focus:border-purple-500/60 focus:outline-none"
        />
      </div>

      {/* Target File Indicator */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300">
        <FileText className="w-4 h-4 text-slate-400" />
        <span className="text-white font-semibold">{diffData.filename}</span>
        <span className="text-slate-500">|</span>
        <span className="text-emerald-400">+{afterLines.length} additions</span>
        <span className="text-slate-500">/</span>
        <span className="text-red-400">-{beforeLines.length} deletions</span>
      </div>

      {/* Diff Viewers */}
      {diffViewMode === 'unified' ? (
        <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#090D16] font-mono text-xs">
          {/* File Header */}
          <div className="px-4 py-2 bg-slate-900/90 text-slate-400 border-b border-white/10">
            @@ -1,{beforeLines.length} +1,{afterLines.length} @@ {diffData.filename}
          </div>

          {/* Deleted lines (red) */}
          {beforeLines.map((line, idx) => (
            <div key={`del-${idx}`} className="flex items-center px-4 py-1 bg-red-500/10 text-red-300 border-l-2 border-red-500">
              <span className="w-8 text-right pr-3 select-none text-red-500/60 font-semibold">{idx + 1}</span>
              <span className="w-5 select-none text-red-400 font-bold">-</span>
              <span className="flex-1 whitespace-pre">{line}</span>
            </div>
          ))}

          {/* Added lines (green) */}
          {afterLines.map((line, idx) => (
            <div key={`add-${idx}`} className="flex items-center px-4 py-1 bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500">
              <span className="w-8 text-right pr-3 select-none text-emerald-500/60 font-semibold">{idx + 1}</span>
              <span className="w-5 select-none text-emerald-400 font-bold">+</span>
              <span className="flex-1 whitespace-pre">{line}</span>
            </div>
          ))}
        </div>
      ) : (
        /* Side by Side Diff */
        <div className="grid grid-cols-2 gap-4">
          {/* Before */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-red-500/30 bg-[#090D16] font-mono text-xs">
            <div className="px-4 py-2 bg-red-950/40 text-red-300 font-semibold border-b border-red-500/20">
              Before (Original {diffData.filename})
            </div>
            <div className="p-3 flex flex-col gap-0.5 overflow-x-auto">
              {beforeLines.map((line, idx) => (
                <div key={idx} className="flex items-start text-red-300/80">
                  <span className="w-6 text-slate-600 select-none mr-2">{idx + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-emerald-500/30 bg-[#090D16] font-mono text-xs">
            <div className="px-4 py-2 bg-emerald-950/40 text-emerald-300 font-semibold border-b border-emerald-500/20 flex items-center justify-between">
              <span>After (Proposed {diffData.filename})</span>
              <span className="text-[10px] text-emerald-400 font-bold">READY TO MERGE</span>
            </div>
            <textarea
              value={diffData.afterSnippet}
              onChange={(e) => handleAfterSnippetChange(e.target.value)}
              rows={16}
              className="p-3 bg-transparent text-emerald-200 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
