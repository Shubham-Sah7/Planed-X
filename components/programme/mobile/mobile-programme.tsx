"use client";

import { useMemo, useState } from "react";
import { useProgramme } from "@/lib/programme-context";
import { getProgrammeData } from "@/lib/programme-data";
import type { ProgrammeTask } from "@/lib/programme-types";
import { MobileTaskCard } from "./mobile-task-card";
import { MobileTaskSheet } from "./mobile-task-sheet";
import { ChevronLeft, Search, X } from "lucide-react";

export function MobileProgramme() {
  const programme = useMemo(() => getProgrammeData(), []);
  const { state } = useProgramme();
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
  const [currentWPId, setCurrentWPId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProgrammeTask | null>(null);
  const [search, setSearch] = useState("");

  const phases = useMemo(
    () => programme.tasks.filter((t: ProgrammeTask) => t.level === "phase"),
    [programme],
  );

  const currentPhase = currentPhaseId ? programme.taskMap.get(currentPhaseId) : null;
  const currentWP = currentWPId ? programme.taskMap.get(currentWPId) : null;

  const workPackages = useMemo(() => {
    if (!currentPhase) return [];
    return currentPhase.children
      .map((id: string) => programme.taskMap.get(id))
      .filter(Boolean) as ProgrammeTask[];
  }, [currentPhase, programme]);

  const tasks = useMemo(() => {
    if (!currentWP) return [];
    let t = currentWP.children
      .map((id: string) => programme.taskMap.get(id))
      .filter(Boolean) as ProgrammeTask[];

    // Apply search
    if (search) {
      const q = search.toLowerCase();
      t = t.filter((task) =>
        task.name.toLowerCase().includes(q) || task.wbs.toLowerCase().includes(q),
      );
    }

    // Apply global filters
    const f = state.filters;
    if (f.status.length > 0) t = t.filter((task) => f.status.includes(task.status));
    if (f.criticalPathOnly) t = t.filter((task) => task.isCritical);
    if (f.blockedOnly) t = t.filter((task) => task.status === "blocked");

    return t;
  }, [currentWP, programme, search, state.filters]);

  const goBack = () => {
    if (currentWPId) setCurrentWPId(null);
    else if (currentPhaseId) setCurrentPhaseId(null);
  };

  // Breadcrumb text
  const breadcrumb = currentWP
    ? `${currentPhase?.name} › ${currentWP.name}`
    : currentPhase
      ? currentPhase.name
      : "Programme";

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Mobile header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {(currentPhaseId || currentWPId) && (
            <button
              onClick={goBack}
              className="rounded p-1 text-muted-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold">{breadcrumb}</h1>
            {!currentWPId && !currentPhaseId && (
              <p className="text-[12px] text-muted-foreground">
                {programme.totalTasks} tasks · {programme.avgProgress}% complete
              </p>
            )}
          </div>
        </div>

        {/* Search (only in task list) */}
        {currentWPId && (
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Phase list */}
        {!currentPhaseId && (
          <div className="p-3 space-y-2">
            {phases.map((phase: ProgrammeTask) => {
              const taskCount = phase.children.length;
              const sc = statusConfig(phase.status);
              return (
                <button
                  key={phase.id}
                  onClick={() => setCurrentPhaseId(phase.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors active:bg-accent"
                >
                  <div
                    className="h-10 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: sc.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {phase.wbs}
                      </span>
                      <span className="text-[14px] font-semibold">{phase.name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[12px] text-muted-foreground">
                      <span>{taskCount} work packages</span>
                      <span>·</span>
                      <span className="tabular-nums">{phase.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${phase.progress}%`,
                          backgroundColor: sc.color,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Work package list */}
        {currentPhaseId && !currentWPId && (
          <div className="p-3 space-y-2">
            {workPackages.map((wp) => {
              const sc = statusConfig(wp.status);
              const childCount = wp.children.length;
              return (
                <button
                  key={wp.id}
                  onClick={() => setCurrentWPId(wp.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-3.5 text-left transition-colors active:bg-accent"
                >
                  <div
                    className="h-8 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: sc.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {wp.wbs}
                      </span>
                      <span className="text-[14px] font-medium">{wp.name}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[12px] text-muted-foreground">
                      <span>{childCount} tasks</span>
                      <span>{wp.trade}</span>
                      <span className="tabular-nums">{wp.progress}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Task cards */}
        {currentWPId && (
          <div className="p-3 space-y-2">
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-muted-foreground">
                No tasks match your filters
              </div>
            ) : (
              tasks.map((task) => (
                <MobileTaskCard
                  key={task.id}
                  task={task}
                  onTap={() => setSelectedTask(task)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Task sheet */}
      {selectedTask && (
        <MobileTaskSheet
          task={selectedTask}
          taskMap={programme.taskMap}
          onClose={() => setSelectedTask(null)}
          onNavigate={(id) => {
            const t = programme.taskMap.get(id);
            if (t) setSelectedTask(t);
          }}
        />
      )}
    </div>
  );
}

// Utility used in phase list
function statusConfig(status: string): { color: string } {
  const map: Record<string, string> = {
    "not-started": "var(--status-not-started)",
    "in-progress": "var(--status-in-progress)",
    complete: "var(--status-complete)",
    blocked: "var(--status-blocked)",
  };
  return { color: map[status] || map["not-started"] };
}
