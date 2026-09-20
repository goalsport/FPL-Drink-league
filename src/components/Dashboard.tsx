"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PointsChart } from "@/components/PointsChart";
import { RemainingFixtures } from "@/components/RemainingFixtures";
import { StandingsTable } from "@/components/StandingsTable";
import type { LeagueConfig } from "@/lib/leagues";
import type { LeagueDashboard, ViewMode } from "@/lib/types";

type DashboardProps = {
  data: LeagueDashboard;
  leagues?: LeagueConfig[];
  currentLeagueId?: number;
};

export function Dashboard({ data, leagues = [], currentLeagueId = data.leagueId }: DashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [targetLeagueId, setTargetLeagueId] = useState<number | null>(null);

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

  const handleSelectLeague = (id: number) => {
    if (id === data.leagueId) return;
    setTargetLeagueId(id);
    startTransition(() => {
      router.push(`/?league=${id}`);
    });
  };

  const isSwitching = isPending && targetLeagueId !== null && targetLeagueId !== data.leagueId;
  const leagueConfig = leagues.find((league) => league.id === data.leagueId);

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-3 py-2 sm:px-6 sm:py-5">
      {/* League Selection Tabs */}
      {leagues.length > 1 && (
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/90 p-1 shadow-sm backdrop-blur-sm sm:gap-2 sm:rounded-full sm:p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {leagues.map((league) => {
              const active = league.id === data.leagueId;
              const loadingThis = isPending && targetLeagueId === league.id;
              return (
                <button
                  key={league.id}
                  type="button"
                  disabled={active || isPending}
                  onClick={() => handleSelectLeague(league.id)}
                  className={`display flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition sm:rounded-full sm:px-4 sm:py-1.5 sm:text-sm md:text-base ${
                    active
                      ? "bg-[var(--gold)] text-[#3d2a00] shadow-sm cursor-default"
                      : "text-[var(--foam)] hover:bg-[var(--bg-soft)] cursor-pointer"
                  } ${loadingThis ? "opacity-75 animate-pulse" : ""}`}
                >
                  <span className="text-sm sm:text-base">{league.icon ?? "🏆"}</span>
                  <span>{league.name}</span>
                  {loadingThis && (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#3d2a00] border-t-transparent sm:h-3.5 sm:w-3.5" />
                  )}
                </button>
              );
            })}
          </div>

          {isSwitching && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-ink)]">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
              <span className="hidden sm:inline">กำลังโหลดข้อมูล...</span>
            </div>
          )}
        </div>
      )}

      <header className="mb-2 flex items-baseline justify-between gap-2 sm:mb-3 sm:rounded-2xl sm:border sm:border-[var(--line)] sm:bg-white sm:px-4 sm:py-3">
        <h1 className="display truncate text-lg text-[var(--foam)] sm:text-3xl">{data.leagueName.toUpperCase()}</h1>
        <p className="shrink-0 text-[11px] text-[var(--muted)] sm:text-xs">
          GW {data.currentGw} · {managers.length} คน
        </p>
      </header>

      <FineRules config={leagueConfig} />

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

      <StandingsTable
        mode={mode}
        weekly={weekly}
        overall={overall}
        gwComplete={gwStatus?.complete ?? false}
        leagueFineTotal={data.fineLedger?.leagueTotal ?? 0}
      />

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

function Amount({ children, tone }: { children: React.ReactNode; tone: "last" | "second" | "fifth" }) {
  const toneClass =
    tone === "last"
      ? "bg-[#ffd4d1] text-[#b42318]"
      : tone === "second"
        ? "bg-[#ffe8b8] text-[#9a6700]"
        : "bg-[#f8eadc] text-[#9a7048]";

  return (
    <span className={`inline-flex rounded-full px-1.5 py-px font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

function FineRules({ config }: { config?: LeagueConfig }) {
  if (!config?.fineDescription) return null;

  const drink = Boolean(config.fineTieDescription);
  const body = drink ? (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-xl bg-[#ffe8e6] px-3 py-2 text-sm font-semibold text-[#b42318]">
          <span>บ๊วย</span>
          <span>50฿</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#fff6dc] px-3 py-2 text-sm font-semibold text-[#9a6700]">
          <span>รองบ๊วย</span>
          <span>30฿</span>
        </div>
      </div>
      <div className="rounded-xl bg-[#fff8f7] px-3 py-2 text-[12px] leading-snug text-[var(--foam)]">
        <p>
          เสมอบ๊วย 2 คนขึ้นไป หาร <Amount tone="last">80฿</Amount> เช่น คนละ <Amount tone="last">40฿</Amount>
        </p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">คนถัดไปไม่โดนปรับรองบ๊วย</p>
      </div>
      <div className="rounded-xl bg-[#fffaf0] px-3 py-2 text-[12px] leading-snug text-[var(--foam)]">
        เสมอรองบ๊วย บ๊วยยังจ่าย <Amount tone="last">50฿</Amount> ที่เหลือหาร <Amount tone="second">30฿</Amount> เช่น คนละ{" "}
        <Amount tone="second">15฿</Amount>
      </div>
      {config.seasonEndFineDescription ? (
        <div className="rounded-xl bg-[#f2e4d8] px-3 py-2 text-[12px] leading-snug text-[var(--foam)]">
          จบลีก 38 GW · อันดับ 7 <Amount tone="last">500฿</Amount> · อันดับ 6 <Amount tone="second">300฿</Amount> · อันดับ 5{" "}
          <Amount tone="fifth">200฿</Amount>
        </div>
      ) : null}
    </div>
  ) : (
    <p className="text-sm text-[var(--gold-ink)]">{config.fineDescription}</p>
  );

  return (
    <>
      <details className="group panel mb-2 overflow-hidden rounded-2xl sm:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-[var(--foam)] [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1.5">
            กฎค่าปรับ
            <svg
              className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 group-open:rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span className="text-[11px] font-medium text-[var(--muted)]">
            {drink ? "บ๊วย 50฿ · รองบ๊วย 30฿" : "ดูรายละเอียด"}
          </span>
        </summary>
        <div className="border-t border-[var(--line)] px-3 py-3">{body}</div>
      </details>
      <section className="panel mb-3 hidden overflow-hidden rounded-2xl p-4 sm:block">
        <p className="mb-3 text-sm font-semibold text-[var(--foam)]">กฎค่าปรับ</p>
        {body}
      </section>
    </>
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
