import React from 'react';
import { Composition } from 'remotion';
import { GetShippedMasterVideo } from './compositions/GetShippedMasterVideo';
import { CodeDiffScene } from './scenes/CodeDiffScene';
import { UICursorZoomScene } from './scenes/UICursorZoomScene';
import { mockLaunchPack } from './data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 16:9 Video Composition (X / YouTube Landscape) */}
      <Composition<any, any>
        id="GetShippedMasterVideo-16x9"
        component={GetShippedMasterVideo}
        durationInFrames={1800}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          launchPack: mockLaunchPack,
          aspectRatio: '16:9',
        }}
      />

      {/* Master 9:16 Video Composition (Shorts / Reels / TikTok Vertical) */}
      <Composition<any, any>
        id="GetShippedMasterVideo-9x16"
        component={GetShippedMasterVideo}
        durationInFrames={1800}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          launchPack: mockLaunchPack,
          aspectRatio: '9:16',
        }}
      />

      {/* Standalone Scene: Code Diff Morphing (16:9) */}
      <Composition<any, any>
        id="Scene-CodeDiff-16x9"
        component={CodeDiffScene}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          sceneData: mockLaunchPack.video.scenes.codeDiff,
          aspectRatio: '16:9',
        }}
      />

      {/* Standalone Scene: UI 3D Cursor Zoom (16:9) */}
      <Composition<any, any>
        id="Scene-UICursorZoom-16x9"
        component={UICursorZoomScene}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          sceneData: mockLaunchPack.video.scenes.uiCursorZoom,
          aspectRatio: '16:9',
        }}
      />
    </>
  );
};
