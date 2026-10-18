'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Network,
  Activity,
  ArrowRight,
  Database,
  Code2,
  CheckCircle2,
  Sliders,
  RefreshCw,
  Layers,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { LaunchPackProps } from '@getshipped/shared-types';

export interface InteractiveRAGScreenProps {
  launchPack: LaunchPackProps;
  onUpdateLaunchPack?: (updated: LaunchPackProps) => void;
  onSwitchToStudio?: () => void;
}

interface DAGNode {
  id: string;
  title: string;
  type: string;
  latencyMs: number;
  status: 'active' | 'complete' | 'fast_path';
  details: {
    description: string;
    memoryAddress?: string;
    throughputQps?: number;
    astType?: string;
    codeSnippet?: string;
  };
}

export const InteractiveRAGScreen: React.FC<InteractiveRAGScreenProps> = ({
  launchPack,
  onUpdateLaunchPack,
  onSwitchToStudio,
}) => {
  const [activeQuery, setActiveQuery] = useState(
    'speculative multi-hop AST graph traversal with zero-copy stream'
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_ring_buffer');
  const [simulatedQps, setSimulatedQps] = useState<number>(48200);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  // Preset queries for developer exploration
  const PRESET_QUERIES = [
    'speculative multi-hop AST graph traversal with zero-copy stream',
    'eliminate cross-encoder reranker bottleneck via precomputed knowledge graph',
    'lock-free SharedArrayBuffer ring stream with 14.2ms TTFT',
  ];

  // DAG Nodes in the autonomous speculative retrieval pipeline
  const DAG_NODES: DAGNode[] = [
    {
      id: 'node_query',
      title: 'Query Ingestion & AST Tokenizer',
      type: 'Ingestion Layer',
      latencyMs: 1.8,
      status: 'complete',
      details: {
        description: 'Parses raw user developer query into semantic AST token tokens and extracts entity references.',
        astType: 'QueryExpressionNode',
        codeSnippet: 'const tokens = astTokenizer.tokenize(query); // 1.8ms',
      },
    },
    {
      id: 'node_router',
      title: 'Speculative AST Router',
      type: 'Decision Classifier',
      latencyMs: 3.4,
      status: 'fast_path',
      details: {
        description: 'Predicts relational entity transitions in parallel with neural vector calculations. Bypasses sequential lookups.',
        astType: 'SpeculativeRouterPredictor',
        throughputQps: 48200,
        codeSnippet: 'const fastPathGraph = await speculativeRouter.predictMultiHop(query);',
      },
    },
    {
      id: 'node_graph_index',
      title: 'Precomputed AST Knowledge Graph',
      type: 'Index Layer',
      latencyMs: 5.1,
      status: 'active',
      details: {
        description: 'Traverses the 2nd-order entity graph derived from git commit history and TypeScript AST relationships.',
        memoryAddress: '0x7FFF0A2',
        throughputQps: 52000,
        astType: 'GraphAdjacencyIndex',
        codeSnippet: 'const matchedNodes = await graphIndex.traverseFastPath(query);',
      },
    },
    {
      id: 'node_ring_buffer',
      title: 'Lock-Free SharedArrayRingBuffer',
      type: 'Streaming Engine',
      latencyMs: 2.3,
      status: 'fast_path',
      details: {
        description: 'Zero-copy ring buffer allocates memory pages shared across Rust and Node.js worker threads.',
        memoryAddress: '0x8A104E0',
        throughputQps: simulatedQps,
        astType: 'SharedArrayRingBuffer<DocumentChunk>',
        codeSnippet: 'const ringBuffer = new SharedArrayRingBuffer<DocumentChunk>(1024);\nvoid fastPathGraph.streamTo(ringBuffer);',
      },
    },
    {
      id: 'node_yield_stream',
      title: '14.2ms Streaming Chunk Yield',
      type: 'Emission Layer',
      latencyMs: 1.6,
      status: 'complete',
      details: {
        description: 'Emits high-confidence document chunks directly into the LLM context window at sub-15ms TTFT.',
        throughputQps: 48200,
        astType: 'AsyncGenerator<DocumentChunk>',
        codeSnippet: 'for await (const chunk of ringBuffer.consumeSpeculative()) {\n  if (chunk.confidenceScore > 0.94) yield chunk;\n}',
      },
    },
  ];

  const selectedNode = DAG_NODES.find((n) => n.id === selectedNodeId) || DAG_NODES[3];

  const handleRunTraversal = () => {
    setIsTraversing(true);
    setTimeout(() => {
      setIsTraversing(false);
    }, 450);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] text-slate-100 overflow-y-auto">
      {/* Top Banner: RAG System Status & Telemetry */}
      <div className="p-6 border-b border-white/10 bg-[#0B0E17]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
            <Cpu className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Autonomous Speculative RAG Retrieval Engine
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                FAST-PATH ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live AST graph precomputation • Zero-copy ring buffer streams • Sub-15ms TTFT
            </p>
          </div>
        </div>

        {/* Live Cluster Metrics Header */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">p99 Latency:</span>
            <span className="text-emerald-400 font-mono font-bold">14.2 ms (-84%)</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
            <span className="text-slate-400">Throughput:</span>
            <span className="text-cyan-400 font-mono font-bold">{simulatedQps.toLocaleString()} QPS</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
            <span className="text-slate-400">Cache Hit Rate:</span>
            <span className="text-purple-400 font-mono font-bold">94.6%</span>
          </div>

          {onSwitchToStudio && (
            <button
              type="button"
              onClick={onSwitchToStudio}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all cursor-pointer"
            >
              <span>View in 60fps Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Interactive Query Sandbox */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Speculative Query Ingestion</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              AST Token Match: 98.4% Confidence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                className="w-full bg-slate-950/80 rounded-xl px-4 py-3 text-sm font-mono text-emerald-300 border border-white/10 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                placeholder="Enter technical developer query..."
              />
            </div>

            <button
              type="button"
              onClick={handleRunTraversal}
              disabled={isTraversing}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTraversing ? 'animate-spin' : ''}`} />
              <span>{isTraversing ? 'Traversing DAG...' : 'Simulate Traversal'}</span>
            </button>
          </div>

          {/* Preset technical queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Presets:</span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveQuery(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-mono transition-colors"
              >
                {preset.slice(0, 42)}...
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Visual Knowledge Graph DAG */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Interactive Speculative Pipeline DAG (Click Node to Inspect Memory & AST)
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Total End-to-End Latency: 14.2ms
            </span>
          </div>

          {/* Clickable Pipeline Flow Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-2">
            {DAG_NODES.map((node, index) => {
              const isSelected = node.id === selectedNodeId;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/15'
                      : 'bg-slate-950/60 border-white/10 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      0{index + 1}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        node.status === 'fast_path'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {node.latencyMs}ms
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white leading-snug">{node.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{node.type}</div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{isSelected ? '● INSPECTING' : 'CLICK TO VIEW'}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Real-Time Inspector Drawer */}
          <div className="mt-2 p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 shadow-inner flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Selected Primitive: {selectedNode.title}</span>
              </div>
              {selectedNode.details.memoryAddress && (
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  Buffer Memory: {selectedNode.details.memoryAddress}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedNode.details.description}
            </p>

            {/* AST Code Snippet */}
            {selectedNode.details.codeSnippet && (
              <div className="p-3.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{selectedNode.details.codeSnippet}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Live Benchmark Comparison & Retrieved Chunks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Latency Comparison Bars */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Retrieval Latency Benchmark (p99)
              </h4>
              <span className="text-xs font-mono text-emerald-400 font-bold">-84% Drop</span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Legacy Vector DB (Brute-Force)</span>
                  <span className="font-mono text-red-400">186 ms</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500/80 w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Hybrid Cross-Encoder Scan</span>
                  <span className="font-mono text-amber-400">114 ms</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500/80 w-[60%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-emerald-400 font-bold mb-1">
                  <span>HyperScale v2 (Speculative RingBuffer)</span>
                  <span className="font-mono">14.2 ms</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-sm shadow-emerald-500/30">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 w-[12%]" />
                </div>
              </div>
            </div>

            {/* Interactive QPS slider */}
            <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Simulated Cluster Load:</span>
                <span className="font-mono text-cyan-300 font-bold">{simulatedQps.toLocaleString()} QPS</span>
              </div>
              <input
                type="range"
                min={5000}
                max={50000}
                step={1000}
                value={simulatedQps}
                onChange={(e) => setSimulatedQps(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Retrieved AST Code Chunks */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Live Retrieved AST Code Chunks (From Commit #8f4e2b1)</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">3 chunks cited</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  id: 'chunk_1',
                  symbol: 'retrieveContextStream',
                  file: 'packages/core/src/retrieval/graphPipeline.ts',
                  confidence: 0.985,
                  snippet: 'export async function* retrieveContextStream(query: string): AsyncGenerator<DocumentChunk>',
                },
                {
                  id: 'chunk_2',
                  symbol: 'SharedArrayRingBuffer',
                  file: 'packages/core/src/buffers/ringBuffer.ts',
                  confidence: 0.942,
                  snippet: 'const ringBuffer = new SharedArrayRingBuffer<DocumentChunk>(1024);',
                },
                {
                  id: 'chunk_3',
                  symbol: 'predictMultiHop',
                  file: 'packages/core/src/router/speculativeRouter.ts',
                  confidence: 0.918,
                  snippet: 'speculativeRouter.predictMultiHop(query)',
                },
              ].map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{c.symbol}</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      Score: {c.confidence}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{c.file}</div>
                  <div className="p-2 rounded bg-black/40 font-mono text-[11px] text-cyan-200 overflow-x-auto">
                    <code>{c.snippet}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
