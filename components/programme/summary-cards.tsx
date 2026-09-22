"use client";

import React from "react";
import {
  LayoutGrid,
  List,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Flag,
  ChevronRight,
  X,
  SlidersHorizontal,
  MinusCircle,
  Link2,
  TrendingUp,
} from "lucide-react";
import { useProgramme } from "@/lib/programme-context";

export function SummaryCards() {
  const {
    state,
    attentionFilter,
    setAttentionFilter,
    clearFilters,
    criticalPathActive,
    toggleCriticalPath,
  } = useProgramme();

  const isNetwork = state.activeView === "network";
  const isList = state.activeView === "list";
  const isCalendar = state.activeView === "calendar";
  const isGantt = state.activeView === "gantt";

  if (isGantt) {
    if (attentionFilter !== "all") {
      return (
        <div className="mb-3.5 flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-[13px] text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold capitalize">Filtered by:</span>
            <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-blue-200 shadow-2xs">
              {attentionFilter === "overdue" && "5 Overdue Tasks"}
              {attentionFilter === "blocked" && "3 Blocked Tasks"}
              {attentionFilter === "due-this-week" && "12 Tasks Due This Week"}
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear filter
          </button>
        </div>
      );
    }
    return null;
  }

  if (isCalendar) {
    return (
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {/* Card 1: 324 Total Tasks */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[19px] font-bold text-slate-900 leading-none">
                  324
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Total Tasks
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 60 Complete (18% Donut) */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500"
                  strokeDasharray="18, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9.5px] font-bold text-slate-700">18%</span>
            </div>
            <div>
              <div className="text-[19px] font-bold text-slate-900 leading-none">
                60
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                Complete
              </div>
            </div>
          </div>

          {/* Card 3: 28 Blocked */}
          <button
            onClick={() =>
              setAttentionFilter(attentionFilter === "blocked" ? "all" : "blocked")
            }
            className={`flex items-center justify-between rounded-xl border p-2.5 shadow-2xs transition-all text-left ${
              attentionFilter === "blocked"
                ? "border-red-400 bg-red-50/50 ring-2 ring-red-100"
                : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="text-[19px] font-bold text-red-600 leading-none">
                  28
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Blocked
                </div>
              </div>
            </div>
          </button>

          {/* Card 4: 21% Overall Progress */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[19px] font-bold text-slate-900 leading-none">
                21%
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                Overall Progress
              </div>
            </div>
          </div>

          {/* Card 5: 30 Critical Tasks */}
          <button
            onClick={toggleCriticalPath}
            className={`flex items-center justify-between rounded-xl border p-2.5 shadow-2xs transition-all text-left ${
              criticalPathActive
                ? "border-red-300 bg-red-50/40 ring-2 ring-red-100/80"
                : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Link2 className="h-4 w-4 -rotate-45" />
              </div>
              <div>
                <div className="text-[19px] font-bold text-slate-900 leading-none">
                  30
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Critical Tasks
                </div>
              </div>
            </div>
          </button>

          {/* Card 6: Next Milestone */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Flag className="h-4 w-4 fill-amber-500 text-amber-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                  Next Milestone
                </div>
                <div className="text-[11.5px] font-bold text-slate-900 truncate mt-0.5 leading-tight">
                  Superstructure Complete
                </div>
                <div className="text-[10.5px] font-semibold text-blue-600 leading-none mt-0.5">
                  16 Apr 2026
                </div>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 ml-0.5" />
          </div>
        </div>

        {/* Active Attention Filter Banner if applied */}
        {attentionFilter !== "all" && (
          <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-[13px] text-red-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Showing:</span>
              <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-red-200 shadow-2xs text-red-700">
                28 Blocked Tasks
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-red-700 hover:bg-red-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear filter
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isNetwork || isList) {
    return (
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* Card 1: 324 Total Tasks */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <List className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-slate-900 leading-none">
                  324
                </div>
                <div className="text-[11.5px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Total Tasks
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 60 Complete (18% Donut) */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500"
                  strokeDasharray="18, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-700">18%</span>
            </div>
            <div>
              <div className="text-[20px] font-bold text-slate-900 leading-none">
                60
              </div>
              <div className="text-[11.5px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                Complete
              </div>
            </div>
          </div>

          {/* Card 3: 28 Blocked */}
          <button
            onClick={() =>
              setAttentionFilter(attentionFilter === "blocked" ? "all" : "blocked")
            }
            className={`flex items-center justify-between rounded-xl border p-3 shadow-2xs transition-all text-left ${
              attentionFilter === "blocked"
                ? "border-red-400 bg-red-50/50 ring-2 ring-red-100"
                : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-red-600 leading-none">
                  28
                </div>
                <div className="text-[11.5px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Blocked
                </div>
              </div>
            </div>
          </button>

          {/* Card 4: Overall Progress (21% on List, 30 Critical on Network) */}
          {isList ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-slate-900 leading-none">
                  21%
                </div>
                <div className="text-[11.5px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  Overall Progress
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={toggleCriticalPath}
              className={`flex items-center justify-between rounded-xl border p-3 shadow-2xs transition-all text-left ${
                criticalPathActive
                  ? "border-red-300 bg-red-50/40 ring-2 ring-red-100/80"
                  : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Link2 className="h-5 w-5 -rotate-45" />
                </div>
                <div>
                  <div className="text-[20px] font-bold text-slate-900 leading-none">
                    30
                  </div>
                  <div className="text-[11.5px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                    Critical Tasks
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </button>
          )}

          {/* Card 5: Next Milestone */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Flag className="h-4 w-4 fill-amber-500 text-amber-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                  Next Milestone
                </div>
                <div className="text-[12.5px] font-bold text-slate-900 truncate mt-1 leading-tight">
                  Superstructure Complete
                </div>
                <div className="text-[11.5px] font-semibold text-blue-600 leading-none mt-1">
                  16 Apr 2026
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 ml-1" />
          </div>
        </div>

        {/* Active Attention Filter Banner if applied */}
        {attentionFilter !== "all" && (
          <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-[13px] text-red-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Showing:</span>
              <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-red-200 shadow-2xs text-red-700">
                28 Blocked Tasks
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-red-700 hover:bg-red-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear filter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-5">
      {/* 6 Metric Cards Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {/* Card 1: Total Tasks */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-2.5 px-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[19px] font-bold text-slate-900 leading-none">
                817
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">
                Total Tasks
              </div>
            </div>
          </div>
          <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-50 text-blue-600">
            <List className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card 2: Overall Progress */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 px-3 shadow-2xs hover:border-slate-300 transition-colors">
          {/* Donut Progress Ring */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray="48, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <div>
            <div className="text-[19px] font-bold text-slate-900 leading-none">
              48%
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">
              Overall Progress
            </div>
          </div>
        </div>

        {/* Card 3: Overdue (Clickable Filter) */}
        <button
          onClick={() =>
            setAttentionFilter(attentionFilter === "overdue" ? "all" : "overdue")
          }
          className={`flex items-center justify-between rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
            attentionFilter === "overdue"
              ? "border-red-400 bg-red-50/50 ring-2 ring-red-100"
              : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold text-[10px]">
                !
              </div>
            </div>
            <div>
              <div className="text-[19px] font-bold text-red-500 leading-none">
                5
              </div>
              <div className="text-[11px] font-medium text-red-600 mt-0.5 whitespace-nowrap">
                Overdue
              </div>
            </div>
          </div>
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${
              attentionFilter === "overdue"
                ? "text-red-500 translate-x-0.5"
                : "text-slate-300"
            }`}
          />
        </button>

        {/* Card 4: Blocked (Clickable Filter) */}
        <button
          onClick={() =>
            setAttentionFilter(attentionFilter === "blocked" ? "all" : "blocked")
          }
          className={`flex items-center justify-between rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
            attentionFilter === "blocked"
              ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-100"
              : "border-slate-200/70 bg-white hover:border-amber-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <AlertTriangle className="h-4 w-4 fill-amber-500 text-amber-50" />
            </div>
            <div>
              <div className="text-[19px] font-bold text-amber-600 leading-none">
                3
              </div>
              <div className="text-[11px] font-medium text-amber-600 mt-0.5 whitespace-nowrap">
                Blocked
              </div>
            </div>
          </div>
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${
              attentionFilter === "blocked"
                ? "text-amber-500 translate-x-0.5"
                : "text-slate-300"
            }`}
          />
        </button>

        {/* Card 5: Due This Week (Clickable Filter) */}
        <button
          onClick={() =>
            setAttentionFilter(
              attentionFilter === "due-this-week" ? "all" : "due-this-week",
            )
          }
          className={`flex items-center justify-between rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
            attentionFilter === "due-this-week"
              ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-100"
              : "border-slate-200/70 bg-white hover:border-blue-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[19px] font-bold text-blue-600 leading-none">
                12
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">
                Due This Week
              </div>
            </div>
          </div>
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${
              attentionFilter === "due-this-week"
                ? "text-blue-500 translate-x-0.5"
                : "text-slate-300"
            }`}
          />
        </button>

        {/* Card 6: Next Milestone */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-2.5 px-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Flag className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                Next Milestone
              </div>
              <div className="text-[12px] font-bold text-slate-900 truncate mt-0.5 leading-tight">
                Level 3 Complete
              </div>
              <div className="text-[11px] font-medium text-blue-600 leading-none mt-0.5">
                16 Apr 2026
              </div>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 ml-1" />
        </div>
      </div>

      {/* Active Attention Filter Banner */}
      {attentionFilter !== "all" && (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-[13px] text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold capitalize">Filtered by:</span>
            <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-blue-200 shadow-2xs">
              {attentionFilter === "overdue" && "5 Overdue Tasks"}
              {attentionFilter === "blocked" && "3 Blocked Tasks"}
              {attentionFilter === "due-this-week" && "12 Tasks Due This Week"}
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
