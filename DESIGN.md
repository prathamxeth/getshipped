# GetShipped Design System Specification (DESIGN.md)

> Synthesized from **awesome-design-md** (Linear + Vercel + Raycast Developer Craft Triad), **Nutlope Hallmark** (Anti-AI-Slop Governance), and **Impeccable Style** (Deterministic Design Tokens).

---

## 1. Design Philosophy: The Developer Craft Triad

GetShipped rejects generic "AI slop" (cliché centered headers, purple-to-pink pastel gradients, uncalibrated padding, and decorative-only cards). It implements a high-density, action-oriented craft standard built on three pillars:

1. **Linear’s Spatial Geometry & Restraint:**
   - Deep, matte, near-zero reflectance surfaces (`#07090E`, `#0B0E17`, `#111625`).
   - Hairline 1px borders (`rgba(255, 255, 255, 0.08)`) with subtle directional gradient highlights.
   - Spatial continuity: All modal views, drawers, and panels share consistent elevation layers.
   - Keyboard shortcuts prominently integrated into the interface.

2. **Vercel’s Monospaced Data Density & Latency Focus:**
   - Tabular numerals and monospaced badges (`font-mono`, `JetBrains Mono` / `Geist Mono`).
   - Live telemetry and streaming indicators (TTFT, QPS, RingBuffer memory addresses, AST confidence scores).
   - High contrast ratios (WCAG AAA compliant, text contrast > 7:1 against dark backgrounds).

3. **Raycast’s Tactile Action Density:**
   - Compact, high-yield layout where every pixel serves user action.
   - Purposeful micro-animations: 150ms snappy spring curves, active selection rings, and glowing pulse beacons.
   - Color is functional, never decorative:
     - **Emerald (`#10B981`)**: Speculative fast-path, 100% verified status, low latency.
     - **Cyan (`#06B6D4` / `#38BDF8`)**: Live AST stream, active camera gimbal, Twitter/X broadcast.
     - **Amber (`#F59E0B`)**: Cache warm-up, character count proximity warning.
     - **Purple / Indigo (`#818CF8`)**: Hashnode GraphQL, GitHub PR merge.

---

## 2. Hallmark Anti-Slop Guardrails

- **Rule 1: No Generic Centered Cards:** Use asymmetric, high-yield workspace splits. Left side houses live video physics & RAG intelligence; right side houses multi-target code & copy review.
- **Rule 2: Zero Placeholder Metrics:** Every displayed metric (14.2ms TTFT, 48,200 QPS, 94.6% cache hit rate, `#8f4e2b1`) is bound to actual AST code structures and live state.
- **Rule 3: Live Visual Architecture:** Architecture diagrams are rendered dynamically via interactive SVG flowcharts and Mermaid.js, not static images.
- **Rule 4: One-Tab All-In-One Workflow:** The developer never leaves the primary browser tab or context to run external terminal commands.

---

## 3. Impeccable Design Tokens

### Color Palette
```css
:root {
  /* Surfaces */
  --surface-canvas: #07090E;
  --surface-panel: #0D121F;
  --surface-elevated: #131A2B;
  --surface-glass: rgba(13, 18, 31, 0.82);
  --surface-subtle: rgba(255, 255, 255, 0.03);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.16);
  --border-focus: rgba(16, 185, 129, 0.5);

  /* Accents */
  --accent-emerald: #10B981;
  --accent-emerald-glow: rgba(16, 185, 129, 0.25);
  --accent-cyan: #06B6D4;
  --accent-cyan-glow: rgba(6, 182, 212, 0.25);
  --accent-indigo: #6366F1;
  --accent-amber: #F59E0B;
  --accent-red: #EF4444;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Elevation Shadows */
  --shadow-elevation: 0 20px 50px -10px rgba(0, 0, 0, 0.85);
  --shadow-glow-emerald: 0 0 30px rgba(16, 185, 129, 0.25);
  --shadow-glow-cyan: 0 0 30px rgba(6, 182, 212, 0.25);
}
```

---

## 4. Single-Tab Unified Workflow Hierarchy

The complete developer journey operates within **a single unified studio view**:
1. **Developer Profile & Onboarding:** Personality, technical voice calibration, connected repository, and AST ingestion.
2. **Interactive RAG Screen System:** Query routing sandbox, clickable knowledge graph DAG, chunk inspector, and latency comparative matrix.
3. **Remotion v4 60fps Video Player:** Real-time 60fps playback, 16:9 / 9:16 aspect ratio switcher, timeline scrubber with scene markers.
4. **Omnichannel Approval Editors:** X Thread, LinkedIn, Hashnode Markdown with live Mermaid preview, GitHub README diff.
5. **In-Browser Video Export & Dispatch:** Instant MP4 rendering directly in the browser and Restate durable orchestration.
