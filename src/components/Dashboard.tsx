"use client";

import { useMemo, useState } from "react";
import { PointsChart } from "@/components/PointsChart";
import { RemainingFixtures } from "@/components/RemainingFixtures";
import { StandingsTable } from "@/components/StandingsTable";
import type { LeagueDashboard, ViewMode } from "@/lib/types";

type DashboardProps = {
  data: LeagueDashboard;
};

export function Dashboard({ data }: DashboardProps) {
  const [mode, setMode] = useState<ViewMode>("weekly");
  const [selectedGw, setSelectedGw] = useState(data.currentGw);

  const weekly = data.weeklyByGw?.[selectedGw] ?? [];
  const overall = data.overallByGw?.[selectedGw] ?? [];
  const overallHi = data.overallHighlights?.[selectedGw];
  const gwStatus = data.gwStatus?.[selectedGw];
  const managers = data.managers ?? [];
  const maxGw = data.maxGw || 1;

  const officialUrl = `https://fantasy.premierleague.com/th/leagues/${data.leagueId}`;

  const subtitle = useMemo(
    () => (mode === "weekly" ? `สรุปเฉพาะ GW ${selectedGw}` : `คะแนนสะสมถึง GW ${selectedGw}`),
    [mode, selectedGw],
  );

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-3 py-2 sm:px-6 sm:py-5">
      <header className="mb-2 flex items-baseline justify-between gap-2 sm:mb-3 sm:rounded-2xl sm:border sm:border-[var(--line)] sm:bg-white sm:px-4 sm:py-3">
        <h1 className="display text-lg text-[var(--foam)] sm:text-3xl">{data.leagueName.toUpperCase()}</h1>
        <p className="text-[11px] text-[var(--muted)] sm:text-xs">
          GW {data.currentGw} · {managers.length} คน
        </p>
      </header>

      <div className="mb-2 flex flex-col gap-1.5 sm:mb-4 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="panel grid grid-cols-2 rounded-full p-1">
          <ModeButton active={mode === "weekly"} onClick={() => setMode("weekly")}>
            GW สัปดาห์
          </ModeButton>
          <ModeButton active={mode === "overall"} onClick={() => setMode("overall")}>
            GW รวม
          </ModeButton>
        </div>

        <div className="-mx-3 flex items-center gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: maxGw }, (_, index) => {
            const gw = index + 1;
            const active = gw === selectedGw;
            return (
              <button
                key={gw}
                type="button"
                onClick={() => setSelectedGw(gw)}
                className={`display shrink-0 rounded-full px-2.5 py-1 text-sm sm:px-3 sm:py-1.5 sm:text-base ${
                  active ? "bg-[var(--gold)] text-[#3d2a00]" : "panel text-[var(--foam)]"
                }`}
              >
                GW {gw}
              </button>
            );
          })}
        </div>
      </div>

      {mode !== "weekly" && (
        <>
          <p className="mb-2 hidden text-sm text-[var(--muted)] sm:mb-3 sm:block">{subtitle}</p>
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-3 sm:flex-wrap">
            <Chip label="นำลีก" value={overallHi?.leader ? `${overallHi.leader.teamName} ${overallHi.leader.total}` : "—"} />
            <Chip label="รั้งท้าย" value={overallHi?.last?.teamName ?? "—"} danger />
            <Chip
              label={overallHi?.climber ? "ขึ้นแรงสุด" : "นำห่าง"}
              value={
                overallHi?.climber
                  ? `${overallHi.climber.teamName} ▲${overallHi.climber.rankDelta}`
                  : `${overallHi?.gapToFirst ?? 0} pts`
              }
            />
          </div>
        </>
      )}

      <StandingsTable mode={mode} weekly={weekly} overall={overall} gwComplete={gwStatus?.complete ?? false} />

      <div className="mt-3 sm:mt-4">
        <PointsChart
          selectedGw={selectedGw}
          rows={
            mode === "weekly"
              ? weekly.map((row) => ({
                  entryId: row.entryId,
                  playerName: row.playerName,
                  teamName: row.teamName,
                  value: row.points,
                  badgeUrl: row.badgeUrl,
                }))
              : overall.map((row) => ({
                  entryId: row.entryId,
                  playerName: row.playerName,
                  teamName: row.teamName,
                  value: row.total,
                  badgeUrl: row.badgeUrl,
                }))
          }
        />
      </div>

      {mode === "weekly" ? <RemainingFixtures selectedGw={selectedGw} status={gwStatus} /> : null}

      <footer className="mt-4 flex flex-col items-start justify-between gap-2 text-sm text-[var(--muted)] sm:mt-5 sm:flex-row sm:items-center">
        <p>ข้อมูลจาก FPL public API</p>
        <a href={officialUrl} target="_blank" rel="noreferrer" className="text-[var(--gold)] underline-offset-4 hover:underline">
          เปิดลีกทางการ
        </a>
      </footer>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`display rounded-full px-3 py-1.5 text-sm transition sm:px-4 sm:text-base ${
        active ? "bg-[var(--gold)] text-[#3d2a00]" : "text-[var(--foam)]"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <span className="panel shrink-0 rounded-full px-3 py-1.5">
      <span className={danger ? "text-[var(--rose)]" : "text-[var(--gold-ink)]"}>{label}</span>
      <span className="ml-2 font-semibold text-[var(--foam)]">{value}</span>
    </span>
  );
}
