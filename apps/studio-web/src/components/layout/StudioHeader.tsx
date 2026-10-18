'use client';

import React, { useState } from 'react';
import {
  Rocket,
  GitBranch,
  GitCommit,
  ShieldCheck,
  Download,
  Loader2,
  Film,
  Cpu,
  User,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { LaunchPackProps } from '@getshipped/shared-types';

export interface StudioHeaderProps {
  launchPack: LaunchPackProps;
  activeView: 'studio' | 'rag';
  onViewChange: (view: 'studio' | 'rag') => void;
  aspectRatio: '16:9' | '9:16';
  onAspectRatioChange: (ratio: '16:9' | '9:16') => void;
  onOpenOnboarding: () => void;
  onApproveAndShip: () => void;
  isShipping?: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  launchPack,
  activeView,
  onViewChange,
  aspectRatio,
  onAspectRatioChange,
  onOpenOnboarding,
  onApproveAndShip,
  isShipping = false,
}) => {
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const handleExportMP4 = async () => {
    setIsExportingVideo(true);
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositionId: aspectRatio === '9:16' ? 'GetShippedMasterVideo-9x16' : 'GetShippedMasterVideo-16x9',
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (data.downloadUrl) {
        setExportedUrl(data.downloadUrl);
        // Automatically trigger browser download
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = data.filename || `getshipped-video-${aspectRatio.replace(':', 'x')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      // Fallback
    } finally {
      setIsExportingVideo(false);
    }
  };

  return (
    <header className="h-16 px-6 border-b border-white/10 bg-[#07090E]/95 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
      {/* Left: Brand, Project Info & Mode Switcher */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Rocket className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">GetShipped</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold font-mono">
                1-Tab Studio
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="text-slate-300">{launchPack.projectName}</span>
              <span>•</span>
              <span className="text-cyan-400">v{launchPack.version}</span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* View Switcher: Studio (Remotion + Omnichannel) vs RAG Intelligence */}
        <div className="flex items-center bg-surface-elevated p-0.5 rounded-lg border border-border-subtle text-xs">
          <button
            type="button"
            onClick={() => onViewChange('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              activeView === 'studio'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Video & Omnichannel Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('rag')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              activeView === 'rag'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Interactive RAG Intelligence</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono ml-0.5">
              14.2ms
            </span>
          </button>
        </div>

        {/* Developer Persona Onboarding Pill */}
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-white/[0.06] border border-border-subtle text-xs text-slate-300 transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dev Profile: <strong className="text-white font-medium">{launchPack.author.name}</strong></span>
          <span className="text-[10px] text-cyan-400 font-mono">Edit</span>
        </button>
      </div>

      {/* Right: Aspect Ratio, In-App MP4 Export & Ship Action */}
      <div className="flex items-center gap-3">
        {/* Aspect Ratio Switcher */}
        <div className="flex items-center bg-surface-elevated p-0.5 rounded-lg border border-border-subtle text-xs">
          <button
            type="button"
            onClick={() => onAspectRatioChange('16:9')}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              aspectRatio === '16:9'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            16:9
          </button>
          <button
            type="button"
            onClick={() => onAspectRatioChange('9:16')}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              aspectRatio === '9:16'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            9:16
          </button>
        </div>

        {/* In-Browser 60fps MP4 Export Button (Zero Terminal!) */}
        <button
          type="button"
          onClick={handleExportMP4}
          disabled={isExportingVideo}
          className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-white/[0.08] text-slate-200 border border-border-subtle hover:border-border-hover text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 active:translate-y-px"
          title="Render & Download 60fps MP4 in browser without terminal"
        >
          {isExportingVideo ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Rendering MP4...</span>
            </>
          ) : exportedUrl ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download MP4</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export 60fps MP4</span>
            </>
          )}
        </button>

        {/* Primary Action: Approve & Ship Everywhere */}
        <button
          type="button"
          onClick={onApproveAndShip}
          disabled={isShipping}
          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-tight flex items-center gap-2 shadow-sm transition-colors active:translate-y-px disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{isShipping ? 'Shipping via Restate...' : 'Approve & Ship Everywhere'}</span>
        </button>
      </div>
    </header>
  );
};
