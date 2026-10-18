'use client';

import React, { useEffect, useState, useId } from 'react';
import { Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export interface MermaidPreviewProps {
  chartCode: string;
  title?: string;
}

interface ParsedNode {
  id: string;
  label: string;
}

interface ParsedEdge {
  from: string;
  to: string;
  label?: string;
}

/**
 * Parses simple mermaid flowchart code like:
 * graph TD
 *   A[User Query] --> B[Speculative AST Router]
 *   B -->|Fast Path| C[Precomputed Knowledge Graph]
 */
function parseMermaidFlowchart(code: string) {
  const nodesMap = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];

  const lines = code.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('graph') || trimmed.startsWith('flowchart') || trimmed.startsWith('%%')) {
      continue;
    }

    // Match patterns like: A[Label] -->|Edge Label| B[Another Label] or A --> B
    const edgeRegex = /([A-Za-z0-9_]+)(?:\[(.*?)\])?\s*-->\s*(?:\|(.*?)\|)?\s*([A-Za-z0-9_]+)(?:\[(.*?)\])?/;
    const match = trimmed.match(edgeRegex);

    if (match) {
      const [, fromId, fromLabel, edgeLabel, toId, toLabel] = match;

      if (!nodesMap.has(fromId)) {
        nodesMap.set(fromId, { id: fromId, label: fromLabel || fromId });
      } else if (fromLabel) {
        nodesMap.get(fromId)!.label = fromLabel;
      }

      if (!nodesMap.has(toId)) {
        nodesMap.set(toId, { id: toId, label: toLabel || toId });
      } else if (toLabel) {
        nodesMap.get(toId)!.label = toLabel;
      }

      edges.push({
        from: fromId,
        to: toId,
        label: edgeLabel?.trim(),
      });
    } else {
      // Standalone node: A[Label]
      const nodeMatch = trimmed.match(/([A-Za-z0-9_]+)\[(.*?)\]/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        nodesMap.set(id, { id, label });
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

export const MermaidPreview: React.FC<MermaidPreviewProps> = ({ chartCode, title }) => {
  const [parsed, setParsed] = useState<{ nodes: ParsedNode[]; edges: ParsedEdge[] }>({ nodes: [], edges: [] });
  const uniqueId = useId();

  useEffect(() => {
    try {
      const result = parseMermaidFlowchart(chartCode);
      setParsed(result);
    } catch {
      // Fallback
    }
  }, [chartCode]);

  const { nodes, edges } = parsed;

  // Compute layout positions for nodes
  const nodeWidth = 190;
  const nodeHeight = 54;
  const spacingY = 90;
  const startX = 260;
  const startY = 50;

  // Map each node ID to calculated coordinates
  const nodePositions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, idx) => {
    // If branch node, spread horizontally
    const isBranch = idx >= 1 && idx <= 2;
    const x = isBranch ? (idx === 1 ? startX - 130 : startX + 130) : startX;
    const y = startY + idx * spacingY;
    nodePositions.set(node.id, { x, y });
  });

  const totalHeight = Math.max(340, startY + nodes.length * spacingY + 40);

  return (
    <div className="flex flex-col gap-2 my-4 rounded-xl border border-white/10 bg-[#0B0F19] overflow-hidden shadow-xl">
      {/* Chart Title Header */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            {title || 'Architecture Flow Diagram (Mermaid.js Live)'}
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
          SVG Flowchart
        </span>
      </div>

      {/* SVG Interactive Architecture Graph Render */}
      <div className="p-4 flex items-center justify-center overflow-x-auto">
        <svg
          width="100%"
          height={totalHeight}
          viewBox={`0 0 540 ${totalHeight}`}
          className="max-w-[540px] select-none"
        >
          <defs>
            <marker
              id={`arrow-${uniqueId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
            </marker>
            <linearGradient id={`node-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Render connecting edge lines */}
          {edges.map((edge, eIdx) => {
            const p1 = nodePositions.get(edge.from);
            const p2 = nodePositions.get(edge.to);
            if (!p1 || !p2) return null;

            const x1 = p1.x;
            const y1 = p1.y + nodeHeight / 2;
            const x2 = p2.x;
            const y2 = p2.y - nodeHeight / 2;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={`edge-${eIdx}`}>
                <path
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd={`url(#arrow-${uniqueId})`}
                  opacity={0.8}
                />
                {edge.label && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-42"
                      y="-10"
                      width="84"
                      height="20"
                      rx="4"
                      fill="#090D16"
                      stroke="rgba(255,255,255,0.15)"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#38BDF8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            return (
              <g key={node.id} transform={`translate(${pos.x - nodeWidth / 2}, ${pos.y - nodeHeight / 2})`}>
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="10"
                  fill={`url(#node-grad-${uniqueId})`}
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="1.5"
                  filter="drop-shadow(0 6px 16px rgba(0,0,0,0.5))"
                />
                {/* Node Label Text */}
                <text
                  x={nodeWidth / 2}
                  y={nodeHeight / 2 + 4}
                  fill="#F8FAFC"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
