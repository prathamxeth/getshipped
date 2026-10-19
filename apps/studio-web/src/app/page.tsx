'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DeveloperOnboarding } from '../components/DeveloperOnboarding';
import { PostEngineStudio } from '../components/PostEngineStudio';

export default function Home() {
  const [scene, setScene] = useState<'onboarding' | 'studio'>('onboarding');
  const [isLeaving, setIsLeaving] = useState(false);

  const [repo, setRepo] = useState('getshipped/core');
  const [author, setAuthor] = useState('@developer');
  const [commit, setCommit] = useState('feat: instant streaming search API');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['x', 'linkedin', 'github', 'video']);

  const castleVideoRef = useRef<HTMLVideoElement | null>(null);
  const skyVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleLaunch = () => {
    if (isLeaving) return;
    setIsLeaving(true);

    // Start sky video
    skyVideoRef.current?.play().catch(() => {});

    setTimeout(() => {
      setScene('studio');
      setIsLeaving(false);
      castleVideoRef.current?.pause();
    }, 520);
  };

  const handleReturnToOnboarding = () => {
    setScene('onboarding');
    skyVideoRef.current?.pause();
    castleVideoRef.current?.play().catch(() => {});
  };

  // Keyboard shortcuts (/ to top, Space to play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        const scroller = document.getElementById('scrollContainer');
        scroller?.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (e.code === 'Space') {
        e.preventDefault();
        const playBtn = document.getElementById('playBtn');
        playBtn?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* SCENE 1: DEVELOPER ONBOARDING */}
      <div style={{ display: scene === 'studio' && !isLeaving ? 'none' : 'block' }}>
        <DeveloperOnboarding
          repo={repo}
          onRepoChange={setRepo}
          author={author}
          onAuthorChange={setAuthor}
          commit={commit}
          onCommitChange={setCommit}
          selectedChannels={selectedChannels}
          onToggleChannel={handleToggleChannel}
          onLaunch={handleLaunch}
          isLeaving={isLeaving}
          videoRef={castleVideoRef}
        />
      </div>

      {/* SCENE 2: POST ENGINE STUDIO */}
      {(scene === 'studio' || isLeaving) && (
        <PostEngineStudio
          repo={repo}
          author={author}
          commit={commit}
          selectedChannels={selectedChannels}
          onReturnToOnboarding={handleReturnToOnboarding}
          videoRef={skyVideoRef}
        />
      )}
    </>
  );
}
