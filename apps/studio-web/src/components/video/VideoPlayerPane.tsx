'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Layers, Sliders } from 'lucide-react';
import type { PlayerRef } from '@remotion/player';
import { LaunchPackProps } from '@getshipped/shared-types';
import { GetShippedMasterVideo } from '@getshipped/remotion-studio';

// Dynamically import Remotion Player to avoid SSR hydration mismatches
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false }
);

export interface VideoPlayerPaneProps {
  launchPack: LaunchPackProps;
  aspectRatio: '16:9' | '9:16';
  onAspectRatioChange: (ratio: '16:9' | '9:16') => void;
}

export const VideoPlayerPane: React.FC<VideoPlayerPaneProps> = ({
  launchPack,
  aspectRatio,
  onAspectRatioChange,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);

  const durationInFrames = launchPack.video.durationInFrames || 1800; // 30s @ 60fps
  const fps = 60;

  // Format frame number into MM:SS:FF timecode
  const formatTimecode = (frame: number) => {
    const totalSeconds = Math.floor(frame / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const frames = frame % fps;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Listen to frame updates from the player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', onFrameUpdate);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    return () => {
      player.removeEventListener('frameupdate', onFrameUpdate);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleSeek = (frame: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(frame);
    setCurrentFrame(frame);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (playerRef.current) {
      // Remotion player playback rate
    }
  };

  const isVertical = aspectRatio === '9:16';
  const compositionWidth = isVertical ? 1080 : 1920;
  const compositionHeight = isVertical ? 1920 : 1080;

  return (
    <div className="flex flex-col h-full bg-[#090D16] border-r border-white/10 relative overflow-hidden">
      {/* Top Controls Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Remotion v4 Live Preview
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
            60 FPS
          </span>
        </div>

        {/* Scene Jump Pills */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleSeek(0)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              currentFrame < 600
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            1. Code Diff
          </button>
          <button
            type="button"
            onClick={() => handleSeek(600)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              currentFrame >= 600 && currentFrame < 1200
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            2. UI 3D Zoom
          </button>
          <button
            type="button"
            onClick={() => handleSeek(1200)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              currentFrame >= 1200
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            3. Launch Outro
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#090D16] to-[#0D1322]">
        <div
          className="relative transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black flex items-center justify-center"
          style={{
            width: isVertical ? '340px' : '100%',
            maxWidth: isVertical ? '360px' : '920px',
            aspectRatio: isVertical ? '9/16' : '16/9',
            maxHeight: 'calc(100vh - 280px)',
          }}
        >
          <Player
            ref={playerRef}
            component={GetShippedMasterVideo}
            inputProps={{
              launchPack,
              aspectRatio,
            }}
            durationInFrames={durationInFrames}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            fps={fps}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls={false}
            loop
            autoPlay={false}
          />

          {/* Overlay watermark indicator */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 pointer-events-none">
            {aspectRatio} • {compositionWidth}x{compositionHeight}
          </div>
        </div>
      </div>

      {/* Scrubber & Playback Controls Bar */}
      <div className="p-4 border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-xl flex flex-col gap-3">
        {/* Timeline Scrubber Slider with Scene Color Markers */}
        <div className="flex flex-col gap-1.5">
          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer group">
            {/* Scene Markers Background */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 h-full bg-emerald-500/15 border-r border-white/20" title="Scene 1: Code Diff (0-10s)" />
              <div className="w-1/3 h-full bg-cyan-500/15 border-r border-white/20" title="Scene 2: UI 3D Zoom (10-20s)" />
              <div className="w-1/3 h-full bg-purple-500/15" title="Scene 3: Launch Outro (20-30s)" />
            </div>

            {/* Current playback progress bar */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              style={{ width: `${(currentFrame / durationInFrames) * 100}%` }}
            />

            {/* Interactive range input */}
            <input
              type="range"
              min={0}
              max={durationInFrames - 1}
              value={currentFrame}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Timecode and Scene Labels */}
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-semibold">{formatTimecode(currentFrame)}</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className={currentFrame < 600 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                Code Diff (0-10s)
              </span>
              <span>•</span>
              <span className={currentFrame >= 600 && currentFrame < 1200 ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                UI Zoom (10-20s)
              </span>
              <span>•</span>
              <span className={currentFrame >= 1200 ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                Outro (20-30s)
              </span>
            </div>
            <span>{formatTimecode(durationInFrames)}</span>
          </div>
        </div>

        {/* Playback Button Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play / Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            {/* Restart Button */}
            <button
              type="button"
              onClick={() => handleSeek(0)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Step -1s (60 frames) */}
            <button
              type="button"
              onClick={() => handleSeek(Math.max(0, currentFrame - 60))}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-mono"
            >
              -1s
            </button>

            {/* Step +1s (60 frames) */}
            <button
              type="button"
              onClick={() => handleSeek(Math.min(durationInFrames - 1, currentFrame + 60))}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-mono"
            >
              +1s
            </button>
          </div>

          {/* Right Controls: Aspect Ratio quick toggle & export stats */}
          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 text-xs text-slate-400">
              {[1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded ${
                    playbackSpeed === s ? 'bg-white/15 text-white font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10" />

            {/* Aspect Ratio Switch */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Aspect:</span>
              <button
                type="button"
                onClick={() => onAspectRatioChange(aspectRatio === '16:9' ? '9:16' : '16:9')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold flex items-center gap-1.5 border border-white/10"
              >
                <span>{aspectRatio}</span>
                <Sliders className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
