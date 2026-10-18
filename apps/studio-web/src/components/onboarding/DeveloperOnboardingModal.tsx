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
      <div className="w-full max-w-2xl bg-[#0F172A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <User className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Developer Onboarding & Persona Calibration</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-3 border-b border-white/10 bg-black/30 text-xs">
          {[
            { step: 1, title: 'Developer Identity' },
            { step: 2, title: 'Voice & Data Retrieval' },
            { step: 3, title: 'Whatever Dev Wants' },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-3 text-center border-b-2 font-semibold transition-all ${
                currentStep === s.step
                  ? 'border-emerald-400 text-emerald-300 bg-white/5'
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
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Developer Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full mt-1 bg-slate-900/80 rounded-xl p-3 text-sm text-white border border-white/10 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Role & Title
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full mt-1 bg-slate-900/80 rounded-xl p-3 text-sm text-white border border-white/10 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    GitHub Handle
                  </label>
                  <input
                    type="text"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    className="w-full mt-1 bg-slate-900/80 rounded-xl p-3 text-sm font-mono text-cyan-300 border border-white/10 focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="w-full mt-1 bg-slate-900/80 rounded-xl p-3 text-sm font-mono text-cyan-300 border border-white/10 focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Connected Repository Pill */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span>Repo: {launchPack.repoUrl.replace('https://github.com/', '')}</span>
                  <span>•</span>
                  <span>Branch: feat/speculative-graph</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  CONNECTED
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Voice & Data Retrieval */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedVoice === v.id
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{v.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold">
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
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
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
                className="w-full bg-slate-950/80 rounded-xl p-4 text-sm text-emerald-300 border border-white/15 focus:border-cyan-500/60 focus:outline-none font-mono leading-relaxed"
                placeholder="Enter your custom launch pack instructions..."
              />

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RAG analysis will immediately synthesize your directives into all 5 omnichannel outputs.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
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
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
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
