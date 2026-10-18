'use client';

import React, { useState } from 'react';
import { BookOpen, Code, Eye, Tag, Image as ImageIcon, Sparkles } from 'lucide-react';
import { HashnodeMarkdown } from '@getshipped/shared-types';
import { MermaidPreview } from './MermaidPreview';

export interface HashnodeBlogEditorProps {
  article: HashnodeMarkdown;
  onChange: (updatedArticle: HashnodeMarkdown) => void;
}

export const HashnodeBlogEditor: React.FC<HashnodeBlogEditorProps> = ({ article, onChange }) => {
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const handleTitleChange = (title: string) => {
    onChange({ ...article, title });
  };

  const handleContentChange = (content: string) => {
    onChange({ ...article, content });
  };

  // Extract mermaid diagrams from the content markdown
  const extractMermaidBlocks = (content: string) => {
    const regex = /```mermaid([\s\S]*?)```/g;
    const blocks: { code: string; fullMatch: string }[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      blocks.push({
        code: match[1].trim(),
        fullMatch: match[0],
      });
    }
    return blocks;
  };

  const mermaidBlocks = extractMermaidBlocks(article.content);

  // Render markdown content chunks, replacing mermaid code blocks with live MermaidPreview components
  const renderFormattedPreview = () => {
    const parts = article.content.split(/(```mermaid[\s\S]*?```)/g);

    return (
      <div className="flex flex-col gap-4 text-slate-200 leading-relaxed font-sans">
        {/* Cover Image banner */}
        {article.coverImageUrl && (
          <div className="w-full h-48 rounded-xl overflow-hidden relative border border-white/10 mb-4 shadow-xl">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Hashnode / Dev.to Technical Article
              </span>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-black text-white tracking-tight">{article.title}</h1>
        <p className="text-sm text-slate-400 italic border-l-2 border-emerald-500 pl-3">
          {article.subtitle}
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 my-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-cyan-300 border border-white/10 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

        {parts.map((part, index) => {
          if (part.startsWith('```mermaid') && part.endsWith('```')) {
            const chartCode = part.replace(/^```mermaid/, '').replace(/```$/, '').trim();
            return <MermaidPreview key={index} chartCode={chartCode} />;
          }

          // Process markdown lines (headers, lists, tables)
          const lines = part.split('\n');
          return (
            <div key={index} className="flex flex-col gap-3">
              {lines.map((line, lIdx) => {
                if (line.startsWith('# ')) {
                  return <h1 key={lIdx} className="text-xl font-bold text-white mt-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={lIdx} className="text-lg font-bold text-slate-100 mt-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={lIdx} className="text-base font-semibold text-emerald-400 mt-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return (
                    <li key={lIdx} className="text-sm text-slate-300 ml-4 list-disc">
                      {line.slice(2)}
                    </li>
                  );
                }
                if (line.startsWith('|')) {
                  return (
                    <div key={lIdx} className="text-xs font-mono text-cyan-200 bg-slate-900/60 p-2 rounded border border-white/5 overflow-x-auto">
                      {line}
                    </div>
                  );
                }
                if (line.trim().length === 0) {
                  return <div key={lIdx} className="h-1" />;
                }
                return (
                  <p key={lIdx} className="text-sm text-slate-300">
                    {line}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar with View Mode Toggle */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Hashnode / Dev.to Technical Article Editor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full Markdown post with real-time Mermaid.js architecture graph compilation.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded font-medium ${
              viewMode === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 rounded font-medium ${
              viewMode === 'edit' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Editor Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded font-medium ${
              viewMode === 'preview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preview Only
          </button>
        </div>
      </div>

      {/* Editor & Preview Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Markdown Source Editor */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`flex flex-col p-6 overflow-y-auto border-r border-white/10 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Article Title</label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full mt-1 bg-slate-900/80 rounded-xl p-3 text-sm font-bold text-white border border-white/10 focus:border-emerald-500/60 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Markdown Source</label>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {mermaidBlocks.length} Mermaid diagram(s) detected
                  </span>
                </div>
                <textarea
                  value={article.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={20}
                  className="w-full bg-slate-950/70 rounded-xl p-4 text-xs font-mono text-slate-200 border border-white/10 focus:border-emerald-500/60 focus:outline-none leading-relaxed resize-y"
                  placeholder="# Enter markdown here..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Live Compiled Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`p-6 overflow-y-auto bg-slate-950/40 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="max-w-2xl mx-auto">
              {renderFormattedPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
