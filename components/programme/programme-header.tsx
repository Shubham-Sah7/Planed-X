"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Upload,
  Download,
  MoreHorizontal,
  Check,
  ChevronRight,
  Building2,
  MapPin,
  Calendar as CalendarIcon,
  LayoutGrid,
  AlertTriangle,
} from "lucide-react";
import { useProgramme } from "@/lib/programme-context";
import { BimDigitalTwinHero } from "./bim/bim-digital-twin-hero";

const FORECAST_OPTIONS = [
  { id: "wf", label: "Working Forecast", state: "Live", isCurrent: true },
  { id: "b0", label: "Baseline 0 (Contract)", state: "Locked", isCurrent: false },
  { id: "ab1", label: "Approved Baseline 1.1", state: "Approved", isCurrent: false },
];

export function ProgrammeHeader() {
  const { state, attentionFilter, setAttentionFilter } = useProgramme();
  const [selectedForecast, setSelectedForecast] = useState("Working Forecast");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isNetwork = state.activeView === "network";
  const isGantt = state.activeView === "gantt";

  // 1. Gantt / Homepage View: Split Layout with 3D BIM Digital Twin Hero (Image 4)
  if (isGantt) {
    return (
      <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between pb-3 pt-0.5 select-none w-full">
        {/* Left Side: Title, Subtitle, Location Badges & 5 KPI Cards */}
        <div className="flex-1 min-w-0 pr-0 xl:pr-3">
          {/* Header Title & Subtitle */}
          <div>
            <h1 className="text-[23px] font-bold tracking-tight text-slate-900 leading-tight">
              Programme Management
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Plan, track and deliver your construction programme.
            </p>
          </div>

          {/* Location & Programme Metadata Badges (Matching Image 4) */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/90 border border-slate-200/70 px-2.5 py-1 text-[11.5px] font-medium text-slate-700 shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Building 2 & Unit 80</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/90 border border-slate-200/70 px-2.5 py-1 text-[11.5px] font-medium text-slate-700 shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>Siliguri, WB</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/90 border border-slate-200/70 px-2.5 py-1 text-[11.5px] font-medium text-slate-700 shadow-2xs">
              <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
              <span>01 Sep 2025 – 15 Nov 2026</span>
            </span>
          </div>

          {/* 5 KPI Metric Cards (Matching Image 4) */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 mt-3">
            {/* Card 1: 817 Total Tasks */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 px-3 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-slate-900 leading-none">817</div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">Total Tasks</div>
              </div>
            </div>

            {/* Card 2: 48% Complete (Circular Progress Donut) */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 px-3 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500 transition-all duration-500" strokeDasharray="48, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-[8.5px] font-bold text-slate-700">48%</span>
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-slate-900 leading-none">48%</div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">Complete</div>
              </div>
            </div>

            {/* Card 3: 5 Overdue */}
            <button
              onClick={() => setAttentionFilter(attentionFilter === "overdue" ? "all" : "overdue")}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
                attentionFilter === "overdue"
                  ? "border-red-400 bg-red-50/50 ring-2 ring-red-100 shadow-xs"
                  : "border-slate-200/70 bg-white hover:border-red-200 hover:bg-slate-50/50 hover:shadow-xs"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white font-bold text-[9px]">!</div>
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-red-500 leading-none">5</div>
                <div className="text-[11px] font-medium text-red-600 mt-0.5 whitespace-nowrap">Overdue</div>
              </div>
            </button>

            {/* Card 4: 3 Blocked */}
            <button
              onClick={() => setAttentionFilter(attentionFilter === "blocked" ? "all" : "blocked")}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
                attentionFilter === "blocked"
                  ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-100 shadow-xs"
                  : "border-slate-200/70 bg-white hover:border-amber-200 hover:bg-slate-50/50 hover:shadow-xs"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <AlertTriangle className="h-4 w-4 fill-amber-500 text-amber-50" />
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-amber-600 leading-none">3</div>
                <div className="text-[11px] font-medium text-amber-600 mt-0.5 whitespace-nowrap">Blocked</div>
              </div>
            </button>

            {/* Card 5: 12 Due This Week */}
            <button
              onClick={() => setAttentionFilter(attentionFilter === "due-this-week" ? "all" : "due-this-week")}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 px-3 shadow-2xs transition-all text-left ${
                attentionFilter === "due-this-week"
                  ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-100 shadow-xs"
                  : "border-slate-200/70 bg-white hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-xs"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-blue-600 leading-none">12</div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">Due This Week</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: 3D BIM Digital Twin Hero (Matching Image 4) */}
        <div className="w-full xl:w-[480px] 2xl:w-[540px] shrink-0">
          <BimDigitalTwinHero />
        </div>
      </div>
    );
  }

  // 2. Standard Header for Network, List, Calendar views
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1 pb-4 select-none">
      {/* Title & Subtitle */}
      <div>
        {isNetwork && (
          <div className="flex items-center gap-1 text-[12px] font-medium text-slate-400 mb-1">
            <span>Programme</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-700 font-semibold">Network</span>
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isNetwork ? "Network View" : "Programme Management"}
        </h1>
        <p className="text-[13.5px] text-slate-500 mt-0.5">
          {isNetwork
            ? "Visualise task relationships, dependencies and the critical path."
            : "Plan, track and deliver your construction programme."}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 relative">
        {/* Working Forecast Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span>{selectedForecast}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Programme Baselines
              </div>
              {FORECAST_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedForecast(opt.label);
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        opt.isCurrent ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span>{opt.label}</span>
                  </div>
                  {opt.label === selectedForecast && (
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Import Button */}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors">
          <Upload className="h-3.5 w-3.5 text-slate-500" />
          <span>Import</span>
        </button>

        {/* Export Button */}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors">
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        {/* More Options Button */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
