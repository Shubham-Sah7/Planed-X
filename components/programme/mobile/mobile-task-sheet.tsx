"use client";

import type { ProgrammeTask } from "@/lib/programme-types";
import {
  X,
  ChevronRight,
  Diamond,
  Flame,
  Calendar,
  Clock,
  User,
  Link2,
  ArrowDownRight,
  ArrowUpRight,
  MessageSquare,
  Camera,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

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
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MobileTaskSheetProps {
  task: ProgrammeTask;
  taskMap: Map<string, ProgrammeTask>;
  onClose: () => void;
  onNavigate: (taskId: string) => void;
}

export function MobileTaskSheet({ task, taskMap, onClose, onNavigate }: MobileTaskSheetProps) {
  const sc = statusConfig(task.status);

  // WBS path
  const path: string[] = [];
  let current: ProgrammeTask | undefined = task;
  while (current?.parentId) {
    const parent = taskMap.get(current.parentId);
    if (parent && parent.level !== "programme") path.unshift(parent.name);
    current = parent;
  }

  const predecessors = task.predecessors
    .map((id) => taskMap.get(id))
    .filter(Boolean) as ProgrammeTask[];
  const successors = task.successors
    .map((id) => taskMap.get(id))
    .filter(Boolean) as ProgrammeTask[];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl border-t border-border bg-background shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex shrink-0 justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              {/* WBS breadcrumb */}
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                {path.map((name, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="max-w-[100px] truncate">{name}</span>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  </span>
                ))}
              </div>

              <h2 className="mt-1 text-[16px] font-semibold leading-tight">
                {task.isMilestone && (
                  <Diamond className="mr-1.5 inline h-4 w-4" style={{ color: "var(--milestone)" }} />
                )}
                {task.name}
              </h2>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center rounded px-2 py-0.5 text-[12px] font-medium"
                  style={{ backgroundColor: sc.bg, color: sc.color }}
                >
                  {sc.label}
                </span>
                {task.isCritical && (
                  <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[12px] font-medium bg-[var(--critical-bg)] text-[var(--critical)]">
                    <Flame className="h-3 w-3" />
                    Critical
                  </span>
                )}
              </div>
            </div>

            <button onClick={onClose} className="ml-2 rounded-full p-2 text-muted-foreground active:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Schedule */}
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Schedule
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[12px] text-muted-foreground">Start</span>
                <p className="text-[14px] font-medium tabular-nums">{fmtDate(task.startDate)}</p>
              </div>
              <div>
                <span className="text-[12px] text-muted-foreground">Finish</span>
                <p className="text-[14px] font-medium tabular-nums">{fmtDate(task.endDate)}</p>
              </div>
              <div>
                <span className="text-[12px] text-muted-foreground">Duration</span>
                <p className="text-[14px] font-medium">
                  {task.isMilestone ? "Milestone" : `${task.duration} days`}
                </p>
              </div>
              <div>
                <span className="text-[12px] text-muted-foreground">Float</span>
                <p className={`text-[14px] font-medium ${task.float === 0 ? "text-[var(--critical)]" : ""}`}>
                  {task.float} days
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Progress
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[18px] font-semibold tabular-nums">{task.progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${task.progress}%`,
                  backgroundColor: sc.color,
                }}
              />
            </div>

            {/* Quick actions - large touch targets */}
            <div className="mt-3 flex gap-2">
              {task.status !== "complete" && (
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--status-complete)] bg-[var(--status-complete-bg)] py-3 text-[13px] font-medium text-[var(--status-complete)] active:opacity-80">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </button>
              )}
              {task.status !== "blocked" && (
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--status-blocked)] bg-[var(--status-blocked-bg)] py-3 text-[13px] font-medium text-[var(--status-blocked)] active:opacity-80">
                  <AlertTriangle className="h-4 w-4" />
                  Blocked
                </button>
              )}
            </div>
          </div>

          {/* Responsible */}
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Responsible
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[12px] text-muted-foreground">Trade</span>
                <p className="text-[14px] font-medium">{task.trade || "—"}</p>
              </div>
              <div>
                <span className="text-[12px] text-muted-foreground">Assignee</span>
                <p className="text-[14px] font-medium">{task.assignee || "—"}</p>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          {(predecessors.length > 0 || successors.length > 0) && (
            <div className="border-b border-border px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Dependencies
              </div>
              {predecessors.length > 0 && (
                <div className="mb-2">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                    <ArrowDownRight className="h-3 w-3" />
                    Predecessors
                  </span>
                  {predecessors.map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => onNavigate(dep.id)}
                      className="flex w-full items-center gap-2 rounded-lg p-2.5 text-left active:bg-accent"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusConfig(dep.status).color }} />
                      <span className="flex-1 truncate text-[13px]">{dep.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {successors.length > 0 && (
                <div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Successors
                  </span>
                  {successors.map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => onNavigate(dep.id)}
                      className="flex w-full items-center gap-2 rounded-lg p-2.5 text-left active:bg-accent"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusConfig(dep.status).color }} />
                      <span className="flex-1 truncate text-[13px]">{dep.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Notes
            </div>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              rows={3}
              placeholder="Add a note..."
            />
          </div>

          {/* Photo */}
          <div className="px-4 py-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-5 text-[14px] text-muted-foreground active:bg-accent">
              <Camera className="h-5 w-5" />
              Add photo or evidence
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
