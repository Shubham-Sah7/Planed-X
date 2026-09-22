"use client";

import React, { useState, useMemo } from "react";
import { useProgramme } from "@/lib/programme-context";
import {
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Plus,
  MoreVertical,
  Check,
  MessageSquare,
  Paperclip,
  SlidersHorizontal,
  Search,
  X,
  Layers,
  Sparkles,
  ChevronLeft,
  Flag,
  Flame,
} from "lucide-react";
import { CalendarPopover } from "./calendar-popover";

export type CalendarSubView = "board" | "month" | "week";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface TagItem {
  label: string;
  bgClass: string;
  textClass: string;
}

interface AssigneeItem {
  name: string;
  initials: string;
  avatarBg: string;
}

interface KanbanTask {
  id: string;
  columnId: "todo" | "in-progress" | "in-review" | "done";
  title: string;
  tags: TagItem[];
  bgClass: string;
  borderClass: string;
  dotActiveColor: string;
  checklist?: ChecklistItem[];
  note?: string;
  imagePreview?: string;
  progress: number;
  assignees: AssigneeItem[];
  commentsCount: number;
  attachmentsCount: number;
}

const INITIAL_BOARD_TASKS: KanbanTask[] = [
  // COLUMN 1: Todo list
  {
    id: "task-todo-1",
    columnId: "todo",
    title: "Ground beam rebar installation - North Zone",
    tags: [
      { label: "structural", bgClass: "bg-blue-100/90", textClass: "text-blue-800" },
      { label: "foundations", bgClass: "bg-blue-100/90", textClass: "text-blue-800" },
    ],
    bgClass: "bg-[#edf5ff]",
    borderClass: "border-blue-200/70",
    dotActiveColor: "bg-blue-600",
    note: "Reinforcement delivery arriving Wednesday 08:30 AM",
    progress: 40,
    assignees: [
      { name: "John Smith", initials: "JS", avatarBg: "bg-blue-600" },
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },
  {
    id: "task-todo-2",
    columnId: "todo",
    title: "Basement slab dual-layer waterproofing membrane",
    tags: [
      { label: "waterproofing", bgClass: "bg-purple-100/90", textClass: "text-purple-800" },
      { label: "substructure", bgClass: "bg-purple-100/90", textClass: "text-purple-800" },
    ],
    bgClass: "bg-[#f5f0ff]",
    borderClass: "border-purple-200/70",
    dotActiveColor: "bg-purple-600",
    checklist: [
      { id: "c1", text: "Surface priming & substrate prep", done: true },
      { id: "c2", text: "Dual-layer bituthene torch-on applied", done: true },
      { id: "c3", text: "Perimeter toe fillet & waterstop fixed", done: false },
      { id: "c4", text: "Flood test & hydrostatic signoff", done: false },
    ],
    note: "Specialist warranty inspector onsite at 14:00",
    progress: 15,
    assignees: [
      { name: "Sarah Chen", initials: "SC", avatarBg: "bg-purple-600" },
      { name: "David Wilson", initials: "DW", avatarBg: "bg-amber-600" },
    ],
    commentsCount: 7,
    attachmentsCount: 2,
  },
  {
    id: "task-todo-3",
    columnId: "todo",
    title: "Laser grid layout check before blockwork commencement",
    tags: [
      { label: "survey", bgClass: "bg-rose-100/90", textClass: "text-rose-800" },
      { label: "qa-setout", bgClass: "bg-rose-100/90", textClass: "text-rose-800" },
    ],
    bgClass: "bg-[#fff1f2]",
    borderClass: "border-rose-200/70",
    dotActiveColor: "bg-rose-600",
    note: "Total station benchmark recalibrated yesterday",
    progress: 30,
    assignees: [
      { name: "Sarah Chen", initials: "SC", avatarBg: "bg-purple-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },

  // COLUMN 2: In Progress
  {
    id: "task-columns",
    columnId: "in-progress",
    title: "Level 2 - Columns Formwork & Pour #4",
    tags: [
      { label: "structural", bgClass: "bg-amber-100/90", textClass: "text-amber-800" },
      { label: "columns", bgClass: "bg-amber-100/90", textClass: "text-amber-800" },
    ],
    bgClass: "bg-[#fffbeb]",
    borderClass: "border-amber-200/80",
    dotActiveColor: "bg-amber-600",
    imagePreview: "/bim-hero-clean.jpg",
    note: "Have to finish this pour before weekend weather",
    progress: 90,
    assignees: [
      { name: "John Smith", initials: "JS", avatarBg: "bg-blue-600" },
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
      { name: "David Wilson", initials: "DW", avatarBg: "bg-amber-600" },
    ],
    commentsCount: 6,
    attachmentsCount: 1,
  },
  {
    id: "task-prog-2",
    columnId: "in-progress",
    title: "Tower crane erection & load calibration certificate",
    tags: [
      { label: "crane", bgClass: "bg-emerald-100/90", textClass: "text-emerald-800" },
      { label: "logistics", bgClass: "bg-emerald-100/90", textClass: "text-emerald-800" },
    ],
    bgClass: "bg-[#ecfdf5]",
    borderClass: "border-emerald-200/70",
    dotActiveColor: "bg-emerald-600",
    checklist: [
      { id: "p1", text: "Outrigger spreader pads positioned", done: true },
      { id: "p2", text: "55m jib counterweights balanced", done: true },
      { id: "p3", text: "15-tonne proof test lift with appointed person", done: false },
    ],
    note: "Appointed lifting supervisor signed certificate",
    progress: 40,
    assignees: [
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
      { name: "Mike Johnson", initials: "MJ", avatarBg: "bg-rose-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },

  // COLUMN 3: In Review
  {
    id: "task-review-1",
    columnId: "in-review",
    title: "#17 Quality Inspection - Column Slump Test & Compressive Cube",
    tags: [
      { label: "inspection", bgClass: "bg-pink-100/90", textClass: "text-pink-800" },
      { label: "qa", bgClass: "bg-pink-100/90", textClass: "text-pink-800" },
    ],
    bgClass: "bg-[#fdf2f8]",
    borderClass: "border-pink-200/70",
    dotActiveColor: "bg-pink-600",
    note: "Inspector approved slump: 115mm (normal spec 120mm)",
    progress: 70,
    assignees: [
      { name: "Sarah Chen", initials: "SC", avatarBg: "bg-purple-600" },
      { name: "John Smith", initials: "JS", avatarBg: "bg-blue-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },
  {
    id: "task-review-2",
    columnId: "in-review",
    title: "Unitised curtain wall bracket verification & wind-load check",
    tags: [
      { label: "envelope", bgClass: "bg-sky-100/90", textClass: "text-sky-800" },
      { label: "facade", bgClass: "bg-sky-100/90", textClass: "text-sky-800" },
    ],
    bgClass: "bg-[#f0f9ff]",
    borderClass: "border-sky-200/70",
    dotActiveColor: "bg-sky-600",
    note: "Deflection test calculations submitted to council",
    progress: 60,
    assignees: [
      { name: "David Wilson", initials: "DW", avatarBg: "bg-amber-600" },
      { name: "Sarah Chen", initials: "SC", avatarBg: "bg-purple-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },
  {
    id: "task-review-3",
    columnId: "in-review",
    title: "Underground stormwater pit C oil & silt interceptor",
    tags: [
      { label: "civils", bgClass: "bg-amber-100/90", textClass: "text-amber-800" },
      { label: "attenuation", bgClass: "bg-amber-100/90", textClass: "text-amber-800" },
    ],
    bgClass: "bg-[#fffbeb]",
    borderClass: "border-amber-200/70",
    dotActiveColor: "bg-amber-600",
    note: "Discharge consent signed off by environmental inspector",
    progress: 50,
    assignees: [
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },
  {
    id: "task-review-4",
    columnId: "in-review",
    title: "Level 2 temporary dry riser fire standpipe extension",
    tags: [
      { label: "fire-safety", bgClass: "bg-violet-100/90", textClass: "text-violet-800" },
      { label: "m&e", bgClass: "bg-violet-100/90", textClass: "text-violet-800" },
    ],
    bgClass: "bg-[#f5f3ff]",
    borderClass: "border-violet-200/70",
    dotActiveColor: "bg-violet-600",
    note: "12-bar hydrostatic pressure test certified",
    progress: 80,
    assignees: [
      { name: "Mike Johnson", initials: "MJ", avatarBg: "bg-rose-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },

  // COLUMN 4: Done
  {
    id: "task-site-est",
    columnId: "done",
    title: "Site Establishment & Boundary Hoarding Handover",
    tags: [
      { label: "preliminaries", bgClass: "bg-cyan-100/90", textClass: "text-cyan-800" },
      { label: "site-setup", bgClass: "bg-cyan-100/90", textClass: "text-cyan-800" },
    ],
    bgClass: "bg-[#ecfeff]",
    borderClass: "border-cyan-200/70",
    dotActiveColor: "bg-cyan-600",
    checklist: [
      { id: "d1", text: "2.4m timber perimeter hoarding erected", done: true },
      { id: "d2", text: "Site safety signage & viewing panels", done: true },
      { id: "d3", text: "Temporary power & builder water connected", done: true },
      { id: "d4", text: "HSE welfare facilities double-stacked", done: true },
      { id: "d5", text: "Local authority road permit approved", done: true },
    ],
    note: "Practical completion signoff archived",
    progress: 100,
    assignees: [
      { name: "John Smith", initials: "JS", avatarBg: "bg-blue-600" },
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
      { name: "David Wilson", initials: "DW", avatarBg: "bg-amber-600" },
    ],
    commentsCount: 7,
    attachmentsCount: 2,
  },
  {
    id: "task-done-2",
    columnId: "done",
    title: "CFA Continuous Flight Auger Piling (84 Piles Complete)",
    tags: [
      { label: "piling", bgClass: "bg-orange-100/90", textClass: "text-orange-800" },
      { label: "foundations", bgClass: "bg-orange-100/90", textClass: "text-orange-800" },
    ],
    bgClass: "bg-[#fff7ed]",
    borderClass: "border-orange-200/70",
    dotActiveColor: "bg-orange-600",
    note: "All sonic integrity logging reports signed off",
    progress: 100,
    assignees: [
      { name: "Tom Harris", initials: "TH", avatarBg: "bg-emerald-600" },
      { name: "Sarah Chen", initials: "SC", avatarBg: "bg-purple-600" },
    ],
    commentsCount: 12,
    attachmentsCount: 8,
  },
];

const COLUMNS = [
  { id: "todo", title: "Todo list" },
  { id: "in-progress", title: "In Progress" },
  { id: "in-review", title: "In Review" },
  { id: "done", title: "Done" },
];

const TEAM_MEMBERS = [
  { name: "John Smith", initials: "JS", role: "Project Manager", bg: "bg-blue-600" },
  { name: "Tom Harris", initials: "TH", role: "Site Supervisor", bg: "bg-emerald-600" },
  { name: "Sarah Chen", initials: "SC", role: "Structural Engineer", bg: "bg-purple-600" },
  { name: "David Wilson", initials: "DW", role: "HSE Manager", bg: "bg-amber-600" },
  { name: "Mike Johnson", initials: "MJ", role: "M&E Coordinator", bg: "bg-rose-600" },
];

// Reusable Dotted Progress Bar (10 round dots + percentage) matching the reference image
function DottedProgressBar({
  progress,
  activeClass,
  inactiveClass = "bg-black/10",
}: {
  progress: number;
  activeClass: string;
  inactiveClass?: string;
}) {
  const filledCount = Math.min(10, Math.max(0, Math.round(progress / 10)));
  return (
    <div className="flex items-center justify-between select-none pt-0.5">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i < filledCount ? activeClass : inactiveClass
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-[12px] text-slate-700 font-mono">
        {progress}%
      </span>
    </div>
  );
}

export function CalendarView() {
  const { openDrawer, selectTask } = useProgramme();

  // View mode: "board" (Kanban daily tasks matching reference) or "month" (monthly grid)
  const [subView, setSubView] = useState<CalendarSubView>("board");
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_BOARD_TASKS);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState<boolean>(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newTaskColumn, setNewTaskColumn] = useState<KanbanTask["columnId"]>("todo");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  // Toggle checklist item
  const toggleChecklist = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.checklist) return t;
        const updated = t.checklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        const doneCount = updated.filter((item) => item.done).length;
        const newProgress = Math.round((doneCount / updated.length) * 100);
        return {
          ...t,
          checklist: updated,
          progress: newProgress,
        };
      })
    );
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (!selectedAssignee) return tasks;
    return tasks.filter((t) =>
      t.assignees.some((a) => a.initials === selectedAssignee)
    );
  }, [tasks, selectedAssignee]);

  // Create new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-custom-${Date.now()}`,
      columnId: newTaskColumn,
      title: newTaskTitle.trim(),
      tags: [
        { label: "site-task", bgClass: "bg-blue-100/90", textClass: "text-blue-800" },
      ],
      bgClass: "bg-[#edf5ff]",
      borderClass: "border-blue-200/70",
      dotActiveColor: "bg-blue-600",
      progress: 0,
      assignees: [{ name: "John Smith", initials: "JS", avatarBg: "bg-blue-600" }],
      commentsCount: 0,
      attachmentsCount: 0,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    setCreateModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full rounded-2xl border border-slate-200/70 bg-gradient-to-tr from-[#f8fafc] via-[#faf5ff]/20 to-[#fff1f2]/20 p-5 shadow-2xs overflow-hidden select-none">
      {/* 1. Sub-Header: Month/Date, Board-Daily Tasks dropdown, Avatars, Filters, + Create task */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60 shrink-0">
        {/* Left: Month title & date */}
        <div className="flex flex-col">
          <h2 className="text-[22px] font-bold tracking-tight text-slate-900 leading-tight">
            May
          </h2>
          <span className="text-[12px] font-medium text-slate-500 mt-0.5">
            Today is Saturday, Jul 9th, 2023 · Building 2 & Unit 80
          </span>
        </div>

        {/* Center: View Dropdown / Segment Pill (Board - Daily Tasks ▾) */}
        <div className="relative">
          <button
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-1.5 text-[13px] font-semibold text-slate-700 shadow-2xs backdrop-blur-md hover:bg-white transition-colors"
          >
            <span>
              {subView === "board"
                ? "Board — Daily Tasks"
                : subView === "month"
                ? "Monthly Calendar Grid"
                : "Weekly Schedule Planner"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {viewDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <button
                onClick={() => {
                  setSubView("board");
                  setViewDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] transition-colors ${
                  subView === "board"
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Board — Daily Tasks</span>
                {subView === "board" && <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => {
                  setSubView("month");
                  setViewDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] transition-colors ${
                  subView === "month"
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Monthly Calendar Grid</span>
                {subView === "month" && <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => {
                  setSubView("week");
                  setViewDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] transition-colors ${
                  subView === "week"
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Weekly Schedule Planner</span>
                {subView === "week" && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Right: Team Avatars, Filters, + Create task */}
        <div className="flex items-center gap-3">
          {/* 5 Overlapping Team Avatars */}
          <div className="flex items-center -space-x-2">
            {TEAM_MEMBERS.map((m) => {
              const isSelected = selectedAssignee === m.initials;
              return (
                <button
                  key={m.initials}
                  onClick={() =>
                    setSelectedAssignee(isSelected ? null : m.initials)
                  }
                  title={`${m.name} (${m.role})`}
                  className={`relative h-7 w-7 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white shadow-2xs transition-transform hover:scale-110 hover:z-20 ${
                    m.bg
                  } ${isSelected ? "ring-blue-600 scale-110 z-20" : ""}`}
                >
                  {m.initials}
                </button>
              );
            })}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold shadow-2xs transition-colors ${
              filterPanelOpen
                ? "border-blue-400 bg-blue-50 text-blue-700"
                : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Filters</span>
          </button>

          {/* + Create task Button */}
          <button
            onClick={() => {
              setNewTaskColumn("todo");
              setCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-black transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create task</span>
          </button>
        </div>
      </div>

      {/* 2. Board View (Kanban with Pastel Tinted Cards matching user's image) */}
      {subView === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 flex-1 items-start overflow-y-auto pr-1">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-slate-100/50 border border-slate-200/40 p-3 min-w-0"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 mb-3 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-[14px]">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span>{col.title}</span>
                    <span className="text-[11px] font-medium text-slate-400 ml-1">
                      ({colTasks.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => {
                        setNewTaskColumn(col.id as any);
                        setCreateModalOpen(true);
                      }}
                      className="h-6 w-6 rounded hover:bg-slate-200/60 hover:text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-6 w-6 rounded hover:bg-slate-200/60 hover:text-slate-700 flex items-center justify-center transition-colors">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3.5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        selectTask(task.id);
                        openDrawer(task.id);
                      }}
                      className={`group rounded-2xl border p-4 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer ${task.bgClass} ${task.borderClass}`}
                    >
                      {/* Top Row: Tag Pills + Action Menu */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {task.tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight ${tag.bgClass} ${tag.textClass}`}
                            >
                              #{tag.label}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Task Title */}
                      <h4 className="font-bold text-[13.5px] leading-snug text-slate-900 mb-2">
                        {task.title}
                      </h4>

                      {/* Optional Thumbnail Image Preview (Matching Image) */}
                      {task.imagePreview && (
                        <div className="my-2.5 rounded-xl overflow-hidden border border-slate-200/60 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={task.imagePreview}
                            alt="Construction preview"
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback graceful graphic if path not resolved
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Optional Checklist Items with Round Checkmarks */}
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="my-2 space-y-1.5">
                          {task.checklist.map((item) => (
                            <div
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChecklist(task.id, item.id);
                              }}
                              className="flex items-start gap-2 text-[11.5px] text-slate-700 cursor-pointer"
                            >
                              {item.done ? (
                                <div className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8.5px] font-bold shrink-0 mt-0.5">
                                  ✓
                                </div>
                              ) : (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={
                                  item.done
                                    ? "line-through text-slate-400"
                                    : "font-medium"
                                }
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Optional Note Field */}
                      {task.note && (
                        <div className="text-[11px] font-medium text-slate-500 italic mt-2 mb-2.5">
                          {task.note.startsWith("Note:") || task.note.startsWith("Have")
                            ? task.note
                            : `Note: ${task.note}`}
                        </div>
                      )}

                      {/* Dotted Progress Bar */}
                      <div className="mt-2.5 pt-1 border-t border-black/5">
                        <DottedProgressBar
                          progress={task.progress}
                          activeClass={task.dotActiveColor}
                        />
                      </div>

                      {/* Footer: Overlapping Avatars + Counts */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5">
                        {/* Overlapping Avatars */}
                        <div className="flex items-center -space-x-1.5">
                          {task.assignees.map((a) => (
                            <div
                              key={a.name}
                              className={`h-5.5 w-5.5 rounded-full ring-2 ring-white flex items-center justify-center text-[8.5px] font-bold text-white ${a.avatarBg}`}
                              title={a.name}
                            >
                              {a.initials}
                            </div>
                          ))}
                        </div>

                        {/* Counts (Comments & Attachments) */}
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-slate-400" />
                            <span>{task.commentsCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3 text-slate-400" />
                            <span>{task.attachmentsCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Monthly Calendar Grid (Accessible via Dropdown) */}
      {subView === "month" && (
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs mt-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-900">
              August 2025 Schedule
            </h3>
            <span className="text-[12px] text-slate-500 font-medium">
              31 Days Planned
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="py-1 text-center font-bold text-[12px] text-slate-400"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className="h-24 p-2 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-blue-50/40 hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
              >
                <span className="text-[12px] font-bold text-slate-700">
                  {i + 1}
                </span>
                {i === 11 && (
                  <div className="rounded-md bg-blue-100 border border-blue-200 p-1 text-[10px] font-semibold text-blue-900 truncate">
                    Level 2 Columns Pour
                  </div>
                )}
                {i === 15 && (
                  <div className="rounded-md bg-emerald-100 border border-emerald-200 p-1 text-[10px] font-semibold text-emerald-900 truncate">
                    Crane Load Test
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Weekly Schedule Planner (Accessible via Dropdown) */}
      {subView === "week" && (
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs mt-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-900">
              Week 42 (13 Oct – 19 Oct 2025)
            </h3>
            <span className="text-[12px] text-slate-500 font-medium">
              Daily Shift Handover
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3 mt-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, idx) => (
              <div
                key={day}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 min-h-[300px]"
              >
                <div className="font-bold text-[13px] text-slate-800 pb-2 border-b border-slate-200">
                  {day} <span className="text-slate-400 font-normal">Oct {13 + idx}</span>
                </div>
                <div className="space-y-2.5 mt-2.5">
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 text-[11.5px] text-blue-950 font-medium shadow-2xs">
                    08:00 Concrete boom pump positioning
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[11.5px] text-amber-950 font-medium shadow-2xs">
                    13:30 HSE scaffold safety audit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Task */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[16px] text-slate-900">
                Create Daily Schedule Task
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Core wall lift #3 concrete placement"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Target Column
                </label>
                <select
                  value={newTaskColumn}
                  onChange={(e) => setNewTaskColumn(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">Todo list</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[12.5px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-[12.5px] font-semibold shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
