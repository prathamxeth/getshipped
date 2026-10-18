'use client';

import React, { useState } from 'react';
import {
  User,
  Sparkles,
  GitBranch,
  GitCommit,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Zap,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { LaunchPackProps } from '@getshipped/shared-types';

export interface DeveloperOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  launchPack: LaunchPackProps;
  onSaveProfile: (updated: LaunchPackProps) => void;
}

export const DeveloperOnboardingModal: React.FC<DeveloperOnboardingModalProps> = ({
  isOpen,
  onClose,
  launchPack,
  onSaveProfile,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [authorName, setAuthorName] = useState(launchPack.author.name);
  const [authorRole, setAuthorRole] = useState(launchPack.author.role);
  const [githubHandle, setGithubHandle] = useState(launchPack.author.githubHandle);
  const [twitterHandle, setTwitterHandle] = useState(launchPack.author.twitterHandle);
  const [selectedVoice, setSelectedVoice] = useState<'systems' | 'viral' | 'architect'>('systems');
  const [devDirectives, setDevDirectives] = useState(
    'Highlight the 14.2ms TTFT reduction, emphasize the SharedArrayRingBuffer lock-free stream, and tailor the hook for distributed AI systems engineers.'
  );

  if (!isOpen) return null;

  const handleApply = () => {
    const updated: LaunchPackProps = {
      ...launchPack,
      author: {
        ...launchPack.author,
        name: authorName,
        role: authorRole,
        githubHandle,
        twitterHandle,
      },
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-panel border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Developer Onboarding & Persona Calibration</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-semibold">
                  Step {currentStep} of 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Calibrates developer data retrieval, technical voice tone, and custom launch directives.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-3 border-b border-border-subtle bg-black/20 text-xs">
          {[
            { step: 1, title: 'Developer Identity' },
            { step: 2, title: 'Voice & Data Retrieval' },
            { step: 3, title: 'Whatever Dev Wants' },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-3 text-center border-b font-medium text-xs transition-colors ${
                currentStep === s.step
                  ? 'border-emerald-500 text-emerald-300 bg-white/[0.03]'
                  : currentStep > s.step
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-500'
              }`}
            >
              0{s.step}. {s.title}
            </div>
          ))}
        </div>

        {/* Modal Step Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[460px]">
          {/* STEP 1: Developer Identity */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Developer Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full mt-1.5 bg-surface-canvas rounded-lg px-3 py-2 text-xs text-white border border-border-subtle focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Role & Title
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full mt-1.5 bg-surface-canvas rounded-lg px-3 py-2 text-xs text-white border border-border-subtle focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    GitHub Handle
                  </label>
                  <input
                    type="text"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    className="w-full mt-1.5 bg-surface-canvas rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 border border-border-subtle focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="w-full mt-1.5 bg-surface-canvas rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 border border-border-subtle focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Connected Repository Pill */}
              <div className="p-3.5 rounded-lg bg-surface-canvas border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span>Repo: {launchPack.repoUrl.replace('https://github.com/', '')}</span>
                  <span>•</span>
                  <span>Branch: feat/speculative-graph</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                  CONNECTED
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Voice & Data Retrieval */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Select Technical Voice & Copy Calibration
              </label>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: 'systems',
                    title: 'Hardcore Systems & Infrastructure Engineer',
                    desc: 'Deep focus on memory layout, lock-free ring buffers, p99 latencies, and compiler AST optimizations.',
                    badge: 'RECOMMENDED FOR RAG',
                  },
                  {
                    id: 'viral',
                    title: 'Viral Open-Source Builder',
                    desc: 'Punchy hooks, benchmark charts, animated code GIFs, and clear GitHub repository star callouts.',
                    badge: 'HIGH ENGAGEMENT',
                  },
                  {
                    id: 'architect',
                    title: 'Engineering Director / Founder Voice',
                    desc: 'High-level business impact, architectural trade-offs, team velocity, and enterprise adoption.',
                    badge: 'STRATEGIC',
                  },
                ].map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id as any)}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      selectedVoice === v.id
                        ? 'bg-emerald-950/20 border-emerald-500/60'
                        : 'bg-surface-canvas border-border-subtle hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{v.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-semibold">
                        {v.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Whatever Dev Wants Custom Directives */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Whatever Dev Wants (Custom Launch Directives)</span>
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Instruct GetShipped to emphasize specific benchmarks, rephrase tweets, adjust video pacing, or target specific dev audiences.
                </p>
              </div>

              <textarea
                value={devDirectives}
                onChange={(e) => setDevDirectives(e.target.value)}
                rows={5}
                className="w-full bg-surface-canvas rounded-lg p-3 text-xs text-emerald-300 border border-border-subtle focus:border-cyan-500 focus:outline-none font-mono leading-relaxed"
                placeholder="Enter your custom launch pack instructions..."
              />

              <div className="p-3 rounded-lg bg-surface-canvas border border-border-subtle text-xs text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RAG analysis will immediately synthesize your directives into all 5 omnichannel outputs.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-border-subtle bg-surface-elevated/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer active:translate-y-px shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Synthesize Launch Pack</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

