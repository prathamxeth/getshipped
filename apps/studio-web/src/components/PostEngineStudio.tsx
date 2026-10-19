'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AsciiCanvas } from './AsciiCanvas';

export interface PostEngineStudioProps {
  repo: string;
  author: string;
  commit: string;
  selectedChannels: string[];
  onReturnToOnboarding: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function PostEngineStudio({
  repo,
  author,
  commit,
  selectedChannels,
  onReturnToOnboarding,
  videoRef,
}: PostEngineStudioProps) {
  // Developer profile formatting
  const cleanHandle = author.startsWith('@') ? author : `@${author}`;
  const cleanName = cleanHandle.replace(/^@/, '');
  const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  const initials = (cleanName.slice(0, 2) || 'DV').toUpperCase();

  // Sidebar mini/expanded
  const [isMini, setIsMini] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Active platform tab (defaults to first available selected channel)
  const defaultTab = useMemo(() => {
    if (selectedChannels.includes('x')) return 'tabX';
    if (selectedChannels.includes('linkedin')) return 'tabLinkedIn';
    if (selectedChannels.includes('github')) return 'tabGithub';
    return 'tabX';
  }, [selectedChannels]);

  const [activeTab, setActiveTab] = useState<'tabX' | 'tabLinkedIn' | 'tabGithub'>(defaultTab);

  // Video aspect ratio
  const [aspectRatio, setAspectRatio] = useState<'16-9' | '9-16'>('16-9');

  // Remotion 60fps player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 1800; // 30s @ 60 FPS
  const fps = 60;

  // Dispatch modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Copy button feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable post contents
  const [tweets, setTweets] = useState([
    `Traditional database search gets slow as your data grows.\n\nToday we're launching instant streaming search: 10x faster response times with live result streaming.\n\nHere is how it works 🧵👇`,
    `Instead of waiting for the full query to finish before returning data, we now stream results over a live async generator as soon as matches are found in memory.`,
    `Benchmarks in production: latency dropped from 140ms down to 12ms at 10,000 requests per second with 60% less memory usage.`,
    `Upgrading takes two minutes. It is a drop-in change for existing code:\n\n- pnpm add ${repo}\n- Switch search() to searchStream()\n- Full TypeScript support out of the box`,
    `Check out the docs and star the repo on GitHub:\n⭐ github.com/${repo}\n\nLet us know what you think and what features you would like to see next!`,
  ]);

  const [liTitle, setLiTitle] = useState('🚀 We just launched streaming search: 10x faster results with 12ms response times');
  const [liBody, setLiBody] = useState(
    `As applications scale, search queries often become the biggest bottleneck in user experience.\n\nOur engineering team just shipped a major upgrade to our search infrastructure.\n\nWhat is new:\n1. Instant Streaming: Results appear incrementally in 12ms instead of waiting for full queries.\n2. 60% Less Memory: Streaming buffers eliminate heavy payload serialization.\n3. Drop-in Compatibility: Fully backwards compatible with existing clients.\n\nCheck out the demo video and explore the code on GitHub.`
  );

  const [releaseNotes, setReleaseNotes] = useState(
    `## What's Changed\n* Instant streaming search generator yielding live results in 12ms\n* In-memory search buffers with 74% memory reduction\n* Full TypeScript definitions and drop-in searchStream() helper\n\n## Installation\n\`\`\`bash\npnpm add ${repo}\n\`\`\``
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const remotionPaneRef = useRef<HTMLDivElement | null>(null);
  const editorsPaneRef = useRef<HTMLDivElement | null>(null);

  // Update tweet text helper
  const handleTweetChange = (index: number, val: string) => {
    setTweets((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // 60FPS Video Player Loop
  useEffect(() => {
    let animId: number;
    function loop() {
      if (isPlaying) {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Derived scene values
  const activeScene = currentFrame < 600 ? 'diff' : currentFrame < 1200 ? 'zoom' : 'captions';
  const progressPercent = (currentFrame / totalFrames) * 100;
  const seconds = (currentFrame / fps).toFixed(1);
  const totalSec = (totalFrames / fps).toFixed(1);

  // Scene 2 calculations (Mock Cursor & 3D tilt)
  const localProgress = (currentFrame - 600) / 600;
  const curX = 35 + Math.sin(localProgress * Math.PI * 2) * 25;
  const curY = 40 + Math.cos(localProgress * Math.PI * 2) * 18;
  const rotX = (curY - 45) * 0.4;
  const rotY = (curX - 45) * -0.4;
  const tooltipText =
    localProgress < 0.33 ? '12ms Response Time' : localProgress < 0.66 ? '10,000 req/sec' : '1.1 GB Memory (-74%)';

  // Scene 3 captions
  const captionWords = [
    { text: 'Shipping', className: 'k-word' },
    { text: 'instant', className: 'k-word emph' },
    { text: 'streaming', className: 'k-word emph' },
    { text: 'search', className: 'k-word' },
    { text: 'today.', className: 'k-word' },
    { text: '10x faster', className: 'k-word cyan' },
    { text: 'results,', className: 'k-word' },
    { text: 'sub-15ms,', className: 'k-word emph' },
    { text: 'open source', className: 'k-word' },
    { text: 'on GitHub.', className: 'k-word cyan' },
  ];
  const capProgress = (currentFrame - 1200) / 600;
  const activeCapIdx = Math.floor(capProgress * captionWords.length);

  // Scrubber click seek
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentFrame(Math.floor(pct * totalFrames));
  };

  // Copy helper
  const handleCopy = (key: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const copyFullThread = () => {
    const full = tweets.map((t, idx) => `[Tweet ${idx + 1}/5]\n${t}`).join('\n\n---\n\n');
    handleCopy('thread', full);
  };

  const copyLinkedIn = () => {
    const tags = '#SoftwareEngineering #OpenSource #WebDev #Performance';
    handleCopy('linkedin', `${liTitle}\n\n${liBody}\n\n${tags}`);
  };

  const copyGithubRelease = () => {
    handleCopy('github', releaseNotes);
  };

  return (
    <div className={`app on ${isMini ? 'mini' : ''}`} id="appScene">
      {/* SIDEBAR */}
      <aside className={`side ${isExpanded ? 'expanded' : ''}`} id="sideRail">
        <div className="side-top">
          <div className="wordmark">getshipped</div>

          <button
            type="button"
            className="collapse-btn"
            id="collapseBtn"
            aria-label="Collapse sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setIsMini(true);
              setIsExpanded(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M9 3v18" strokeWidth="2.5" stroke="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            className="expand-btn"
            id="expandBtn"
            aria-label="Expand sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setIsMini(false);
              setIsExpanded(true);
            }}
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 2c5.52 0 10 4.48 10 10v10H12C6.48 22 2 17.52 2 12S6.48 2 12 2Zm-.3 4.1a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Z"
              />
            </svg>
          </button>
        </div>

        <nav className="side-nav">
          <a
            className="nav-item active"
            id="navPostEngine"
            title="Post Engine Workspace"
            onClick={() => {
              editorsPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                <path d="M10 9l5 3-5 3V9z" />
              </svg>
            </div>
            <span className="nav-label">Post Engine</span>
          </a>

          <a
            className="nav-item"
            id="navVideoStudio"
            title="Video Demo Player"
            onClick={() => {
              remotionPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="nav-label">Video Demo</span>
          </a>

          <a className="nav-item" id="navOnboarding" title="Launch Setup" onClick={onReturnToOnboarding}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="nav-label">Launch Setup</span>
          </a>
        </nav>

        <div className="side-footer">
          <div className="nav-item user-profile-item" id="sidebarUserItem" title="Connected Developer">
            <div className="nav-icon">
              <div className="avatar-icon" id="sidebarAvatarIcon">
                {initials}
              </div>
            </div>
            <span className="nav-label" id="sidebarDevName">
              {cleanHandle}
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <section
        className="panel"
        id="mainPanel"
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth <= 760 && isExpanded) {
            setIsExpanded(false);
          }
        }}
      >
        {/* Sky Loop Video */}
        <video
          ref={videoRef}
          className="video-bg"
          id="skyVideo"
          crossOrigin="anonymous"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261008_132137_6359ecf6-579c-4ff9-9f28-b220076e9195.png"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261008_132231_6df9b9a8-6975-4855-bdd8-5d72911d6ca5.mp4"
            type="video/mp4"
          />
        </video>

        {/* Live Cloud ASCII Canvas Texture */}
        <AsciiCanvas videoRef={videoRef} mode="sky" id="skyCanvas" />

        {/* PANEL TOP BAR */}
        <div className="panel-topbar">
          <div className="pipeline-badge">
            <div className="pulse-dot"></div>
            <span id="pipelineStatusText">Post Engine Ready • {repo}</span>
          </div>

          <button type="button" className="back-config-btn" id="btnBackToOnboarding" title="Edit Launch Inputs" onClick={onReturnToOnboarding}>
            <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Edit Launch Setup</span>
          </button>
        </div>

        {/* SCROLL CONTAINER */}
        <div className="scroll-container" id="scrollContainer" ref={scrollContainerRef}>
          <div className="content-col">
            {/* STUDIO HEADER */}
            <div className="studio-header rise" style={{ '--i': 0 } as React.CSSProperties}>
              <div>
                <h2 id="studioTitle">Post Engine — {commit}</h2>
                <p className="meta-sub" id="studioMeta">
                  {repo} • {selectedChannels.length} launch target{selectedChannels.length === 1 ? '' : 's'} configured
                </p>
              </div>
              <div className="studio-stats-pills">
                <div className="stat-badge ready">
                  <svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Ready to Ship</span>
                </div>
                <div className="stat-badge">
                  <span>60 FPS Master Video</span>
                </div>
              </div>
            </div>

            {/* SPLIT STUDIO GRID */}
            <div className="studio-split rise" style={{ '--i': 2 } as React.CSSProperties}>
              {/* LEFT PANE: REMOTION 60FPS VIDEO PLAYER */}
              <div className="remotion-pane" ref={remotionPaneRef}>
                <div className="pane-header">
                  <div className="pane-title">
                    <svg style={{ width: 14, height: 14, color: 'var(--emerald)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="4" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                    <span>Video Preview (Remotion v4)</span>
                  </div>

                  {/* Aspect Ratio Switcher */}
                  <div className="ratio-switcher">
                    <button
                      type="button"
                      className={`ratio-btn ${aspectRatio === '16-9' ? 'active' : ''}`}
                      id="btnRatio169"
                      onClick={() => setAspectRatio('16-9')}
                    >
                      16:9 Video
                    </button>
                    <button
                      type="button"
                      className={`ratio-btn ${aspectRatio === '9-16' ? 'active' : ''}`}
                      id="btnRatio916"
                      onClick={() => setAspectRatio('9-16')}
                    >
                      9:16 Shorts
                    </button>
                  </div>
                </div>

                {/* VIEWPORT */}
                <div className="player-stage">
                  <div className={`video-viewport ratio-${aspectRatio}`} id="videoViewport">
                    {/* SCENE 1: CODE DIFF SCENE */}
                    <div className={`scene-view ${activeScene === 'diff' ? 'active' : ''}`} id="sceneCodeDiff">
                      <div className="window-chrome">
                        <div className="dots">
                          <div className="dot r"></div>
                          <div className="dot y"></div>
                          <div className="dot g"></div>
                        </div>
                        <span>src/search.ts</span>
                      </div>
                      <div className="diff-code-body">
                        <div className="diff-line del">
                          <span className="diff-sign">-</span>
                          <span>export async function search(query: string) &#123;</span>
                        </div>
                        <div className="diff-line del">
                          <span className="diff-sign">-</span>
                          <span>  // Slow: waits for database to finish query</span>
                        </div>
                        <div className="diff-line del">
                          <span className="diff-sign">-</span>
                          <span>  const results = await db.raw(&quot;SELECT * FROM items WHERE text LIKE ?&quot;, query);</span>
                        </div>
                        <div className="diff-line del">
                          <span className="diff-sign">-</span>
                          <span>  return results.slice(0, 10);</span>
                        </div>
                        <div className="diff-line del">
                          <span className="diff-sign">-</span>
                          <span>&#125;</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>export async function* searchStream(query: string) &#123;</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>  // Fast: stream results immediately as found</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>  const stream = await index.streamResults(query);</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>  for await (const result of stream) &#123;</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>    yield result; // Instant 12ms response</span>
                        </div>
                        <div className="diff-line add">
                          <span className="diff-sign">+</span>
                          <span>  &#125;</span>
                        </div>
                        <div className="diff-line ctx">
                          <span className="diff-sign"> </span>
                          <span>&#125;</span>
                        </div>
                      </div>
                    </div>

                    {/* SCENE 2: UI DEMO / BENCHMARK ZOOM */}
                    <div className={`scene-view ${activeScene === 'zoom' ? 'active' : ''}`} id="sceneUiZoom">
                      <div className="window-chrome">
                        <div className="dots">
                          <div className="dot r"></div>
                          <div className="dot y"></div>
                          <div className="dot g"></div>
                        </div>
                        <span>Production Search Benchmarks</span>
                      </div>
                      <div className="zoom-stage-box" id="zoomStage">
                        <div
                          className="metrics-3d-card"
                          id="metricsCard"
                          style={{
                            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                          }}
                        >
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: 'var(--mono)' }}>
                            Live Benchmark • 10,000 QPS
                          </div>
                          <div className="metrics-grid-3d">
                            <div className="m-stat">
                              <div className="m-stat-label">Response Time</div>
                              <div className="m-stat-val">12 ms</div>
                            </div>
                            <div className="m-stat">
                              <div className="m-stat-label">Throughput</div>
                              <div className="m-stat-val">10,000 req/s</div>
                            </div>
                            <div className="m-stat">
                              <div className="m-stat-label">Memory Used</div>
                              <div className="m-stat-val" style={{ color: '#a7f3d0' }}>
                                1.1 GB (-74%)
                              </div>
                            </div>
                            <div className="m-stat">
                              <div className="m-stat-label">Speedup</div>
                              <div className="m-stat-val" style={{ color: 'var(--emerald)' }}>
                                10x Faster
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MOCK ANIMATED CURSOR */}
                        <div className="mock-cursor" id="mockCursor" style={{ left: `${curX}%`, top: `${curY}%` }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4l7 17 2.5-6.5L20 12 4 4z" fill="#fff" stroke="#000" strokeWidth="1.5" />
                          </svg>
                          <div className="cursor-tooltip" id="cursorTooltip">
                            {tooltipText}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SCENE 3: KINETIC CAPTIONS OVERLAY SCENE */}
                    <div className={`scene-view ${activeScene === 'captions' ? 'active' : ''}`} id="sceneCaptions">
                      <div className="captions-stage">
                        <div className="kinetic-box" id="kineticBox">
                          {captionWords.map((word, idx) => (
                            <span
                              key={idx}
                              className={`${word.className} ${idx <= activeCapIdx ? 'active' : ''}`}
                              data-word={idx}
                            >
                              {word.text}{' '}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTROLS BAR */}
                <div className="player-controls">
                  <div className="scrubber-track" id="scrubberTrack" onClick={handleScrubberClick}>
                    <div className="scrubber-progress" id="scrubberProgress" style={{ width: `${progressPercent}%` }}></div>
                  </div>

                  <div className="control-row">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="play-btn"
                        id="playBtn"
                        aria-label="Play or Pause"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <svg id="playIcon" style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg id="playIcon" style={{ width: 12, height: 12, marginLeft: 1 }} viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>
                      <div className="time-readout" id="timeReadout">
                        00:{seconds.padStart(4, '0')} / 00:{totalSec}
                      </div>
                    </div>

                    <div className="scene-chips">
                      <button
                        type="button"
                        className={`scene-chip ${activeScene === 'diff' ? 'active' : ''}`}
                        id="chipDiff"
                        onClick={() => setCurrentFrame(0)}
                      >
                        1. Code Diff
                      </button>
                      <button
                        type="button"
                        className={`scene-chip ${activeScene === 'zoom' ? 'active' : ''}`}
                        id="chipZoom"
                        onClick={() => setCurrentFrame(610)}
                      >
                        2. Benchmark
                      </button>
                      <button
                        type="button"
                        className={`scene-chip ${activeScene === 'captions' ? 'active' : ''}`}
                        id="chipCaptions"
                        onClick={() => setCurrentFrame(1210)}
                      >
                        3. Captions
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: POST ENGINE EDITORS */}
              <div className="editors-pane" ref={editorsPaneRef}>
                <div className="tab-bar">
                  {selectedChannels.includes('x') && (
                    <button
                      type="button"
                      className={`editor-tab ${activeTab === 'tabX' ? 'active' : ''}`}
                      id="tabBtnX"
                      onClick={() => setActiveTab('tabX')}
                    >
                      <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>𝕏 Thread</span>
                      <span className="tab-badge">5</span>
                    </button>
                  )}

                  {selectedChannels.includes('linkedin') && (
                    <button
                      type="button"
                      className={`editor-tab ${activeTab === 'tabLinkedIn' ? 'active' : ''}`}
                      id="tabBtnLinkedIn"
                      onClick={() => setActiveTab('tabLinkedIn')}
                    >
                      <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                      </svg>
                      <span>LinkedIn Post</span>
                    </button>
                  )}

                  {selectedChannels.includes('github') && (
                    <button
                      type="button"
                      className={`editor-tab ${activeTab === 'tabGithub' ? 'active' : ''}`}
                      id="tabBtnGithub"
                      onClick={() => setActiveTab('tabGithub')}
                    >
                      <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span>GitHub Release &amp; README</span>
                    </button>
                  )}
                </div>

                <div className="tab-content-area">
                  {/* TAB 1: 𝕏 THREAD */}
                  {selectedChannels.includes('x') && (
                    <div className={`tab-content ${activeTab === 'tabX' ? 'active' : ''}`} id="tabX">
                      <div className="tab-header-actions">
                        <span className="tab-title-text">𝕏 Launch Thread (5 Tweets)</span>
                        <button
                          type="button"
                          className={`copy-btn ${copiedKey === 'thread' ? 'copied' : ''}`}
                          id="copyThreadBtn"
                          title="Copy full 5-tweet thread"
                          onClick={copyFullThread}
                        >
                          <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>{copiedKey === 'thread' ? 'Thread Copied! ✓' : 'Copy Full Thread'}</span>
                        </button>
                      </div>

                      {tweets.map((tweetText, idx) => (
                        <div key={idx} className="tweet-card">
                          <div className="tweet-head">
                            <div className="tweet-user">
                              <div className="avatar-icon dev-display-avatar">{initials}</div>
                              <span className="tweet-user-name dev-display-name">{displayName}</span>
                              <span className="tweet-handle dev-display-handle">{cleanHandle}</span>
                            </div>
                            <span className="tweet-tag">
                              {idx === 0 ? 'Tweet 1 of 5 • Hook' : idx === 4 ? 'Tweet 5 of 5 • CTA' : `Tweet ${idx + 1} of 5`}
                            </span>
                          </div>
                          <textarea
                            className="tweet-textarea"
                            value={tweetText}
                            onChange={(e) => handleTweetChange(idx, e.target.value)}
                          />
                          <div className="tweet-footer">
                            <span>
                              {idx === 0
                                ? '[Video: 60fps Demo Attached]'
                                : idx === 1
                                ? '[Image: Architecture Diagram]'
                                : idx === 2
                                ? '[Image: Benchmark Chart]'
                                : idx === 3
                                ? '[Code Snippet Attached]'
                                : '[Link Preview Attached]'}
                            </span>
                            <span
                              className="char-count"
                              style={{ color: tweetText.length > 280 ? '#ef4444' : 'rgba(255, 255, 255, .4)' }}
                            >
                              {tweetText.length} / 280 chars
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: LINKEDIN POST */}
                  {selectedChannels.includes('linkedin') && (
                    <div className={`tab-content ${activeTab === 'tabLinkedIn' ? 'active' : ''}`} id="tabLinkedIn">
                      <div className="tab-header-actions">
                        <span className="tab-title-text">LinkedIn Engineering Post</span>
                        <button
                          type="button"
                          className={`copy-btn ${copiedKey === 'linkedin' ? 'copied' : ''}`}
                          id="copyLinkedInBtn"
                          title="Copy LinkedIn Post"
                          onClick={copyLinkedIn}
                        >
                          <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>{copiedKey === 'linkedin' ? 'Post Copied! ✓' : 'Copy Post'}</span>
                        </button>
                      </div>

                      <div className="li-author-bar">
                        <div className="avatar-icon dev-display-avatar">{initials}</div>
                        <div>
                          <div className="dev-display-name" style={{ fontWeight: 600, fontSize: '12.5px', color: '#fff' }}>
                            {displayName}
                          </div>
                          <div className="dev-display-handle" style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>
                            {cleanHandle}
                          </div>
                        </div>
                      </div>

                      <div className="linkedin-box">
                        <input
                          className="li-title-input"
                          id="liTitleInput"
                          value={liTitle}
                          onChange={(e) => setLiTitle(e.target.value)}
                        />
                        <textarea
                          className="li-body-textarea"
                          id="liBodyTextarea"
                          value={liBody}
                          onChange={(e) => setLiBody(e.target.value)}
                        />
                        <div className="hashtags-row">
                          <span className="hash-tag">#SoftwareEngineering</span>
                          <span className="hash-tag">#OpenSource</span>
                          <span className="hash-tag">#WebDev</span>
                          <span className="hash-tag">#Performance</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GITHUB RELEASE & README */}
                  {selectedChannels.includes('github') && (
                    <div className={`tab-content ${activeTab === 'tabGithub' ? 'active' : ''}`} id="tabGithub">
                      <div className="tab-header-actions">
                        <span className="tab-title-text">GitHub Release &amp; README</span>
                        <button
                          type="button"
                          className={`copy-btn ${copiedKey === 'github' ? 'copied' : ''}`}
                          id="copyReleaseBtn"
                          title="Copy GitHub Release Markdown"
                          onClick={copyGithubRelease}
                        >
                          <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>{copiedKey === 'github' ? 'Markdown Copied! ✓' : 'Copy Release Notes'}</span>
                        </button>
                      </div>

                      <div style={{ marginBottom: 12, padding: 14, borderRadius: 12, background: '#090e11', border: '1px solid rgba(255,255,255,.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', background: 'rgba(16,185,129,.2)', border: '1px solid rgba(16,185,129,.4)', borderRadius: 999, color: 'var(--emerald)', fontFamily: 'var(--mono)' }}>
                              Release
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>v2.0.0</span>
                          </div>
                          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,.5)' }} id="releaseRepoLabel">
                            {repo}
                          </span>
                        </div>
                        <textarea
                          className="release-textarea"
                          id="releaseNotesTextarea"
                          value={releaseNotes}
                          onChange={(e) => setReleaseNotes(e.target.value)}
                          style={{
                            width: '100%',
                            height: 130,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'rgba(255,255,255,.85)',
                            fontFamily: 'var(--mono)',
                            fontSize: 11.5,
                            lineHeight: '19px',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div className="readme-diff-box">
                        <div className="diff-header-bar">
                          <span>README.md</span>
                          <span>Target: main branch</span>
                        </div>
                        <pre className="diff-pre">
                          <code style={{ color: '#94a3b8' }}>
                            <span style={{ color: '#fca5a5' }}>- # Core Search (v1.0)</span>
                            {'\n'}
                            <span style={{ color: '#6ee7b7' }}>+ # Core Search v2 ⚡</span>
                            {'\n'}
                            <span style={{ color: '#6ee7b7' }}>+ &gt; Instant streaming search API for modern apps.</span>
                            {'\n'}
                            <span style={{ color: '#6ee7b7' }}>+ &gt; 10x faster response times with sub-15ms latency.</span>
                            {'\n '}
                            {'\n'}
                            <span style={{ color: '#fca5a5' }}>- Slow sequential query engine.</span>
                            {'\n'}
                            <span style={{ color: '#6ee7b7' }}>+ [![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)</span>
                            {'\n'}
                            <span style={{ color: '#6ee7b7' }}>+ [![Demo Video](https://img.shields.io/badge/Demo-60fps_Video-purple.svg)](https://getshipped.ai)</span>
                            {'\n '}
                            {'\n'}
                            ## Quick Start
                            {'\n'}
                            ```bash
                            {'\n'}
                            pnpm add {repo}
                            {'\n'}
                            ```
                          </code>
                        </pre>
                      </div>

                      <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 12, background: '#090e11', border: '1px solid rgba(16,185,129,.2)' }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--emerald)', marginBottom: 8 }}>
                          Verified Performance Benchmarks
                        </div>
                        <table className="bench-table">
                          <thead>
                            <tr>
                              <th>Engine</th>
                              <th>Response Time</th>
                              <th>Throughput</th>
                              <th>Memory</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Standard DB Query</td>
                              <td>140ms</td>
                              <td>1,200 QPS</td>
                              <td>4.2 GB</td>
                            </tr>
                            <tr>
                              <td className="highlight">New Streaming Search</td>
                              <td className="highlight">12ms (91% faster)</td>
                              <td className="highlight">10,000 QPS</td>
                              <td className="highlight">1.1 GB (-74%)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM DISPATCH ACTION HUB */}
            <div className="dispatch-hub rise" style={{ '--i': 4 } as React.CSSProperties}>
              <div className="hub-left">
                <div className="target-indicators" id="targetIndicators">
                  {selectedChannels.includes('x') && <span className="target-badge on">𝕏 Thread</span>}
                  {selectedChannels.includes('linkedin') && <span className="target-badge on">LinkedIn Post</span>}
                  {selectedChannels.includes('github') && <span className="target-badge on">GitHub Release</span>}
                  {selectedChannels.includes('video') && <span className="target-badge on">60fps Demo Video</span>}
                </div>
              </div>

              <button type="button" className="ship-btn" id="shipBtn" onClick={() => setIsModalOpen(true)}>
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m12 2 3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" />
                </svg>
                <span>Approve &amp; Ship Everywhere</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DISPATCH CELEBRATION MODAL */}
      <div className={`dispatch-modal ${isModalOpen ? 'open' : ''}`} id="dispatchModal" onClick={(e) => {
        if (e.target === e.currentTarget) setIsModalOpen(false);
      }}>
        <div className="modal-box">
          <div className="modal-icon">
            <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Launch Successfully Published! 🎉</h3>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.65)', marginTop: -6 }}>
            All chosen launch targets have been generated and dispatched.
          </p>

          <div className="log-list" id="modalLogList">
            {selectedChannels.includes('x') && <div className="log-item done">✓ 𝕏 Launch Thread Published</div>}
            {selectedChannels.includes('linkedin') && <div className="log-item done">✓ LinkedIn Post Published</div>}
            {selectedChannels.includes('github') && <div className="log-item done">✓ GitHub Release &amp; README Published</div>}
            {selectedChannels.includes('video') && <div className="log-item done">✓ 60fps Demo Video Rendered</div>}
          </div>

          <button type="button" className="modal-close-btn" id="modalCloseBtn" onClick={() => setIsModalOpen(false)}>
            Return to Post Engine
          </button>
        </div>
      </div>
    </div>
  );
}
