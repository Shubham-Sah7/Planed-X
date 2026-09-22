"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, FolderTree, Layers } from "lucide-react";
import { useProgramme } from "@/lib/programme-context";
import { WBS_STRUCTURE_TREE, type WBSItem } from "@/lib/programme-data";

interface WBSPanelProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function WBSPanel({ isCollapsed, onToggleCollapse }: WBSPanelProps) {
  const { selectedWbsSection, setSelectedWbsSection } = useProgramme();
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set(["substructure"])
  );

  const toggleBranch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (item: WBSItem) => {
    setSelectedWbsSection(item.id);
  };

  return (
    <aside className="w-[230px] shrink-0 border-r border-slate-200 bg-white flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-900 tracking-tight">
            WBS Structure
          </span>
        </div>
      </div>

      {/* Tree list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 text-[12.5px]">
        {WBS_STRUCTURE_TREE.map((item) => {
          const hasChildren = !!item.children && item.children.length > 0;
          const isBranchExpanded = expandedBranches.has(item.id);
          const isSelected = selectedWbsSection === item.id;

          return (
            <div key={item.id} className="space-y-0.5">
              {/* Parent Row */}
              <div
                onClick={() => handleSelect(item)}
                className={`group flex items-center justify-between rounded-lg px-2 py-1.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50/70 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => toggleBranch(item.id, e)}
                      className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      {isBranchExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="inline-block w-4 text-slate-300 text-center">›</span>
                  )}
                  <span className="truncate">{item.name}</span>
                </div>

                {/* Task Count Badge */}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-none shrink-0 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                  }`}
                >
                  {item.count}
                </span>
              </div>

              {/* Sub-items */}
              {hasChildren && isBranchExpanded && (
                <div className="pl-4 space-y-0.5 border-l border-slate-100 ml-3 my-0.5">
                  {item.children!.map((child) => {
                    const isChildSelected = selectedWbsSection === child.id;
                    return (
                      <div
                        key={child.id}
                        onClick={() => handleSelect(child)}
                        className={`group flex items-center justify-between rounded-md px-2 py-1 cursor-pointer transition-colors text-[12px] ${
                          isChildSelected
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-slate-300">›</span>
                          <span className="truncate">{child.name}</span>
                        </div>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-medium leading-none shrink-0 ${
                            isChildSelected
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200/70"
                          }`}
                        >
                          {child.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="border-t border-slate-100 p-2.5 bg-slate-50/50">
        <p className="text-[11px] text-slate-400 leading-tight">
          Select a WBS section to isolate and focus dependency flow.
        </p>
      </div>
    </aside>
  );
}
