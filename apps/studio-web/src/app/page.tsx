'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { LaunchPackProps, RestateDispatchPayload } from '@getshipped/shared-types';
import { mockLaunchPack } from '@getshipped/remotion-studio';
import { StudioHeader } from '../components/layout/StudioHeader';
import { VideoPlayerPane } from '../components/video/VideoPlayerPane';
import { ApprovalTabs } from '../components/editors/ApprovalTabs';
import { RestateDispatchModal } from '../components/modals/RestateDispatchModal';
import { InteractiveRAGScreen } from '../components/rag/InteractiveRAGScreen';
import { DeveloperOnboardingModal } from '../components/onboarding/DeveloperOnboardingModal';

export default function ApprovalStudioPage() {
  const [launchPack, setLaunchPack] = useState<LaunchPackProps>(mockLaunchPack);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [activeView, setActiveView] = useState<'studio' | 'rag'>('studio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleAspectRatioChange = (ratio: '16:9' | '9:16') => {
    setAspectRatio(ratio);
    setLaunchPack((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        aspectRatio: ratio,
      },
    }));
  };

  const handleCopywritingChange = (updatedCopywriting: LaunchPackProps['copywriting']) => {
    setLaunchPack((prev) => ({
      ...prev,
      copywriting: updatedCopywriting,
    }));
  };

  const dispatchPayload: RestateDispatchPayload = {
    launchPackId: launchPack.id,
    version: launchPack.version,
    approvedBy: launchPack.author.name,
    channels: ['remotion_render', 'x_thread', 'linkedin', 'hashnode', 'github_pr'],
    videoConfig: {
      aspectRatio,
      fps: 60,
      codec: 'h264',
    },
    editedCopy: {
      xThread: launchPack.copywriting.xThread.map((t) => ({
        tweetNumber: t.tweetNumber,
        text: t.text,
      })),
      linkedInPost: {
        headline: launchPack.copywriting.linkedInPost.headline,
        body: launchPack.copywriting.linkedInPost.body,
      },
      hashnodeMarkdown: {
        title: launchPack.copywriting.hashnodeMarkdown.title,
        content: launchPack.copywriting.hashnodeMarkdown.content,
      },
      gitHubReadmeDiff: {
        commitMessage: launchPack.copywriting.gitHubReadmeDiff.commitMessage,
        afterSnippet: launchPack.copywriting.gitHubReadmeDiff.afterSnippet,
      },
    },
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-canvas">
      {/* Top Application Header with 1-Tab Mode Switcher & Export Controls */}
      <StudioHeader
        launchPack={launchPack}
        activeView={activeView}
        onViewChange={setActiveView}
        aspectRatio={aspectRatio}
        onAspectRatioChange={handleAspectRatioChange}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onApproveAndShip={() => setIsModalOpen(true)}
      />

      {/* Main Content Area: 1-Tab Studio vs Interactive RAG Intelligence */}
      <main className="flex-1 overflow-hidden relative">
        {activeView === 'studio' ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Pane: Remotion 60fps Video Player Studio (5 cols on wide screens) */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <VideoPlayerPane
                launchPack={launchPack}
                aspectRatio={aspectRatio}
                onAspectRatioChange={handleAspectRatioChange}
              />
            </div>

            {/* Right Pane: Omnichannel Tabbed Content Editors (7 cols on wide screens) */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <ApprovalTabs
                copywriting={launchPack.copywriting}
                onChange={handleCopywritingChange}
              />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            <InteractiveRAGScreen
              launchPack={launchPack}
              onUpdateLaunchPack={setLaunchPack}
              onSwitchToStudio={() => setActiveView('studio')}
            />
          </div>
        )}
      </main>

      {/* Restate Dispatch Orchestration Modal */}
      <RestateDispatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payload={dispatchPayload}
      />

      {/* Developer Onboarding & Preference Modal */}
      <DeveloperOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        launchPack={launchPack}
        onSaveProfile={setLaunchPack}
      />
    </div>
  );
}
