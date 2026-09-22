"use client";

import React, { useState } from "react";
import type { ProgrammeTask } from "@/lib/programme-types";
import { useProgramme } from "@/lib/programme-context";
import {
  AlertCircle,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";

interface MonthDef {
  key: string;
  name: string;
  year: number;
  width: number;
}

// 16 Months spanning Sep 2025 through Dec 2026 for full project lifecycle
const MONTHS: MonthDef[] = [
  { key: "sep-25", name: "Sep", year: 2025, width: 76 },
  { key: "oct-25", name: "Oct", year: 2025, width: 76 },
  { key: "nov-25", name: "Nov", year: 2025, width: 76 },
  { key: "dec-25", name: "Dec", year: 2025, width: 76 },
  { key: "jan-26", name: "Jan", year: 2026, width: 76 },
  { key: "feb-26", name: "Feb", year: 2026, width: 76 },
  { key: "mar-26", name: "Mar", year: 2026, width: 76 },
  { key: "apr-26", name: "Apr", year: 2026, width: 76 },
  { key: "may-26", name: "May", year: 2026, width: 76 },
  { key: "jun-26", name: "Jun", year: 2026, width: 76 },
  { key: "jul-26", name: "Jul", year: 2026, width: 76 },
  { key: "aug-26", name: "Aug", year: 2026, width: 76 },
  { key: "sep-26", name: "Sep", year: 2026, width: 76 },
  { key: "oct-26", name: "Oct", year: 2026, width: 76 },
  { key: "nov-26", name: "Nov", year: 2026, width: 76 },
  { key: "dec-26", name: "Dec", year: 2026, width: 76 },
];

function dateToX(dateStr?: string, monthWidth = 76): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  const yearDiff = d.getFullYear() - 2025;
  const monthDiff = yearDiff * 12 + d.getMonth() - 8; // 8 = Sep (0-indexed)
  const dayOfMonth = d.getDate();
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return Math.max(0, monthDiff * monthWidth + (dayOfMonth / daysInMonth) * monthWidth);
}

export function Timeline({ tasks }: { tasks: ProgrammeTask[] }) {
  const { state, selectTask } = useProgramme();
  const [showNavigator, setShowNavigator] = useState<boolean>(false);
  const [hoveredTask, setHoveredTask] = useState<{
    task: ProgrammeTask;
    x: number;
    y: number;
  } | null>(null);

  const monthWidth = 76;
  const totalWidth = MONTHS.length * monthWidth;

  // Today marker X position in Oct 2025 (Sep = 76px, Oct 15th ~ 76 + 37 = 113px)
  const todayX = 76 + 37;

  // Calibrated bar coordinates & labels matching the primary design reference (Image 4)
  const getTaskBarCoords = (
    task: ProgrammeTask,
  ): {
    left: number;
    width: number;
    type: string;
    label: string;
    hasMilestone?: boolean;
  } => {
    switch (task.id) {
      case "task-site-est":
        return {
          left: 4,
          width: 44,
          type: "complete-green",
          label: "Site Establishment 100%",
        };
      case "task-earthworks":
        return {
          left: 48,
          width: 72,
          type: "complete-green",
          label: "Earthworks 82%",
        };
      case "task-superstructure":
        return {
          left: 116,
          width: 386,
          type: "summary-bracket",
          label: "Superstructure 68%",
          hasMilestone: true,
        };
      case "task-level-1":
        return {
          left: 116,
          width: 154,
          type: "task-blue",
          label: "Level 1 100%",
        };
      case "task-level-2":
        return {
          left: 270,
          width: 172,
          type: "task-blue",
          label: "Level 2 46%",
        };
      case "task-columns":
        return {
          left: 270,
          width: 92, // generous width to prevent "Level 2 ..." truncation
          type: "selected-columns",
          label: "Level 2 - Columns",
          hasMilestone: true,
        };
      case "task-blockwork":
        return {
          left: 362,
          width: 56,
          type: "task-blue",
          label: "25%",
        };
      case "task-slab":
        return {
          left: 422,
          width: 46,
          type: "task-gray",
          label: "0%",
        };
      case "task-level-3":
        return {
          left: 472,
          width: 178,
          type: "task-gray",
          label: "Level 3 0%",
        };
      case "task-level-4":
        return {
          left: 654,
          width: 84,
          type: "task-gray",
          label: "Level 4 0%",
        };
      case "task-facade":
        return {
          left: 520,
          width: 236,
          type: "task-blue",
          label: "Façade 34%",
        };
      case "task-fitout":
        return {
          left: 556,
          width: 398,
          type: "task-gray",
          label: "Fitout 0%",
        };
      case "task-external-works":
        return {
          left: 958,
          width: 104,
          type: "task-gray",
          label: "External Works 0%",
        };
      case "task-completion":
        return {
          left: 1066,
          width: 20,
          type: "milestone-diamond",
          label: "Completion ◆",
        };
      default: {
        // Dynamic calculation based on task dates
        const startX = Math.round(dateToX(task.startDate, monthWidth));
        const endX = Math.round(dateToX(task.endDate, monthWidth));
        const w = Math.max(endX - startX, task.isMilestone ? 18 : 36);

        let type = "task-blue";
        if (task.level === "phase") type = "summary-bracket";
        else if (task.isMilestone || task.duration === 0) type = "milestone-diamond";
        else if (task.progress >= 100) type = "complete-green";
        else if (task.progress === 0) type = "task-gray";

        return {
          left: startX,
          width: w,
          type,
          label: `${task.name} ${task.progress}%`,
        };
      }
    }
  };

  // Planned dependency link connections between predecessor finish and successor start
  const dependencyLinks = [
    { pred: "task-site-est", succ: "task-earthworks" },
    { pred: "task-earthworks", succ: "task-superstructure" },
    { pred: "task-level-1", succ: "task-level-2" },
    { pred: "task-columns", succ: "task-blockwork" },
    { pred: "task-blockwork", succ: "task-slab" },
    { pred: "task-slab", succ: "task-level-3" },
    { pred: "task-level-3", succ: "task-level-4" },
    { pred: "task-level-4", succ: "task-facade" },
    { pred: "task-facade", succ: "task-fitout" },
    { pred: "task-fitout", succ: "task-completion" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white select-none min-w-0 relative">
      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto relative">
        <div style={{ width: `${totalWidth}px` }} className="relative min-h-full">
          {/* Timeline Header */}
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            {/* Row 1: Years */}
            <div className="flex h-5 border-b border-slate-100 text-[10.5px] font-semibold text-slate-400">
              <div style={{ width: `${monthWidth * 4}px` }} className="pl-3 flex items-center">
                2025
              </div>
              <div style={{ width: `${monthWidth * 12}px` }} className="pl-3 flex items-center">
                2026
              </div>
            </div>

            {/* Row 2: Months + Today Badge */}
            <div className="flex h-6 items-center text-[11px] font-medium text-slate-500 relative">
              {MONTHS.map((m) => (
                <div
                  key={m.key}
                  style={{ width: `${m.width}px` }}
                  className="text-center shrink-0 border-r border-slate-100/90"
                >
                  {m.name}
                </div>
              ))}

              {/* Blue "Today" Badge */}
              <div
                className="absolute -bottom-1 z-30 -translate-x-1/2 rounded bg-blue-600 px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs pointer-events-none"
                style={{ left: `${todayX}px` }}
              >
                Today
              </div>
            </div>
          </div>

          {/* Dotted Vertical "Today" Line extending down */}
          <div
            className="absolute top-11 bottom-0 w-px border-l-2 border-dotted border-blue-400/80 z-10 pointer-events-none"
            style={{ left: `${todayX}px` }}
          />

          {/* Month Vertical Grid Lines */}
          <div className="absolute inset-0 top-11 pointer-events-none flex">
            {MONTHS.map((m) => (
              <div
                key={m.key}
                style={{ width: `${m.width}px` }}
                className="h-full border-r border-slate-100/80 shrink-0"
              />
            ))}
          </div>

          {/* Dynamic SVG Bezier Dependency Lines Overlay */}
          <svg className="absolute inset-0 top-11 w-full h-full pointer-events-none z-10">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
            {dependencyLinks.map((link, idx) => {
              const pIndex = tasks.findIndex((t) => t.id === link.pred);
              const sIndex = tasks.findIndex((t) => t.id === link.succ);
              if (pIndex === -1 || sIndex === -1) return null;

              const pTask = tasks[pIndex];
              const sTask = tasks[sIndex];
              const pCoords = getTaskBarCoords(pTask);
              const sCoords = getTaskBarCoords(sTask);

              const x1 = pCoords.left + pCoords.width;
              const y1 = pIndex * 40 + 20;
              const x2 = sCoords.left;
              const y2 = sIndex * 40 + 20;

              // Smooth curved connection from predecessor finish to successor start
              const d =
                x2 >= x1
                  ? `M ${x1} ${y1} C ${x1 + 16} ${y1}, ${x2 - 16} ${y2}, ${x2} ${y2}`
                  : `M ${x1} ${y1} H ${x1 + 12} V ${y2} H ${x2}`;

              return (
                <path
                  key={`dep-${idx}`}
                  d={d}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Task Gantt Bars Rows */}
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const coords = getTaskBarCoords(task);
              const isSelected = state.selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => selectTask(task.id)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredTask({
                      task,
                      x: coords.left + coords.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => setHoveredTask(null)}
                  className={`relative flex h-10 items-center cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/40"
                  }`}
                >
                  {/* Complete Green Bar */}
                  {coords.type === "complete-green" && (
                    <div
                      className="absolute h-5 rounded-md bg-emerald-500 shadow-2xs transition-all flex items-center px-2 group"
                      style={{
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                      }}
                    >
                      {/* Frosted Badge Beside Bar to prevent any line collision */}
                      <span className="absolute left-full ml-2 inline-flex items-center rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 shadow-2xs border border-slate-200/80 backdrop-blur-xs whitespace-nowrap pointer-events-none z-20">
                        {coords.label}
                      </span>
                    </div>
                  )}

                  {/* Summary Bracket Bar */}
                  {coords.type === "summary-bracket" && (
                    <div
                      className="absolute h-3.5 rounded-xs bg-blue-600 shadow-2xs flex items-center"
                      style={{
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                      }}
                    >
                      {/* Left and right downward bracket hooks */}
                      <span className="absolute -bottom-1.5 left-0 h-2 w-1.5 bg-blue-600 rounded-bl-xs" />
                      <span className="absolute -bottom-1.5 right-0 h-2 w-1.5 bg-blue-600 rounded-br-xs" />

                      {/* Diamond Milestone at end if applicable */}
                      {coords.hasMilestone && (
                        <div className="absolute -right-2.5 h-3 w-3 rotate-45 bg-slate-800 shadow-xs" />
                      )}
                    </div>
                  )}

                  {/* Selected Task Bar (Level 2 - Columns) */}
                  {coords.type === "selected-columns" && (
                    <div
                      className="absolute h-6 rounded-md border-2 border-blue-600 bg-blue-100/95 shadow-xs flex items-center justify-between px-2 text-blue-900 font-semibold text-[10px] tracking-tight transition-all relative overflow-visible z-20"
                      style={{
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                      }}
                    >
                      {/* Inner Progress Fill */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-blue-300/60 rounded-l-xs pointer-events-none"
                        style={{ width: `${task.progress}%` }}
                      />

                      {/* Text Label inside bar - fits cleanly without truncation */}
                      <span className="relative z-10 whitespace-nowrap pr-1">
                        {coords.label}
                      </span>

                      {/* Milestone Diamond at finish edge */}
                      {coords.hasMilestone && (
                        <div className="absolute -right-2 h-3.5 w-3.5 rotate-45 bg-slate-800 shadow-xs z-20" />
                      )}
                    </div>
                  )}

                  {/* In-Progress Blue Task Bar */}
                  {coords.type === "task-blue" && (
                    <div
                      className="absolute h-5 rounded-md bg-blue-400 shadow-2xs transition-all hover:bg-blue-500 flex items-center px-2 relative group overflow-visible z-15"
                      style={{
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                      }}
                    >
                      {/* Inner progress tint */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-blue-600/30 rounded-l-md pointer-events-none"
                        style={{ width: `${task.progress}%` }}
                      />

                      {/* Text label cleanly centered inside bar */}
                      <span className="relative z-10 text-[10.5px] font-medium text-white truncate w-full text-center">
                        {coords.label}
                      </span>
                    </div>
                  )}

                  {/* Not Started / Future Gray Task Bar */}
                  {coords.type === "task-gray" && (
                    <div
                      className="absolute h-5 rounded-md border border-slate-300 bg-slate-200/80 shadow-2xs flex items-center px-2 relative group overflow-visible z-15"
                      style={{
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                      }}
                    >
                      {/* Label cleanly inside bar */}
                      <span className="relative z-10 text-[10.5px] font-medium text-slate-600 truncate w-full text-center">
                        {coords.label}
                      </span>
                    </div>
                  )}

                  {/* Milestone Diamond Bar */}
                  {coords.type === "milestone-diamond" && (
                    <div
                      className="absolute flex items-center z-20"
                      style={{ left: `${coords.left}px` }}
                    >
                      <div className="h-4.5 w-4.5 rotate-45 bg-amber-500 shadow-xs ring-2 ring-white" />
                      <span className="ml-3 whitespace-nowrap text-[11px] font-semibold text-slate-800">
                        {coords.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Gantt Mini-Map / Navigator Overlay (Toggled from bottom bar) */}
      {showNavigator && (
        <div className="absolute bottom-13 left-4 z-30 flex flex-col rounded-xl border border-slate-200/90 bg-white/95 p-2 shadow-lg backdrop-blur-md w-52 select-none pointer-events-auto">
          <div className="flex items-center justify-between text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <Compass className="h-3 w-3 text-blue-600" />
              Timeline Navigator
            </span>
            <button
              onClick={() => setShowNavigator(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Micro Bird's Eye Overview */}
          <div className="relative h-11 w-full rounded-md bg-slate-50/80 border border-slate-100 overflow-hidden px-1 py-1 flex flex-col justify-between">
            <div className="flex items-center gap-1 w-full">
              <div className="h-1 rounded-full bg-emerald-400 w-4" />
              <div className="h-1 rounded-full bg-emerald-500 w-6" />
            </div>
            <div className="h-1 rounded-full bg-blue-500 w-22 ml-4" />
            <div className="flex items-center gap-1 w-full ml-11">
              <div className="h-1 rounded-full bg-blue-400 w-6" />
              <div className="h-1 rounded-full bg-blue-600 w-8" />
              <div className="h-1 rounded-full bg-slate-300 w-5" />
            </div>
            <div className="flex items-center gap-1 w-full ml-24">
              <div className="h-1 rounded-full bg-cyan-400 w-10" />
              <div className="h-1 rounded-full bg-slate-300 w-8" />
              <div className="h-1.5 w-1.5 rotate-45 bg-amber-500 ml-1" />
            </div>

            {/* Viewport Highlight Rectangle */}
            <div
              className="absolute inset-y-0.5 border-1.5 border-blue-500 bg-blue-500/15 rounded-xs pointer-events-none"
              style={{ left: "4px", width: "64px" }}
            />
          </div>
        </div>
      )}

      {/* Hover Floating Tooltip */}
      {hoveredTask && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-slate-900 px-2.5 py-1.5 text-white shadow-xl backdrop-blur-md"
          style={{ left: `${hoveredTask.x + 516}px`, top: `${hoveredTask.y}px` }}
        >
          <div className="text-[11.5px] font-bold">{hoveredTask.task.name}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-300 font-mono">
            <span>{hoveredTask.task.displayStart}</span>
            <span>→</span>
            <span>{hoveredTask.task.displayEnd}</span>
            <span>·</span>
            <span className="font-semibold text-emerald-400">
              {hoveredTask.task.progress}% done
            </span>
          </div>
        </div>
      )}

      {/* Bottom Status / Critical Path / Zoom Toolbar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 text-[12px] text-slate-600 select-none">
        {/* Left: Status Dot Legend */}
        <div className="flex items-center gap-4 text-[11.5px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>On track</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>At risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span>Not started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rotate-45 bg-slate-800" />
            <span>Milestone</span>
          </div>
        </div>

        {/* Center / Right: Navigator Toggle + Zoom Controls + Task Count */}
        <div className="flex items-center gap-3.5 text-[12px]">
          {/* Navigator Toggle Button */}
          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              showNavigator
                ? "border-blue-400 bg-blue-50 text-blue-700 shadow-2xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
            }`}
            title="Toggle Gantt Mini-Map Navigator"
          >
            <Compass className="h-3.5 w-3.5 text-blue-600" />
            <span>Navigator</span>
          </button>

          {/* Zoom In / Out Controls */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 text-slate-600 shadow-2xs">
            <button
              title="Zoom out"
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100 text-slate-600"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-medium text-slate-700">
              100%
            </span>
            <button
              title="Zoom in"
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100 text-slate-600"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {/* Auto-Fit / Maximize Button */}
          <button
            title="Fit to timeline"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {/* Tasks Shown Counter + View All */}
          <div className="flex items-center gap-1.5 text-[11.5px] pl-1">
            <span className="text-slate-500">144 tasks shown of 817</span>
            <span className="text-slate-300">·</span>
            <button className="font-semibold text-blue-600 hover:underline">
              View all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
