'use client';

import React, { useState, useEffect } from 'react';
import { AsciiCanvas } from './AsciiCanvas';

export interface DeveloperOnboardingProps {
  repo: string;
  onRepoChange: (val: string) => void;
  author: string;
  onAuthorChange: (val: string) => void;
  commit: string;
  onCommitChange: (val: string) => void;
  selectedChannels: string[];
  onToggleChannel: (channel: string) => void;
  onLaunch: () => void;
  isLeaving: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function DeveloperOnboarding({
  repo,
  onRepoChange,
  author,
  onAuthorChange,
  commit,
  onCommitChange,
  selectedChannels,
  onToggleChannel,
  onLaunch,
  isLeaving,
  videoRef,
}: DeveloperOnboardingProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch();
  };

  const channelCount = selectedChannels.length;

  return (
    <main className={`auth ${isReady ? 'ready' : ''} ${isLeaving ? 'leaving' : ''}`} id="authScene">
      <div className="stage" id="stage">
        {/* Castle Loop Video */}
        <video
          ref={videoRef}
          className="video-bg"
          id="castleVideo"
          crossOrigin="anonymous"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261008_132124_50d78eac-e46e-49d5-a59b-de71f535c38d.png"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261008_132243_cd48b677-64ff-4623-b56b-b53b043ece5d.mp4"
            type="video/mp4"
          />
        </video>

        {/* Live ASCII Character Texture */}
        <AsciiCanvas videoRef={videoRef} mode="castle" id="castleCanvas" />

        {/* Onboarding Card */}
        <div className="card" id="authCard">
          <div className="logo-tile">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 2c5.52 0 10 4.48 10 10v10H12C6.48 22 2 17.52 2 12S6.48 2 12 2Zm-.3 4.1a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Z"
              />
            </svg>
          </div>

          <h1>GetShipped</h1>
          <p className="subtitle">Turn code commits into demo videos, social posts, and docs.</p>

          {/* Quick Connect Row */}
          <div className="oauth-row">
            <button type="button" className="github-connect-btn" id="githubAuthBtn" onClick={onLaunch}>
              <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Connect GitHub Repository</span>
            </button>
          </div>

          <div className="divider">Configure Your Launch</div>

          {/* Form: Developer Details & Launch Targets */}
          <form className="auth-form" id="signupForm" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-group-label">
              GitHub Repository
              <span>target repo</span>
            </div>
            <label className="field">
              <input
                type="text"
                id="repoInput"
                value={repo}
                onChange={(e) => onRepoChange(e.target.value)}
                placeholder="owner/repo"
                required
              />
            </label>

            <div className="form-group-label">
              Developer Handle
              <span>author tag</span>
            </div>
            <label className="field">
              <input
                type="text"
                id="authorInput"
                value={author}
                onChange={(e) => onAuthorChange(e.target.value)}
                placeholder="@yourhandle"
                required
              />
            </label>

            <div className="form-group-label">
              Feature / Commit Message
              <span>git commit</span>
            </div>
            <label className="field">
              <input
                type="text"
                id="commitInput"
                value={commit}
                onChange={(e) => onCommitChange(e.target.value)}
                placeholder="What did you build?"
                required
              />
            </label>

            <div className="form-group-label">
              Choose Target Platforms
              <span id="selectedCount">{channelCount} platform{channelCount === 1 ? '' : 's'} selected</span>
            </div>
            <div className="channel-pills">
              <label
                className={`channel-pill ${selectedChannels.includes('x') ? 'active' : ''}`}
                data-channel="x"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleChannel('x');
                }}
              >
                <input type="checkbox" checked={selectedChannels.includes('x')} readOnly />
                <div className="check-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span>𝕏 Thread</span>
              </label>

              <label
                className={`channel-pill ${selectedChannels.includes('linkedin') ? 'active' : ''}`}
                data-channel="linkedin"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleChannel('linkedin');
                }}
              >
                <input type="checkbox" checked={selectedChannels.includes('linkedin')} readOnly />
                <div className="check-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span>LinkedIn Post</span>
              </label>

              <label
                className={`channel-pill ${selectedChannels.includes('github') ? 'active' : ''}`}
                data-channel="github"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleChannel('github');
                }}
              >
                <input type="checkbox" checked={selectedChannels.includes('github')} readOnly />
                <div className="check-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span>GitHub Release</span>
              </label>

              <label
                className={`channel-pill ${selectedChannels.includes('video') ? 'active' : ''}`}
                data-channel="video"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleChannel('video');
                }}
              >
                <input type="checkbox" checked={selectedChannels.includes('video')} readOnly />
                <div className="check-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span>60fps Demo Video</span>
              </label>
            </div>

            <button type="submit" className="submit-btn" id="submitBtn">
              <span>Launch Post Engine</span>
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <footer className="legal">
        <span>GetShipped • Automated Developer Launch Platform</span>
      </footer>
    </main>
  );
}
