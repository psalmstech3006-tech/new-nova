import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ScreenMode,
  PresenceType,
  ThemeId,
  ThemeDefinition,
  TrajectoryItem,
  TransparencyLog,
  SynapseNode,
  NotificationToast,
} from '../types/nova';
import { NOVA_THEMES } from '../theme/themes';

interface NovaStateContextType {
  // Navigation & Presence
  currentScreen: ScreenMode;
  setCurrentScreen: (screen: ScreenMode) => void;
  presenceType: PresenceType;
  setPresenceType: (presence: PresenceType) => void;

  // Theming & Material Glass
  theme: ThemeDefinition;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  glassOpacity: number;
  setGlassOpacity: (opacity: number) => void;
  monospaceKern: string;
  setMonospaceKern: (kern: string) => void;

  // Realtime Audio & Voice State
  // [BACKEND HOOK]: In production, connect this to WebRTC / Nova Streaming Audio API
  isListening: boolean;
  audioLevel: number;
  voiceThreshold: number; // in -dBFS
  setVoiceThreshold: (dbfs: number) => void;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;

  // System Telemetry
  // [BACKEND HOOK]: In production, these stream from the OS kernel / GPU telemetry daemon
  telemetry: {
    vramUsed: number;
    vramTotal: number;
    latentUnits: number;
    kernelLatencyMs: number;
    tokenRate: number;
    jitterMs: number;
    ipcSocket: string;
    sandboxLevel: string;
    mcpConnectedPipes: number;
    vectorSynapsesCount: number;
  };

  // Runtime Trajectory Queue
  trajectories: TrajectoryItem[];
  dispatchTask: (idOrTitle: string) => void;
  dryRunTask: (idOrTitle: string) => void;
  addTask: (title: string, category: string) => void;
  removeTask: (id: string) => void;

  // Agent Transparency Stream
  // [BACKEND HOOK]: Streams from Nova Agent runtime event bus
  logs: TransparencyLog[];
  logFilter: string;
  setLogFilter: (filter: string) => void;

  // Synaptic Memory Graph
  nodes: SynapseNode[];
  selectedNode: SynapseNode;
  selectedNodeId: string;
  selectNode: (id: string) => void;
  forgetNode: (id: string) => void;
  editNodeSemantics: (id: string, quote: string) => void;
  addMemoryAtom: (label: string, quote: string, category?: SynapseNode['category']) => void;

  // Interactive Notifications / Toasts
  toasts: NotificationToast[];
  addToast: (title: string, description?: string, type?: NotificationToast['type']) => void;
  dismissToast: (id: string) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  themeModalOpen: boolean;
  setThemeModalOpen: (open: boolean) => void;
}

const NovaStateContext = createContext<NovaStateContextType | null>(null);

export const NovaStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Screen and Manifestation
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('substrate');
  const [presenceType, setPresenceType] = useState<PresenceType>('orb');

  // Theme Settings
  const [themeId, setThemeId] = useState<ThemeId>('warm-graphite');
  const [glassOpacity, setGlassOpacity] = useState<number>(76);
  const [monospaceKern, setMonospaceKern] = useState<string>('1.35x');
  const theme = NOVA_THEMES[themeId] || NOVA_THEMES['warm-graphite'];

  // Audio & Voice
  const [isListening, setIsListening] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [voiceThreshold, setVoiceThreshold] = useState<number>(42); // -42 dBFS

  // Modals
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = useCallback((title: string, description?: string, type: NotificationToast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: NotificationToast = {
      id,
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // System Telemetry state
  const [telemetry, setTelemetry] = useState({
    vramUsed: 18.2,
    vramTotal: 24.0,
    latentUnits: 350,
    kernelLatencyMs: 0.8,
    tokenRate: 54.2,
    jitterMs: 0.14,
    ipcSocket: '/tmp/nova.sock',
    sandboxLevel: 'Strict L3',
    mcpConnectedPipes: 12,
    vectorSynapsesCount: 18490,
  });

  // Periodically fluctuate telemetry naturally to make it feel alive without being noisy
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        tokenRate: Number((54.0 + (Math.random() * 0.8 - 0.4)).toFixed(1)),
        jitterMs: Number((0.14 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Audio Context Listener
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const simAudioIntervalRef = useRef<number | null>(null);

  const startListening = useCallback(async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const poll = () => {
          if (!streamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length / 255;
          setAudioLevel(avg);
          requestAnimationFrame(poll);
        };
        poll();
      } else {
        throw new Error('No user media');
      }
    } catch {
      // Graceful simulated acoustic cadence
      if (simAudioIntervalRef.current) clearInterval(simAudioIntervalRef.current);
      simAudioIntervalRef.current = window.setInterval(() => {
        setAudioLevel(0.15 + Math.random() * 0.4);
      }, 140);
    }
    setIsListening(true);
    addToast('Acoustic Listener Active', 'Receiving voice stream with Zero-Phase ANC.', 'info');
  }, [addToast]);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (simAudioIntervalRef.current) {
      clearInterval(simAudioIntervalRef.current);
      simAudioIntervalRef.current = null;
    }
    setAudioLevel(0);
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Trajectory Queue
  const [trajectories, setTrajectories] = useState<TrajectoryItem[]>([
    {
      id: 'traj-1',
      title: 'Execute Web Deep Research • arXiv scan',
      category: 'Research',
      status: 'idle',
      latency: '1.2s avg',
      details: 'Ingesting multi-source consensus nodes across ML repositories and preprint archives.',
    },
    {
      id: 'traj-2',
      title: 'Tree-sitter parse: Rust AST reconcile',
      category: 'Synthesis',
      status: 'idle',
      latency: '4ms',
      details: 'Diffing syntax trees inside isolated Wasm VM sandbox without file system side-effects.',
    },
    {
      id: 'traj-3',
      title: 'Spatial gaze track • 1080p frame buffer',
      category: 'Vision',
      status: 'idle',
      latency: '16ms',
      details: 'Processing optical eye gaze vector for adaptive focal point rendering.',
    },
    {
      id: 'traj-4',
      title: 'Voice model beamforming telemetry',
      category: 'Acoustic',
      status: 'idle',
      latency: 'sub-1ms',
      details: 'Calibrating multi-channel spatial acoustic array for noise reduction.',
    },
  ]);

  // Agent Transparency Logs
  const [logs, setLogs] = useState<TransparencyLog[]>([
    {
      id: 'log-1',
      agent: 'Lexicon-9',
      source: 'Web Skill',
      timeOffset: '+48ms',
      message: 'Spawned 2 ephemeral Chromium workers in scratchpad sandbox. Ingesting query consensus nodes.',
      accent: 'neutral',
    },
    {
      id: 'log-2',
      agent: 'Synapse-Bridge',
      source: 'Internal',
      timeOffset: '+112ms',
      message: 'AST vector re-indexing completed across local HNSW cosine space. Zero gate conflicts.',
      accent: 'accent',
    },
    {
      id: 'log-3',
      agent: 'Sentinel-Core',
      source: 'Enclave',
      timeOffset: '+164ms',
      message: 'Cryptographic SHA-256 seal verified against system runtime security ledger.',
      accent: 'success',
    },
  ]);

  const [logFilter, setLogFilter] = useState<string>('all');

  // Dispatch task implementation
  const dispatchTask = useCallback((idOrTitle: string) => {
    let target = trajectories.find((t) => t.id === idOrTitle || t.title === idOrTitle);
    if (!target) {
      // Dynamically add and dispatch
      const newId = `task-${Date.now()}`;
      target = {
        id: newId,
        title: idOrTitle,
        category: 'Custom Action',
        status: 'running',
        details: 'Custom dispatched action running in isolated sandbox container.',
      };
      setTrajectories((prev) => [target!, ...prev]);
    } else {
      setTrajectories((prev) =>
        prev.map((t) => (t.id === target!.id ? { ...t, status: 'running' } : t))
      );
    }

    addToast('Task Dispatched', target.title, 'info');

    const logId = `log-${Date.now()}`;
    setLogs((prev) => [
      {
        id: logId,
        agent: 'Nova-Runner',
        source: target!.category,
        timeOffset: `+${Math.floor(Math.random() * 50 + 20)}ms`,
        message: `Dispatched: "${target!.title}". Initializing worker in strict L3 sandbox.`,
        accent: 'accent',
      },
      ...prev.slice(0, 15),
    ]);

    setTimeout(() => {
      setTrajectories((prev) =>
        prev.map((t) => (t.id === target!.id ? { ...t, status: 'completed' } : t))
      );
      setLogs((prev) => [
        {
          id: `log-done-${Date.now()}`,
          agent: 'Sentinel-Core',
          source: 'Security Gate',
          timeOffset: `+${Math.floor(Math.random() * 120 + 80)}ms`,
          message: `Completed: "${target!.title}" with exit code 0. Vector index updated.`,
          accent: 'success',
        },
        ...prev.slice(0, 15),
      ]);
      addToast('Task Completed', `${target!.title} verified.`, 'success');
    }, 1500);
  }, [trajectories, addToast]);

  const dryRunTask = useCallback((idOrTitle: string) => {
    const target = trajectories.find((t) => t.id === idOrTitle || t.title === idOrTitle);
    const title = target ? target.title : idOrTitle;
    addToast('Dry Run Started', `Testing execution graph for "${title}" without side-effects.`, 'info');
    setTimeout(() => {
      setLogs((prev) => [
        {
          id: `log-dry-${Date.now()}`,
          agent: 'Simulator-0',
          source: 'Dry Run',
          timeOffset: '+24ms',
          message: `Dry Run passed: "${title}" validated against local policy rules. 0 invariants violated.`,
          accent: 'neutral',
        },
        ...prev.slice(0, 15),
      ]);
      addToast('Dry Run Verified', 'Zero side-effects, syntax trees verified clean.', 'success');
    }, 900);
  }, [trajectories, addToast]);

  const addTask = useCallback((title: string, category: string) => {
    const newTask: TrajectoryItem = {
      id: `task-${Date.now()}`,
      title,
      category,
      status: 'idle',
      details: 'User defined runtime trajectory node.',
    };
    setTrajectories((prev) => [...prev, newTask]);
    addToast('Task Queued', title, 'info');
  }, [addToast]);

  const removeTask = useCallback((id: string) => {
    setTrajectories((prev) => prev.filter((t) => t.id !== id));
    addToast('Task Removed', 'Trajectory item deleted.', 'info');
  }, [addToast]);

  // Synaptic Nodes State
  const [nodes, setNodes] = useState<SynapseNode[]>([
    {
      id: 'rust-pytorch',
      label: 'Rust & PyTorch',
      sublabel: 'GPU Kernels',
      category: 'tech',
      x: 230,
      y: 180,
      r: 18,
      hash: '0x7F_RUST_PYT',
      confidence: '99.8% Confirmed',
      badge: 'VERIFIED ATOM',
      quote: '“Prefers Rust and PyTorch for low-latency GPU kernels over standard Python wrappers during high-throughput tensor evaluations.”',
      decayRate: 'Zero',
      decayStatus: 'Permanent Locked',
      pinned: true,
    },
    {
      id: 'tech-context',
      label: 'Technical Context',
      sublabel: '99.8% Confirmed',
      category: 'tech',
      x: 380,
      y: 250,
      r: 26,
      hash: '0x7F_VEC_CTX',
      confidence: '99.8% Confirmed',
      badge: 'CLUSTER NODE',
      quote: '“Aggregated engineering paradigms, GPU compute constraints, and SIMD compiler preferences.”',
      decayRate: '0.02%',
      decayStatus: 'Persistent Index',
    },
    {
      id: 'awq-4bit',
      label: 'AWQ 4-Bit',
      sublabel: 'Quantization',
      category: 'tech',
      x: 220,
      y: 300,
      r: 15,
      hash: '0x3B_AWQ_KERN',
      confidence: '98.9% Confirmed',
      badge: 'HEURISTIC NODE',
      quote: '“Targets AWQ / GPTQ 4-bit quantization kernels to maintain maximum context window on local hardware without memory paging.”',
      decayRate: 'Zero',
      decayStatus: 'Active Weighting',
    },
    {
      id: 'nova-core',
      label: 'NOVA CORE',
      sublabel: 'SYNAPSE SEED // ACTIVE',
      category: 'core',
      x: 600,
      y: 380,
      r: 40,
      hash: '0x00_ROOT_SYNAPSE',
      confidence: '100% Deterministic',
      badge: 'ROOT NUCLEUS',
      quote: '“Primary omni-modal neural orchestrator. Directs speech cadence, vector store partitioning, and delegates tasks to autonomous sub-agents.”',
      decayRate: 'Zero',
      decayStatus: 'Immutable Kernel',
      pinned: true,
    },
    {
      id: 'personal-prefs',
      label: 'Personal Prefs',
      sublabel: 'Deep Work',
      category: 'prefs',
      x: 330,
      y: 470,
      r: 23,
      hash: '0x2A_USER_PREF',
      confidence: '99.4% Synthesized',
      badge: 'PERSONAL CLUSTER',
      quote: '“Strict dark obsidian aesthetic, uninterrupted voice interaction during deep focus sprints, and rapid summary outputs without conversational pleasantries.”',
      decayRate: 'Zero',
      decayStatus: 'Permanent Locked',
    },
    {
      id: 'zero-white',
      label: 'Zero White UI',
      sublabel: 'OLED Contrast',
      category: 'prefs',
      x: 190,
      y: 450,
      r: 13,
      hash: '0x1A_OLED_OBSIDIAN',
      confidence: '99.9% Confirmed',
      badge: 'THEME CONSTRAINT',
      quote: '“Enforces pure dark obsidian backgrounds and zero high-luminance flashes across all viewport surfaces.”',
      decayRate: 'Zero',
      decayStatus: 'Permanent Locked',
    },
    {
      id: 'cadence-fast',
      label: 'Cadence Fast',
      sublabel: 'Low Latency',
      category: 'prefs',
      x: 220,
      y: 560,
      r: 13,
      hash: '0x1B_FAST_CADENCE',
      confidence: '98.5% Confirmed',
      badge: 'VOICE PARAMETER',
      quote: '“Optimizes synthesis streaming chunk size to sub-100ms for instantaneous audio feedback upon sentence completion.”',
      decayRate: 'Zero',
      decayStatus: 'Permanent Locked',
    },
    {
      id: 'mcp-protocol',
      label: 'MCP Protocol',
      sublabel: '12 Pipes',
      category: 'mcp',
      x: 570,
      y: 170,
      r: 22,
      hash: '0xEE_MCP_HUB',
      confidence: '100% Native Socket',
      badge: 'PROTOCOL HUB',
      quote: '“Bi-directional secure JSON-RPC interface communicating directly with system files, Postgres databases, and external cloud workspaces.”',
      decayRate: 'Zero',
      decayStatus: 'Active Socket',
      pinned: true,
    },
    {
      id: 'mcp-fs',
      label: 'Filesystem MCP',
      sublabel: 'POSIX Sandboxed',
      category: 'mcp',
      x: 500,
      y: 80,
      r: 14,
      hash: '0xEE_FS_PIPE',
      confidence: '100% Local UDS',
      badge: 'ENDPOINT PIPE',
      quote: '“Direct file tree traversal with AST caching and strict atomic diff validation before disc commit.”',
      decayRate: 'Zero',
      decayStatus: 'Mounted UDS',
    },
    {
      id: 'mcp-postgres',
      label: 'Postgres DB',
      sublabel: 'PG Vector',
      category: 'mcp',
      x: 660,
      y: 80,
      r: 14,
      hash: '0xEE_PG_CONN',
      confidence: '100% Pooling',
      badge: 'DATA CONNECTOR',
      quote: '“Local PostgreSQL connection with pgvector extension enabled for 1536-dim embeddings persistence.”',
      decayRate: 'Zero',
      decayStatus: 'Connection Pool Active',
    },
    {
      id: 'auto-coding',
      label: 'Autonomous Coding',
      sublabel: 'DeepSeek-R1',
      category: 'skills',
      x: 820,
      y: 240,
      r: 26,
      hash: '0x88_SKILL_CODE',
      confidence: '99.1% Operational',
      badge: 'AUTONOMOUS CORE',
      quote: '“Self-directed execution loop capable of AST parsing, self-directed unit test verification, and atomic git commit preparation.”',
      decayRate: 'Zero',
      decayStatus: 'Hot Loaded',
    },
    {
      id: 'ast-engine',
      label: 'AST Engine',
      sublabel: 'Tree-Sitter VM',
      category: 'skills',
      x: 970,
      y: 180,
      r: 14,
      hash: '0x88_AST_PARSE',
      confidence: '99.7% Confirmed',
      badge: 'SYNTACTIC ANALYZER',
      quote: '“Incremental multi-language parser compiling code changes into structured abstract syntax graphs in sub-5ms.”',
      decayRate: 'Zero',
      decayStatus: 'Wasm Isolated',
    },
    {
      id: 'auto-unit-test',
      label: 'Auto-Unit Test',
      sublabel: 'Vitest / Cargo',
      category: 'skills',
      x: 990,
      y: 280,
      r: 14,
      hash: '0x88_TEST_GEN',
      confidence: '98.8% Confirmed',
      badge: 'VALIDATION LOOP',
      quote: '“Autonomous test runner targeting 100% branch assertion coverage before releasing diffs to staging environment.”',
      decayRate: 'Zero',
      decayStatus: 'Strict Gate',
    },
    {
      id: 'browser-synthesis',
      label: 'Browser Synthesis',
      sublabel: 'Playwright Pool',
      category: 'browser',
      x: 880,
      y: 400,
      r: 22,
      hash: '0x55_BROWSER_SYN',
      confidence: '99.3% Confirmed',
      badge: 'SCRATCHPAD POOL',
      quote: '“Headless Chromium cluster with DOM element distillation, semantic text scraping, and spatial screenshot capture.”',
      decayRate: 'Zero',
      decayStatus: 'Ephemeral Pool',
    },
    {
      id: 'dom-scraper',
      label: 'DOM Scraper',
      sublabel: 'Semantic Clean',
      category: 'browser',
      x: 1030,
      y: 380,
      r: 13,
      hash: '0x55_DOM_STRIP',
      confidence: '99.0% Confirmed',
      badge: 'DOM PIPELINE',
      quote: '“Cleanses inline scripts, tracking tags, and boilerplate navigation to yield pure markdown text payloads.”',
      decayRate: 'Zero',
      decayStatus: 'Cached Node',
    },
    {
      id: 'screen-vision-ocr',
      label: 'Screen Vision OCR',
      sublabel: 'YOLO + Paddle',
      category: 'browser',
      x: 1010,
      y: 480,
      r: 13,
      hash: '0x55_VISION_OCR',
      confidence: '99.5% Confirmed',
      badge: 'SPATIAL VISION',
      quote: '“Sub-pixel spatial coordinate detection and multi-lingual bounding box text extraction at 60 frames per second.”',
      decayRate: 'Zero',
      decayStatus: 'Hardware Accelerated',
    },
    {
      id: 'autonomous-fleet',
      label: 'Autonomous Fleet',
      sublabel: '4 Cores Online',
      category: 'fleet',
      x: 750,
      y: 550,
      r: 24,
      hash: '0xAA_FLEET_REGISTRY',
      confidence: '99.9% Synchronized',
      badge: 'FLEET REGISTRY',
      quote: '“Four specialized co-agents: Lexicon-9 (Speech/Semantic), Synapse-Bridge (Vector Search), Sentinel-Core (Security Gates), and Browser-Agent.”',
      decayRate: 'Zero',
      decayStatus: 'Consensus Quorum',
    },
    {
      id: 'sentinel-core',
      label: 'Sentinel-Core',
      sublabel: 'Gatekeeper',
      category: 'fleet',
      x: 860,
      y: 620,
      r: 14,
      hash: '0xAA_SENTINEL_GATE',
      confidence: '100% Strict L3',
      badge: 'SECURITY GATE',
      quote: '“Intercepts outbound IPC and web requests, enforcing cryptographic policy constraints and data confidentiality.”',
      decayRate: 'Zero',
      decayStatus: 'Active Gate',
    },
    {
      id: 'lexicon-9',
      label: 'Lexicon-9',
      sublabel: 'Web Skill',
      category: 'fleet',
      x: 700,
      y: 660,
      r: 14,
      hash: '0xAA_LEXICON_NINE',
      confidence: '99.4% Online',
      badge: 'WORKER WORKFLOW',
      quote: '“Dispatches ephemeral Chromium scratchpads to ingest web queries and reconcile multiple peer consensus nodes.”',
      decayRate: 'Zero',
      decayStatus: 'Online Worker',
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('rust-pytorch');
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const selectNode = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, []);

  const forgetNode = useCallback((id: string) => {
    if (id === 'nova-core') {
      addToast('Cannot Purge Root', 'NOVA CORE is the root immutable orchestrator.', 'warning');
      return;
    }
    const target = nodes.find((n) => n.id === id);
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNodeId('nova-core');
    addToast('Memory Atom Purged', `Removed "${target?.label || id}" from local vector space.`, 'info');
  }, [nodes, addToast]);

  const editNodeSemantics = useCallback((id: string, quote: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, quote: quote.startsWith('“') ? quote : `“${quote}”` } : n))
    );
    addToast('Semantics Re-indexed', 'Memory formulation updated successfully.', 'success');
  }, [addToast]);

  const addMemoryAtom = useCallback((label: string, quote: string, category: SynapseNode['category'] = 'tech') => {
    const id = `atom-${Date.now()}`;
    const newNode: SynapseNode = {
      id,
      label,
      sublabel: 'User Indexed',
      category,
      x: Math.floor(250 + Math.random() * 500),
      y: Math.floor(150 + Math.random() * 400),
      r: 16,
      hash: `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}_USER`,
      confidence: '99.0% User verified',
      badge: 'CUSTOM ATOM',
      quote: quote.startsWith('“') ? quote : `“${quote}”`,
      decayRate: 'Zero',
      decayStatus: 'User Pinned',
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    addToast('Memory Atom Added', `Indexed "${label}" in synaptic graph.`, 'success');
  }, [addToast]);

  return (
    <NovaStateContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        presenceType,
        setPresenceType,
        theme,
        themeId,
        setThemeId,
        glassOpacity,
        setGlassOpacity,
        monospaceKern,
        setMonospaceKern,
        isListening,
        audioLevel,
        voiceThreshold,
        setVoiceThreshold,
        startListening,
        stopListening,
        toggleListening,
        telemetry,
        trajectories,
        dispatchTask,
        dryRunTask,
        addTask,
        removeTask,
        logs,
        logFilter,
        setLogFilter,
        nodes,
        selectedNode,
        selectedNodeId,
        selectNode,
        forgetNode,
        editNodeSemantics,
        addMemoryAtom,
        toasts,
        addToast,
        dismissToast,
        commandPaletteOpen,
        setCommandPaletteOpen,
        themeModalOpen,
        setThemeModalOpen,
      }}
    >
      {children}
    </NovaStateContext.Provider>
  );
};

export const useNova = () => {
  const context = useContext(NovaStateContext);
  if (!context) {
    throw new Error('useNova must be used within a NovaStateProvider');
  }
  return context;
};
