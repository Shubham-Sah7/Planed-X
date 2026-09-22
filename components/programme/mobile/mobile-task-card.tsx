"use client";

import type { ProgrammeTask } from "@/lib/programme-types";
import { Diamond, Flame, ChevronRight } from "lucide-react";

function statusConfig(status: string): { label: string; color: string; bg: string } {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    "not-started": { label: "Not Started", color: "var(--status-not-started)", bg: "var(--status-not-started-bg)" },
    "in-progress": { label: "In Progress", color: "var(--status-in-progress)", bg: "var(--status-in-progress-bg)" },
    complete: { label: "Complete", color: "var(--status-complete)", bg: "var(--status-complete-bg)" },
    blocked: { label: "Blocked", color: "var(--status-blocked)", bg: "var(--status-blocked-bg)" },
  };
  return map[status] || map["not-started"];
}

function fmtDate(d: string): string {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

interface MobileTaskCardProps {
  task: ProgrammeTask;
  onTap: () => void;
}

export function MobileTaskCard({ task, onTap }: MobileTaskCardProps) {
  const sc = statusConfig(task.status);

  return (
    <button
      onClick={onTap}
      className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors active:bg-accent"
      style={{ minHeight: 64 }} // Large touch target
    >
      {/* Status stripe */}
      <div
        className="h-full w-1 self-stretch shrink-0 rounded-full"
        style={{ backgroundColor: sc.color, minHeight: 40 }}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Task name */}
        <div className="flex items-center gap-1.5">
          {task.isMilestone && (
            <Diamond className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--milestone)" }} />
          )}
          <span className="text-[14px] font-medium leading-tight line-clamp-2">{task.name}</span>
          {task.isCritical && (
            <Flame className="h-3.5 w-3.5 shrink-0 text-[var(--critical)]" />
          )}
        </div>

        {/* Meta row */}
        <div className="mt-1.5 flex items-center gap-2 text-[12px]">
          <span
            className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: sc.bg, color: sc.color }}
          >
            {sc.label}
          </span>
          <span className="text-muted-foreground">
            {fmtDate(task.startDate)} – {fmtDate(task.endDate)}
          </span>
        </div>

        {/* Progress bar + trade */}
        <div className="mt-1.5 flex items-center gap-2">
          {!task.isMilestone && (
            <div className="flex flex-1 items-center gap-1.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: sc.color,
                  }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground">{task.progress}%</span>
            </div>
          )}
          {task.trade && (
            <span className="shrink-0 text-[11px] text-muted-foreground">{task.trade}</span>
          )}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
