import React from 'react';

export interface SimulatedAppUIProps {
  currentFrame: number;
  activeElement?: string;
  metrics?: {
    latencyMs: number;
    qps: number;
    cacheHitRate: number;
    accuracyScore: number;
  };
}

export const SimulatedAppUI: React.FC<SimulatedAppUIProps> = ({
  currentFrame,
  activeElement,
  metrics = {
    latencyMs: 14.2,
    qps: 48200,
    cacheHitRate: 94.6,
    accuracyScore: 99.1,
  },
}) => {
  // Sinusoidal pulse for live stream animation
  const streamPulse = Math.sin(currentFrame * 0.15) * 0.5 + 0.5;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Top Navbar */}
      <div
        id="nav-dashboard"
        style={{
          height: 64,
          backgroundColor: '#0F172A',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: activeElement === 'nav-dashboard' ? '0 0 25px rgba(16, 185, 129, 0.3)' : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
              color: '#090D16',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>HyperScale RAG Engine</span>
              <span style={{ fontSize: 11, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: 9999, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                v2.4.0-prod
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Autonomous Speculative Graph Retrieval</div>
          </div>
        </div>

        {/* Live Cluster Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            id="cache-hit-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: activeElement === 'cache-hit-pill' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeElement === 'cache-hit-pill' ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Cache Hit Rate:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>{metrics.cacheHitRate}%</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Cluster Load:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#38BDF8' }}>{metrics.qps.toLocaleString()} QPS</span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ⚡ {metrics.latencyMs} ms TTFT
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: 260,
            backgroundColor: '#0B0F19',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px 6px' }}>
            Telemetry Views
          </div>
          {[
            { name: 'RAG Pipeline Visualizer', active: true, icon: '⚡' },
            { name: 'Speculative Graph Index', active: false, icon: '🕸️' },
            { name: 'Zero-Copy RingBuffer', active: false, icon: '🔄' },
            { name: 'Latency Heatmap', active: false, icon: '📊' },
            { name: 'Audit & Safety Logs', active: false, icon: '🛡️' },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: item.active ? 600 : 500,
                backgroundColor: item.active ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: item.active ? '#10B981' : '#94A3B8',
                border: item.active ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Center Canvas */}
        <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden' }}>
          {/* Query Bar */}
          <div
            id="query-input"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#111827',
              borderRadius: 12,
              padding: '14px 20px',
              border: activeElement === 'query-input' ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: activeElement === 'query-input' ? '0 0 35px rgba(16, 185, 129, 0.35)' : 'none',
              gap: 14,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 18, color: '#10B981' }}>🔍</span>
            <div style={{ flex: 1, fontSize: 16, color: '#F1F5F9', fontWeight: 500, fontFamily: 'monospace' }}>
              "Find multi-hop causal relations in distributed commit graph..."
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              FAST-PATH PREDICTED (14.2ms)
            </div>
          </div>

          {/* Interactive Pipeline Graph & Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, flex: 1 }}>
            {/* Visual Architecture Nodes */}
            <div
              id="graph-node-preview"
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 14,
                border: activeElement === 'graph-node-preview' ? '2px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: activeElement === 'graph-node-preview' ? '0 0 35px rgba(56, 189, 248, 0.35)' : 'none',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#E2E8F0' }}>Live Graph Traversal DAG</span>
                <span style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>Active Ring Buffer Streams: 8</span>
              </div>

              {/* Connected Pipeline Nodes */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 110, height: 80, borderRadius: 10, backgroundColor: '#1E293B', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: 20 }}>📥</span>
                    <span style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>User Query</span>
                  </div>
                </div>

                <div style={{ height: 2, flex: 1, backgroundColor: '#38BDF8', margin: '0 8px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -4, left: `${streamPulse * 100}%`, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38BDF8', boxShadow: '0 0 10px #38BDF8' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 130, height: 80, borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', marginTop: 4 }}>Speculative AST</span>
                  </div>
                </div>

                <div style={{ height: 2, flex: 1, backgroundColor: '#10B981', margin: '0 8px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -4, left: `${(1 - streamPulse) * 100}%`, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                </div>

                <div id="stream-buffer-card" style={{ textAlign: 'center' }}>
                  <div style={{ width: 140, height: 80, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.2)', border: activeElement === 'stream-buffer-card' ? '2px solid #10B981' : '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: activeElement === 'stream-buffer-card' ? '0 0 25px rgba(16, 185, 129, 0.5)' : 'none' }}>
                    <span style={{ fontSize: 20 }}>🔄</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginTop: 4 }}>RingBuffer Stream</span>
                  </div>
                </div>

                <div style={{ height: 2, flex: 1, backgroundColor: '#A855F7', margin: '0 8px' }} />

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 120, height: 80, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: 20 }}>🚀</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#A855F7', marginTop: 4 }}>Early Chunk Yield</span>
                  </div>
                </div>
              </div>

              {/* Streaming console logs */}
              <div
                style={{
                  marginTop: 'auto',
                  backgroundColor: '#090D16',
                  borderRadius: 8,
                  padding: 16,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ color: '#10B981' }}>[+14.2ms] Speculative graph fast-path match: 18 relational AST entities indexed</div>
                <div style={{ color: '#38BDF8' }}>[+14.8ms] SharedArrayRingBuffer: Stream opened at page 0x7FFF0A2</div>
                <div style={{ color: '#C0CAF5' }}>[+15.2ms] Early confidence score 0.985: chunk emitted to LLM without rerank delay</div>
              </div>
            </div>

            {/* Performance Benchmark Matrix Card */}
            <div
              id="benchmark-chart"
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 14,
                border: activeElement === 'benchmark-chart' ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: activeElement === 'benchmark-chart' ? '0 0 35px rgba(16, 185, 129, 0.35)' : 'none',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: '#E2E8F0' }}>Latency Comparison (p99)</div>

              {/* Bar 1: Legacy Vector Scan */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>
                  <span>Legacy Vector Store</span>
                  <span>186 ms</span>
                </div>
                <div style={{ height: 14, backgroundColor: '#1E293B', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: '#EF4444' }} />
                </div>
              </div>

              {/* Bar 2: Hybrid Reranker */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>
                  <span>Hybrid Cross-Encoder</span>
                  <span>114 ms</span>
                </div>
                <div style={{ height: 14, backgroundColor: '#1E293B', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: '58%', height: '100%', backgroundColor: '#F59E0B' }} />
                </div>
              </div>

              {/* Bar 3: HyperScale v2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#10B981', fontWeight: 700, marginBottom: 4 }}>
                  <span>HyperScale RAG v2 (Speculative)</span>
                  <span>14.2 ms (-84%)</span>
                </div>
                <div style={{ height: 14, backgroundColor: '#1E293B', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: '12%', height: '100%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                </div>
              </div>

              {/* Key Value Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 'auto' }}>
                <div style={{ padding: 14, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>ACCURACY</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#38BDF8', marginTop: 2 }}>{metrics.accuracyScore}%</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: 11, color: '#10B981' }}>THROUGHPUT</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#10B981', marginTop: 2 }}>48.2k QPS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
