"use client";

import React, { useState } from "react";
import {
  Layers,
  Box,
  ChevronDown,
  Check,
  Flame,
  AlertCircle,
  Eye,
  Activity,
  Maximize2,
  Cpu,
} from "lucide-react";
import { useProgramme } from "@/lib/programme-context";

export type BimLevel = "Roof" | "Level 4" | "Level 3" | "Level 2" | "Level 1" | "Ground";

interface LevelConfig {
  id: BimLevel;
  label: string;
  taskName: string;
  status: string;
  daysLeft: string;
  dateRange: string;
  progress: number;
  highlightY: number; // percentage from top
  highlightX: number; // percentage from left
  inspectionStatus: string;
  concreteStrength: string;
  slumpTest: string;
}

const LEVEL_CONFIGS: Record<BimLevel, LevelConfig> = {
  Roof: {
    id: "Roof",
    label: "Roof",
    taskName: "Roof Plant Room & Waterproofing",
    status: "Not Started",
    daysLeft: "Starts 24 Feb 2026",
    dateRange: "24 Feb 2026 – 30 Mar 2026",
    progress: 0,
    highlightY: 18,
    highlightX: 52,
    inspectionStatus: "Design Complete",
    concreteStrength: "Pending Pour",
    slumpTest: "Spec 120mm",
  },
  "Level 4": {
    id: "Level 4",
    label: "Level 4",
    taskName: "Level 4 - Slabs & Columns",
    status: "Scheduled",
    daysLeft: "Starts 20 Jan 2026",
    dateRange: "20 Jan 2026 – 20 Feb 2026",
    progress: 0,
    highlightY: 28,
    highlightX: 53,
    inspectionStatus: "Rebar Inspection Scheduled",
    concreteStrength: "Design 40 MPa",
    slumpTest: "Spec 110mm",
  },
  "Level 3": {
    id: "Level 3",
    label: "Level 3",
    taskName: "Level 3 - Decking & Formwork",
    status: "Upcoming",
    daysLeft: "Starts 01 Jan 2026",
    dateRange: "01 Jan 2026 – 20 Jan 2026",
    progress: 15,
    highlightY: 38,
    highlightX: 53,
    inspectionStatus: "Formwork Check Passed",
    concreteStrength: "C35/45 Ready",
    slumpTest: "Spec 110mm",
  },
  "Level 2": {
    id: "Level 2",
    label: "Level 2",
    taskName: "Level 2 - Columns",
    status: "In Progress",
    daysLeft: "12 days left",
    dateRange: "20 Dec 2025 – 16 Jan 2026",
    progress: 60,
    highlightY: 48,
    highlightX: 54,
    inspectionStatus: "#17 Slump Check Approved",
    concreteStrength: "38.5 MPa (Target 40)",
    slumpTest: "115mm (Normal)",
  },
  "Level 1": {
    id: "Level 1",
    label: "Level 1",
    taskName: "Level 1 - Slab Complete",
    status: "Complete",
    daysLeft: "Completed 18 Dec",
    dateRange: "11 Oct 2025 – 18 Dec 2025",
    progress: 100,
    highlightY: 62,
    highlightX: 53,
    inspectionStatus: "QA Signoff Complete",
    concreteStrength: "42.1 MPa (Exceeded)",
    slumpTest: "Passed",
  },
  Ground: {
    id: "Ground",
    label: "Ground",
    taskName: "Ground Slab & Foundations",
    status: "Complete",
    daysLeft: "Completed 10 Oct",
    dateRange: "01 Sep 2025 – 10 Oct 2025",
    progress: 100,
    highlightY: 76,
    highlightX: 52,
    inspectionStatus: "Foundation Certified",
    concreteStrength: "45.0 MPa",
    slumpTest: "Passed",
  },
};

const LEVELS_ORDER: BimLevel[] = [
  "Roof",
  "Level 4",
  "Level 3",
  "Level 2",
  "Level 1",
  "Ground",
];

export function BimDigitalTwinHero() {
  const { selectTask, openDrawer } = useProgramme();

  const [activeLevel, setActiveLevel] = useState<BimLevel>("Level 2");
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [forecastDropdownOpen, setForecastDropdownOpen] = useState(false);
  const [currentForecast, setCurrentForecast] = useState("Working Forecast");
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(false);

  const levelInfo = LEVEL_CONFIGS[activeLevel];

  const handleSelectLevel = (lvl: BimLevel) => {
    setActiveLevel(lvl);
    if (lvl === "Level 2") {
      selectTask("task-superstructure");
      openDrawer("task-superstructure");
    }
  };

  const handleCalloutClick = () => {
    selectTask("task-superstructure");
    openDrawer("task-superstructure");
  };

  return (
    <div className="relative h-[225px] w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-100/70 via-white to-slate-50 shadow-2xs group select-none">
      {/* 1. 3D Architectural / BIM Model Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/bim-hero-clean.jpg"
          alt="BIM Construction Model"
          className={`h-full w-full object-cover object-[55%_35%] transition-all duration-700 ${
            wireframeMode
              ? "brightness-105 contrast-125 saturate-50 filter"
              : "brightness-100 contrast-100 filter"
          }`}
        />
        {/* Soft edge gradients blending into card boundaries */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-transparent to-white/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none" />

        {/* Wireframe CAD Inspection Grid Overlay (Taste adoption from Image 1) */}
        {wireframeMode && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none">
            <div className="absolute inset-0 bg-amber-500/5 mix-blend-color-burn" />
          </div>
        )}
      </div>

      {/* 2. Interactive Highlight Floor Overlay (SVG polygon over active floor slab) */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none z-10"
        viewBox="0 0 560 225"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="slabGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
          </radialGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Slab Highlight based on active level */}
        {activeLevel === "Level 2" && (
          <polygon
            points="285,115 350,92 400,108 340,135"
            fill={wireframeMode ? "rgba(245, 158, 11, 0.4)" : "url(#slabGlow)"}
            stroke={wireframeMode ? "#f59e0b" : "#3b82f6"}
            strokeWidth={wireframeMode ? "2" : "1.5"}
            filter="url(#glowFilter)"
            className="transition-all duration-500"
          />
        )}

        {activeLevel === "Level 3" && (
          <polygon
            points="290,95 352,74 398,90 342,114"
            fill="url(#slabGlow)"
            stroke="#3b82f6"
            strokeWidth="1.5"
            filter="url(#glowFilter)"
          />
        )}

        {activeLevel === "Level 4" && (
          <polygon
            points="295,78 355,59 400,74 345,95"
            fill="url(#slabGlow)"
            stroke="#3b82f6"
            strokeWidth="1.5"
            filter="url(#glowFilter)"
          />
        )}

        {activeLevel === "Roof" && (
          <polygon
            points="300,58 358,40 402,54 348,74"
            fill="url(#slabGlow)"
            stroke="#3b82f6"
            strokeWidth="1.5"
            filter="url(#glowFilter)"
          />
        )}

        {/* Leader line from callout to active floor pin */}
        <polyline
          points="210,32 265,32 272,110"
          fill="none"
          stroke={wireframeMode ? "#f59e0b" : "#3b82f6"}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="transition-all duration-300"
        />
      </svg>

      {/* 3. Floating Interactive BIM Callout Tooltip (Cleanly positioned on top-left) */}
      <div
        onClick={handleCalloutClick}
        className="absolute left-3 top-3 z-20 cursor-pointer transition-all duration-300 hover:scale-[1.02] max-w-[210px]"
        title="Click to view Level 2 Columns task details in drawer"
      >
        <div className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/95 p-2 px-2.5 shadow-md backdrop-blur-md hover:border-blue-300 transition-colors">
          {/* Pulsing Status Dot */}
          <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                wireframeMode ? "bg-amber-400" : "bg-blue-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                wireframeMode ? "bg-amber-500" : "bg-blue-600"
              }`}
            />
          </span>

          {/* Callout Content */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900 leading-tight">
                {levelInfo.taskName}
              </span>
              {wireframeMode && (
                <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                  QA #17
                </span>
              )}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{levelInfo.status}</span>
              <span>·</span>
              <span className="text-blue-600 font-semibold">{levelInfo.daysLeft}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {levelInfo.dateRange}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Floor Pin Indicator on the Model */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ left: "54%", top: "49%" }}
      >
        <span className="relative flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              wireframeMode ? "bg-amber-400" : "bg-blue-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-3.5 w-3.5 ring-2 ring-white shadow-md ${
              wireframeMode ? "bg-amber-500" : "bg-blue-600"
            }`}
          />
        </span>
      </div>

      {/* 5. Floating Level Selector on Top Right */}
      <div className="absolute right-3 top-2.5 z-20 flex flex-col gap-1 rounded-xl border border-slate-200/70 bg-white/95 p-1 shadow-md backdrop-blur-md">
        {LEVELS_ORDER.map((lvl) => {
          const isCurrent = activeLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => handleSelectLevel(lvl)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                isCurrent
                  ? "bg-blue-600 text-white shadow-2xs scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Layers className={`h-3 w-3 shrink-0 ${isCurrent ? "text-white" : "text-slate-400"}`} />
              <span>{lvl}</span>
            </button>
          );
        })}
      </div>

      {/* 6. Floating Bottom Controls: Working Forecast + 3D View Toggle */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        {/* Working Forecast Pill */}
        <div className="relative">
          <button
            onClick={() => setForecastDropdownOpen(!forecastDropdownOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white/95 px-2.5 py-1.5 text-[11.5px] font-semibold text-slate-700 shadow-2xs backdrop-blur-md hover:bg-white transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span>{currentForecast}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {forecastDropdownOpen && (
            <div className="absolute bottom-full right-0 mb-1.5 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg z-50">
              {["Working Forecast", "Baseline 0 (Contract)", "Approved Baseline 1.1"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setCurrentForecast(f);
                    setForecastDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-[11.5px] ${
                    currentForecast === f
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{f}</span>
                  {currentForecast === f && <Check className="h-3 w-3 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3D View / Wireframe CAD Toggle (adopting Image 1 taste) */}
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11.5px] font-bold shadow-2xs backdrop-blur-md transition-all ${
            wireframeMode
              ? "border-amber-400 bg-amber-500 text-white shadow-amber-200"
              : "border-slate-200/90 bg-white/95 text-slate-700 hover:bg-white hover:border-blue-300"
          }`}
          title="Toggle 3D Wireframe CAD Inspection Mode"
        >
          <Box className={`h-3.5 w-3.5 ${wireframeMode ? "animate-pulse" : ""}`} />
          <span>{wireframeMode ? "CAD Mode" : "3D View"}</span>
        </button>
      </div>

      {/* 7. Floating Telemetry HUD (Bottom Left — Taste adoption from Images 1 & 3) */}
      <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowTelemetryDetails(!showTelemetryDetails)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2 py-1 text-[10.5px] font-semibold text-slate-600 shadow-2xs backdrop-blur-md hover:bg-white transition-colors"
        >
          <Activity className="h-3 w-3 text-blue-500" />
          <span>Grid C-E</span>
          <span className="text-slate-300">|</span>
          <span>FL: {activeLevel}</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600">{levelInfo.progress}%</span>
        </button>

        {/* Mini Inspection Badge from Image 1 */}
        {wireframeMode && (
          <div className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/95 px-2 py-1 text-[10.5px] font-semibold text-amber-800 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{levelInfo.concreteStrength}</span>
          </div>
        )}
      </div>
    </div>
  );
}
