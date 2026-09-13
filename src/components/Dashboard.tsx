"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PointsChart } from "@/components/PointsChart";
import { RemainingFixtures } from "@/components/RemainingFixtures";
import { StandingsTable } from "@/components/StandingsTable";
import { formatUpdated } from "@/lib/format";
import type { LeagueDashboard, ViewMode } from "@/lib/types";

type DashboardProps = {
  data: LeagueDashboard;
};

export function Dashboard({ data }: DashboardProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
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
    <main className="relative mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6">
      <header className="panel mb-4 flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="display text-2xl text-[var(--foam)] sm:text-3xl">{data.leagueName.toUpperCase()}</h1>
          <p className="text-xs text-[var(--muted)]">
            GW {data.currentGw} · {managers.length} คน · {formatUpdated(data.lastUpdated)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => startRefresh(() => router.refresh())}
          disabled={isRefreshing}
          className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[#3d2a00] disabled:opacity-60"
        >
          {isRefreshing ? "กำลังรีเฟรช..." : "รีเฟรชข้อมูล"}
        </button>
      </header>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="panel flex rounded-full p-1">
          <ModeButton active={mode === "weekly"} onClick={() => setMode("weekly")}>
            GW สัปดาห์
          </ModeButton>
          <ModeButton active={mode === "overall"} onClick={() => setMode("overall")}>
            GW รวม
          </ModeButton>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Array.from({ length: maxGw }, (_, index) => {
            const gw = index + 1;
            const active = gw === selectedGw;
            return (
              <button
                key={gw}
                type="button"
                onClick={() => setSelectedGw(gw)}
                className={`display rounded-full px-3 py-1.5 text-base transition ${
                  active ? "bg-[var(--gold)] text-[#3d2a00]" : "panel text-[var(--foam)] hover:border-[var(--gold)]"
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
          <p className="mb-3 text-sm text-[var(--muted)]">{subtitle}</p>
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            <Chip label="นำลีก" value={overallHi?.leader ? `${overallHi.leader.playerName} ${overallHi.leader.total}` : "—"} />
            <Chip label="รั้งท้าย" value={overallHi?.last?.playerName ?? "—"} danger />
            <Chip
              label={overallHi?.climber ? "ขึ้นแรงสุด" : "นำห่าง"}
              value={
                overallHi?.climber
                  ? `${overallHi.climber.playerName} ▲${overallHi.climber.rankDelta}`
                  : `${overallHi?.gapToFirst ?? 0} pts`
              }
            />
          </div>
        </>
      )}

      <StandingsTable mode={mode} weekly={weekly} overall={overall} gwComplete={gwStatus?.complete ?? false} />

      <div className="mt-4">
        <PointsChart
          mode={mode}
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

      <footer className="mt-5 flex flex-col items-start justify-between gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center">
        <p>ข้อมูลจาก FPL public API · กดรีเฟรชเมื่อต้องการดึงคะแนนใหม่</p>
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
      className={`display rounded-full px-4 py-1.5 text-base transition ${
        active ? "bg-[var(--gold)] text-[#3d2a00]" : "text-[var(--foam)] hover:text-[var(--gold-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <span className="panel rounded-full px-3 py-1.5">
      <span className={danger ? "text-[var(--rose)]" : "text-[var(--gold-ink)]"}>{label}</span>
      <span className="ml-2 font-semibold text-[var(--foam)]">{value}</span>
    </span>
  );
}
