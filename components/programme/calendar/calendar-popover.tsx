"use client";

import { useEffect, useRef } from "react";
import type { ProgrammeTask } from "@/lib/programme-types";
import { Diamond, Flame, X } from "lucide-react";

function tradeColor(trade: string | null): string {
  const colors: Record<string, string> = {
    Structural: "var(--trade-structural)",
    "M&E": "var(--trade-mne)",
    Envelope: "var(--trade-envelope)",
    Finishes: "var(--trade-finishes)",
    "External Works": "var(--trade-external)",
    Civils: "var(--trade-civils)",
    Design: "var(--trade-design)",
    Management: "var(--trade-management)",
    Substructure: "var(--trade-substructure)",
  };
  return colors[trade || ""] || "var(--status-not-started)";
}

function statusLabel(status: string): { text: string; color: string } {
  const map: Record<string, { text: string; color: string }> = {
    "not-started": { text: "Not Started", color: "var(--status-not-started)" },
    "in-progress": { text: "In Progress", color: "var(--status-in-progress)" },
    complete: { text: "Complete", color: "var(--status-complete)" },
    blocked: { text: "Blocked", color: "var(--status-blocked)" },
  };
  return map[status] || { text: status, color: "var(--status-not-started)" };
}

interface CalendarPopoverProps {
  date: string;
  tasks: ProgrammeTask[];
  position: { x: number; y: number };
  onClose: () => void;
  onTaskClick: (taskId: string) => void;
}

export function CalendarPopover({
  date,
  tasks,
  position,
  onClose,
  onTaskClick,
}: CalendarPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const dateFormatted = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Position the popover so it doesn't go off-screen
  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(position.x, window.innerWidth - 340),
    top: Math.min(position.y, window.innerHeight - 400),
    zIndex: 100,
  };

  return (
    <div ref={ref} style={style} className="w-[320px] rounded-lg border border-border bg-popover shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div>
          <h3 className="text-[13px] font-semibold">{dateFormatted}</h3>
          <p className="text-[11px] text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "activity" : "activities"}
          </p>
        </div>
        <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Task list */}
      <div className="max-h-[320px] overflow-auto p-1.5">
        {tasks.map((task) => {
          const sl = statusLabel(task.status);
          return (
            <button
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
            >
              {/* Trade indicator */}
              <div className="mt-1 flex shrink-0 flex-col items-center gap-0.5">
                {task.isMilestone ? (
                  <Diamond className="h-3 w-3" style={{ color: "var(--milestone)" }} />
                ) : (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: tradeColor(task.trade) }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-medium">{task.name}</span>
                  {task.isCritical && <Flame className="h-3 w-3 shrink-0 text-[var(--critical)]" />}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                  <span style={{ color: sl.color }}>{sl.text}</span>
                  {task.trade && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{task.trade}</span>
                    </>
                  )}
                  {task.progress > 0 && task.progress < 100 && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="tabular-nums text-muted-foreground">{task.progress}%</span>
                    </>
                  )}
                </div>
                {/* Mini progress bar */}
                {!task.isMilestone && (
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: sl.color,
                      }}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
