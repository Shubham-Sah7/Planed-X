"use client";

import React from "react";
import { Diamond, ArrowRight } from "lucide-react";
import { useProgramme } from "@/lib/programme-context";

export function NetworkFooter() {
  const { viewAllNetwork, setViewAllNetwork } = useProgramme();

  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-t border-slate-200/80 bg-white px-6 text-[12px] text-slate-600 select-none">
      {/* Left: Legend matching user's image */}
      <div className="flex items-center gap-5">
        {/* 1. Completed */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-700">Completed</span>
        </div>

        {/* 2. In Progress */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="font-medium text-slate-700">In Progress</span>
        </div>

        {/* 3. Not Started */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="font-medium text-slate-700">Not Started</span>
        </div>

        {/* 4. Blocked */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="font-medium text-slate-700">Blocked</span>
        </div>

        {/* 5. Critical Path (Red Line) */}
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-red-500" />
          <span className="font-medium text-slate-700">Critical Path</span>
        </div>

        {/* 6. Dependency (Arrow Line) */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-slate-600">
            <span className="h-0.5 w-3.5 bg-slate-500 rounded-l" />
            <ArrowRight className="h-3 w-3 -ml-1 text-slate-500 stroke-[2.5]" />
          </div>
          <span className="font-medium text-slate-700">Dependency</span>
        </div>

        {/* 7. Milestone */}
        <div className="flex items-center gap-1.5">
          <Diamond className="h-2.5 w-2.5 fill-slate-900 text-slate-900" />
          <span className="font-medium text-slate-700">Milestone</span>
        </div>
      </div>

      {/* Right: Task Count & View All */}
      <div className="flex items-center gap-2.5 text-[12px]">
        <span className="text-slate-500 font-medium">
          {viewAllNetwork ? "324 tasks shown of 324" : "24 tasks shown of 324"}
        </span>
        <button
          onClick={() => setViewAllNetwork(!viewAllNetwork)}
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          {viewAllNetwork ? "Show Substructure" : "View All"}
        </button>
      </div>
    </div>
  );
}
