# GetShipped ⚡

> **Automated Developer RAG Agent & Omnichannel Launch Platform**  
> Lead Frontend & Motion Graphics Architecture (Developer A)

GetShipped bridges code commits with viral developer marketing. It monitors repository changes, analyzes AST diffs using speculative RAG models, and autonomously compiles a complete launch pack: a **60fps Remotion video composition**, **word-level kinetic captions**, an **X (Twitter) technical thread**, a **LinkedIn thought-leadership post**, a **Hashnode/Dev.to technical deep-dive (with live Mermaid.js architecture diagrams)**, and an updated **GitHub README pull request**.

---

## Architecture Overview

```
getshipped/
├── packages/
│   ├── shared-types/             # Zod Schemas & TypeScript interfaces
│   │   ├── src/schemas/launchPack.ts       # Master LaunchPackPropsSchema
│   │   ├── src/schemas/codeDiff.ts         # CodeDiffScenePropsSchema
│   │   ├── src/schemas/cursorKeyframe.ts   # 3D Cursor & Keyframe Schema
│   │   ├── src/schemas/captions.ts         # Kinetic Subtitles & Word Timestamps
│   │   ├── src/schemas/social.ts           # X, LinkedIn, Hashnode, README Diff
│   │   └── src/schemas/restateDispatch.ts  # Restate Saga Orchestration Payload
│   │
│   └── remotion-studio/          # Remotion v4 60fps Video Engine
│       ├── src/Root.tsx                    # Compositions (16:9 & 9:16)
│       ├── src/data/mockLaunchPack.json    # Validated Launch Pack Mock Data
│       ├── src/compositions/GetShippedMasterVideo.tsx # 30s Master Orchestrator
│       ├── src/scenes/CodeDiffScene.tsx    # macOS Shiki Code Morphing Scene
│       ├── src/scenes/UICursorZoomScene.tsx# 3D Tilt & Cursor Keyframe Zoom Scene
│       ├── src/scenes/KineticCaptionsOverlay.tsx # Word-level High-energy Subtitles
│       ├── src/components/SimulatedAppUI.tsx    # Interactive RAG Dashboard Canvas
│       ├── src/components/MacWindowFrame.tsx   # macOS Traffic Lights Dark Frame
│       ├── src/components/CursorPointer.tsx    # SVG Cursor with Click Shockwaves
│       └── src/utils/springPhysics.ts      # 60fps Spring Interpolators
│
└── apps/
    └── studio-web/               # Next.js 15 Approval Studio Dashboard
        ├── src/app/page.tsx                # Split-Screen Master Dashboard
        ├── src/app/api/ship/route.ts       # Restate Dispatch API Handler
        ├── src/components/layout/StudioHeader.tsx
        ├── src/components/video/VideoPlayerPane.tsx # @remotion/player + Scrubber
        ├── src/components/editors/ApprovalTabs.tsx  # Tabbed Omnichannel Review
        ├── src/components/editors/XThreadEditor.tsx # Tweet Cards + Char Counter
        ├── src/components/editors/LinkedInEditor.tsx
        ├── src/components/editors/HashnodeBlogEditor.tsx # Markdown + Mermaid Live
        ├── src/components/editors/MermaidPreview.tsx     # SVG Flowchart Renderer
        ├── src/components/editors/GitDiffEditor.tsx      # Unified & Split Diff Viewer
        └── src/components/modals/RestateDispatchModal.tsx # Restate Execution Modal
```

---

## Core Technologies

- **Video Rendering:** [Remotion v4](https://remotion.dev) (`remotion`, `@remotion/player`, `@remotion/effects`)
- **Web Framework:** Next.js 15 (App Router, Server Actions, React 19)
- **Validation:** Zod Schema Validation (`@getshipped/shared-types`)
- **Syntax & Diagrams:** Shiki tokenization & Mermaid.js SVG architecture flowcharts
- **Styling:** Tailwind CSS with custom OLED Glassmorphic tokens (`#090D16`, `#0F172A`, `#10B981`, `#06B6D4`)
- **Durable Orchestration:** Restate event-driven sagas with compensation and rollback safety

---

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Next.js Approval Studio
```bash
pnpm --filter @getshipped/studio-web run dev
```
Open [http://localhost:3000](http://localhost:3000) to review the live split-screen dashboard.

### 3. Run Remotion Video Studio Preview
```bash
pnpm --filter @getshipped/remotion-studio run start
```
Launches the Remotion v4 studio on [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) for frame-by-frame 60fps rendering inspection.

### 4. Render 60fps Master Video MP4
```bash
# Render 16:9 Landscape for X & YouTube
pnpm --filter @getshipped/remotion-studio remotion render src/index.ts GetShippedMasterVideo-16x9 out/master-16x9.mp4

# Render 9:16 Vertical for Shorts & Reels
pnpm --filter @getshipped/remotion-studio remotion render src/index.ts GetShippedMasterVideo-9x16 out/master-9x16.mp4
```
