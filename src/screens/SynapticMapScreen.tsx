import React, { useState } from 'react';
import { useNova } from '../context/NovaStateContext';

export const SynapticMapScreen: React.FC = () => {
  const {
    theme,
    nodes,
    selectedNode,
    selectNode,
    forgetNode,
    editNodeSemantics,
    addMemoryAtom,
    telemetry,
    addToast,
  } = useNova();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [newAtomLabel, setNewAtomLabel] = useState<string>('');
  const [newAtomQuote, setNewAtomQuote] = useState<string>('');

  const handleForget = () => {
    if (selectedNode.id === 'nova-core') {
      addToast('Cannot Purge Root', 'NOVA CORE is the root immutable orchestrator.', 'warning');
      return;
    }
    const confirmed = window.confirm(
      `Purge memory atom "${selectedNode.label}" (${selectedNode.hash}) from local HNSW vector index?`
    );
    if (confirmed) {
      forgetNode(selectedNode.id);
    }
  };

  const handleEditSemantics = () => {
    const updated = window.prompt(
      'Edit semantic formulation for memory atom:',
      selectedNode.quote.replace(/“|”/g, '')
    );
    if (updated !== null && updated.trim()) {
      editNodeSemantics(selectedNode.id, updated.trim());
    }
  };

  const handleCreateAtom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAtomLabel.trim() || !newAtomQuote.trim()) return;
    addMemoryAtom(newAtomLabel.trim(), newAtomQuote.trim());
    setNewAtomLabel('');
    setNewAtomQuote('');
    setShowAddDialog(false);
  };

  const filteredNodes = nodes.filter((n) =>
    searchQuery
      ? n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sublabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.quote.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden font-sans">
      {/* ================= TOP RIGHT FLOATING SEARCH & FILTER PILL ================= */}
      <div className="absolute right-6 top-6 z-20 pointer-events-auto flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-2xl text-xs"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textSecondary,
          }}
        >
          <i className="fa-solid fa-magnifying-glass text-[11px] opacity-60" style={{ color: theme.palette.accent }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 18.4k Synapses..."
            className="bg-transparent outline-none w-44 text-xs font-sans placeholder:opacity-40"
            style={{ color: theme.palette.textPrimary }}
          />
          <kbd
            className="text-[9px] px-1.5 py-0.5 rounded border font-mono opacity-50"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            ⌘K
          </kbd>
        </div>

        <button
          onClick={() => setShowAddDialog(true)}
          className="px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-2xl text-xs flex items-center gap-1.5 font-medium transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: theme.palette.accent,
            borderColor: theme.palette.accentBorder,
            color: theme.isDark ? '#090a0d' : '#ffffff',
          }}
        >
          <i className="fa-solid fa-plus text-[10px]" />
          <span>Add Atom</span>
        </button>
      </div>

      {/* Add Memory Atom Modal Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <form
            onSubmit={handleCreateAtom}
            className="w-full max-w-md p-5 rounded-3xl border shadow-2xl space-y-3.5"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: theme.palette.glassBorder }}>
              <h3 className="text-sm font-medium" style={{ color: theme.palette.textPrimary }}>
                Index New Memory Atom
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: theme.palette.textMuted }}>
                Atom Label
              </label>
              <input
                type="text"
                value={newAtomLabel}
                onChange={(e) => setNewAtomLabel(e.target.value)}
                placeholder="e.g. Distributed Consensus Engine"
                required
                className="w-full text-xs p-2 rounded-xl border bg-transparent outline-none font-sans"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: theme.palette.textMuted }}>
                Semantic Formulation
              </label>
              <textarea
                value={newAtomQuote}
                onChange={(e) => setNewAtomQuote(e.target.value)}
                placeholder="Formulation statement describing memory context..."
                required
                rows={3}
                className="w-full text-xs p-2 rounded-xl border bg-transparent outline-none font-sans"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="px-3 py-1.5 rounded-xl border text-xs"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-medium border"
                style={{
                  backgroundColor: theme.palette.accent,
                  color: theme.isDark ? '#000' : '#fff',
                  borderColor: theme.palette.accentBorder,
                }}
              >
                Index Atom
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= EXPANSIVE CENTRAL SYNAPTIC GRAPH CANVAS ================= */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1200 760"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-[1400px] max-h-[820px] transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Orbital Guidelines */}
          <g opacity="0.10" stroke={theme.palette.accent}>
            <circle cx="600" cy="380" r="140" fill="none" strokeDasharray="3 6" />
            <circle cx="600" cy="380" r="260" fill="none" strokeDasharray="4 8" />
            <circle cx="600" cy="380" r="390" fill="none" strokeDasharray="2 10" />
          </g>

          {/* Connection Edges */}
          <g strokeWidth="1.2" opacity="0.25">
            <line x1="600" y1="380" x2="380" y2="250" stroke={theme.palette.accent} strokeDasharray="4 3" />
            <line x1="600" y1="380" x2="330" y2="470" stroke={theme.palette.accent} strokeDasharray="4 3" />
            <line x1="600" y1="380" x2="820" y2="240" stroke={theme.palette.accent} strokeDasharray="4 3" />
            <line x1="600" y1="380" x2="880" y2="400" stroke={theme.palette.accent} strokeDasharray="4 3" />
            <line x1="600" y1="380" x2="570" y2="170" stroke={theme.palette.accent} strokeDasharray="4 3" />
            <line x1="600" y1="380" x2="750" y2="550" stroke={theme.palette.accent} strokeDasharray="4 3" />

            <line x1="380" y1="250" x2="230" y2="180" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="380" y1="250" x2="220" y2="300" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="330" y1="470" x2="190" y2="450" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="330" y1="470" x2="220" y2="560" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="570" y1="170" x2="500" y2="80" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="570" y1="170" x2="660" y2="80" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="820" y1="240" x2="970" y2="180" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="820" y1="240" x2="990" y2="280" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="880" y1="400" x2="1030" y2="380" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="880" y1="400" x2="1010" y2="480" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="750" y1="550" x2="860" y2="620" stroke={theme.palette.accent} strokeDasharray="2 3" />
            <line x1="750" y1="550" x2="700" y2="660" stroke={theme.palette.accent} strokeDasharray="2 3" />
          </g>

          {/* Coordinate Tick Annotations */}
          <g fill={theme.palette.textMuted} fontFamily="'JetBrains Mono', monospace" fontSize="8" opacity="0.5">
            <text x="615" y="375">0x00.SYS</text>
            <text x="395" y="245">0x7F.VEC</text>
            <text x="835" y="235">0x88.RUN</text>
            <text x="585" y="165">0xEE.MCP</text>
          </g>

          {/* Interactive Nodes */}
          <g>
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isCore = node.id === 'nova-core';

              return (
                <g
                  key={node.id}
                  onClick={() => selectNode(node.id)}
                  className="cursor-pointer group"
                >
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 5}
                      fill="none"
                      stroke={theme.palette.accent}
                      strokeWidth="1.5"
                      opacity="0.6"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Backdrop */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={theme.palette.bgElevated}
                    stroke={isSelected ? theme.palette.accent : theme.palette.glassBorder}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Inner node core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r * 0.35}
                    fill={isSelected ? theme.palette.accent : theme.palette.textMuted}
                    opacity={isCore ? 0.9 : 0.6}
                  />

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + node.r + 14}
                    textAnchor="middle"
                    fill={isSelected ? theme.palette.textPrimary : theme.palette.textSecondary}
                    fontFamily="'Space Grotesk', sans-serif"
                    fontSize={isCore ? 12 : 10.5}
                    fontWeight={isSelected || isCore ? '600' : '400'}
                  >
                    {node.label}
                  </text>

                  {/* Sublabel */}
                  <text
                    x={node.x}
                    y={node.y + node.r + 26}
                    textAnchor="middle"
                    fill={isSelected ? theme.palette.accent : theme.palette.textMuted}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize={7.5}
                    opacity="0.8"
                  >
                    {node.sublabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Center Minimal Constellation Action Pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2.5">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
            title="Zoom Out"
          >
            <i className="fa-solid fa-minus" />
          </button>

          <div
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border backdrop-blur-2xl text-[10px] font-sans shadow-md"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.palette.accent }}
            />
            <span className="tracking-wide">
              SYNAPTIC TOPOLOGY · {nodes.length} NODES
            </span>
            <span className="opacity-30">|</span>
            <span className="opacity-60 font-mono">114 EDGES</span>
          </div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
            title="Zoom In"
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>

      {/* ================= BOTTOM-LEFT: ACTIVE SYNAPSES & ENCRYPTION ================= */}
      <div className="absolute left-20 bottom-8 z-20 pointer-events-auto w-64">
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 space-y-3 font-sans"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between pb-2 border-b text-xs"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: theme.palette.accent }}>
              Active Synapses
            </span>
            <span className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textSecondary }}>
              HNSW L2
            </span>
          </div>

          {/* Metrics */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between" style={{ color: theme.palette.textSecondary }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                Vector Synapses
              </span>
              <span className="font-semibold font-mono" style={{ color: theme.palette.textPrimary }}>
                1,428
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '78%', backgroundColor: theme.palette.accent }}
              />
            </div>

            <div className="flex items-center justify-between pt-1" style={{ color: theme.palette.textSecondary }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                MCP Endpoints
              </span>
              <span className="font-semibold font-mono" style={{ color: theme.palette.textPrimary }}>
                {telemetry.mcpConnectedPipes} Connected
              </span>
            </div>

            <div
              className="flex items-center justify-between pt-1.5 border-t text-[11px]"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-shield-halved text-[10px] text-emerald-500" />
                Encryption Enclave
              </span>
              <span className="text-emerald-500 font-mono font-medium">AES-256</span>
            </div>
          </div>

          <div
            className="pt-2 border-t text-[10px] font-mono flex items-center justify-between opacity-50"
            style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
          >
            <span>0 unencrypted leaks</span>
            <span>Hardware locked</span>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM-RIGHT: MEMORY INSPECTOR ================= */}
      <div className="absolute right-6 bottom-8 z-20 pointer-events-auto w-80 max-w-[340px]">
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 flex flex-col space-y-2.5"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          {/* Inspector Header */}
          <div
            className="flex items-center justify-between pb-2 border-b text-xs"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.palette.textPrimary }}>
              <i className="fa-solid fa-database text-[11px] opacity-70" />
              <span>Memory Inspector</span>
            </div>
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.accent,
              }}
            >
              {selectedNode.badge}
            </span>
          </div>

          {/* Node metadata row */}
          <div className="flex items-center justify-between text-xs" style={{ color: theme.palette.textSecondary }}>
            <span className="font-mono text-[10px] opacity-60">{selectedNode.hash}</span>
            <span className="font-mono text-[11px] font-medium" style={{ color: theme.palette.accent }}>
              {selectedNode.confidence}
            </span>
          </div>

          {/* Selected Quote Statement */}
          <div
            className="p-3 rounded-xl border text-xs leading-relaxed font-sans"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          >
            {selectedNode.quote}
          </div>

          {/* Vector Proximity Decay Sparkline */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: theme.palette.textMuted }}>
              <span>Decay: {selectedNode.decayRate}</span>
              <span className="text-emerald-500">{selectedNode.decayStatus}</span>
            </div>
            <div
              className="w-full h-8 rounded-xl p-1 flex items-center border"
              style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
            >
              <svg viewBox="0 0 240 30" preserveAspectRatio="none" className="w-full h-full" style={{ color: theme.palette.accent }}>
                <path d="M0 24 Q 50 18, 100 14 T 180 8 T 240 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M0 24 Q 50 18, 100 14 T 180 8 T 240 5 L 240 30 L 0 30 Z" fill="currentColor" fillOpacity="0.08" />
                <circle cx="240" cy="5" r="2.5" fill={theme.palette.accent} />
              </svg>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="pt-1.5 border-t flex space-x-2 text-xs"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <button
              onClick={handleForget}
              className="flex-1 py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:opacity-100"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            >
              <i className="fa-solid fa-trash-can text-[10px]" /> Forget
            </button>
            <button
              onClick={handleEditSemantics}
              className="flex-1 py-1.5 px-2 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: theme.palette.accent,
                borderColor: theme.palette.accentBorder,
                color: theme.isDark ? '#000000' : '#ffffff',
              }}
            >
              <i className="fa-solid fa-pen text-[10px]" /> Edit Semantics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
