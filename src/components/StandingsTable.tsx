"use client";

import { ManagerPhoto } from "@/components/ManagerPhoto";
import { RankMark } from "@/components/RankMark";
import { TeamBadge } from "@/components/TeamBadge";
import { chipLabel, formatBaht, formatRank, seasonEndFineLabel } from "@/lib/format";
import type { FineKind, OverallRow, ViewMode, WeeklyRow } from "@/lib/types";

type StandingsTableProps = {
  mode: ViewMode;
  weekly: WeeklyRow[];
  overall: OverallRow[];
  gwComplete?: boolean;
  leagueFineTotal?: number;
};


function fineRowClass(kind: FineKind): string {
  if (kind === "last" || kind === "bottom") return "fine-last";
  if (kind === "second") return "fine-second";
  return "";
}

function fineRoleLabel(kind: FineKind): string | null {
  if (kind === "last") return "บ๊วย";
  if (kind === "second") return "รองบ๊วย";
  if (kind === "bottom") return "4 ท้าย";
  return null;
}
function ManagerCell({
  entryId,
  playerName,
  teamName,
  badgeUrl,
}: {
  entryId: number;
  playerName: string;
  teamName: string;
  badgeUrl: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <ManagerPhoto entryId={entryId} name={playerName} className="h-10 w-10 sm:h-12 sm:w-12" />
      <TeamBadge name={teamName} badgeUrl={badgeUrl} className="h-7 w-7 sm:h-8 sm:w-8" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-[var(--foam)]">{teamName}</p>
      </div>
    </div>
  );
}

export function StandingsTable({
  mode,
  weekly,
  overall,
  gwComplete = false,
  leagueFineTotal = 0,
}: StandingsTableProps) {
  if (mode === "weekly") {
    return (
      <section className="panel weekly-featured overflow-hidden rounded-3xl">
        <div className="border-b border-[var(--line)] bg-[#fff8e8] px-3 py-2 sm:px-5 sm:py-4">
          <p className="display text-xl text-[var(--foam)] sm:text-3xl">ตารางคะแนน GW</p>
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.4rem_2.6rem] items-center gap-1 px-3 py-1 text-[10px] text-[var(--muted)]">
            <span>#</span>
            <span>ทีม</span>
            <span className="text-right">GW</span>
            <span className="text-right">total</span>
          </div>
          {(weekly ?? []).map((row) => (
            <article
              key={row.entryId}
              className={`grid grid-cols-[1.75rem_minmax(0,1fr)_2.4rem_2.6rem] items-center gap-1 px-3 py-1.5 ${fineRowClass(row.fineKind)}`}
            >
              <RankMark rank={row.rank} />
              <div className="flex min-w-0 items-center gap-1.5">
                <ManagerPhoto entryId={row.entryId} name={row.playerName} className="h-7 w-7" />
                <TeamBadge name={row.teamName} badgeUrl={row.badgeUrl} className="h-5 w-5" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight text-[var(--foam)]">{row.teamName}</p>
                  <MobileWeeklyMeta row={row} complete={gwComplete} />
                </div>
              </div>
              <p className="text-right text-base font-semibold leading-none text-[var(--gold-ink)]">{row.points}</p>
              <p className="text-right text-sm font-semibold leading-none">{row.totalPoints}</p>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr className="border-b border-[var(--line)]">
                <th className="px-5 py-3 font-medium">อันดับ</th>
                <th className="px-5 py-3 font-medium">ทีม</th>
                <th className="px-5 py-3 font-medium">แต้ม GW</th>
                <th className="px-5 py-3 font-medium">โอน</th>
                <th className="px-5 py-3 font-medium">ซื้อ/ขาย</th>
                <th className="px-5 py-3 font-medium">ชิป</th>
                <th className="px-5 py-3 font-medium">ค่าปรับ</th>
                <th className="px-5 py-3 font-medium">แต้ม total</th>
              </tr>
            </thead>
            <tbody>
              {(weekly ?? []).map((row) => (
                <tr
                  key={row.entryId}
                  className={`border-b border-[var(--line)] last:border-0 ${fineRowClass(row.fineKind)}`}
                >
                  <td className="px-5 py-3">
                    <RankMark rank={row.rank} className="sm:h-8 sm:w-8 sm:text-base" />
                  </td>
                  <td className="px-5 py-3">
                    <ManagerCell
                      entryId={row.entryId}
                      playerName={row.playerName}
                      teamName={row.teamName}
                      badgeUrl={row.badgeUrl}
                    />
                  </td>
                  <td className="px-5 py-3 text-lg font-semibold text-[var(--gold-ink)]">{row.points}</td>
                  <td className="px-5 py-3">{row.transfers}</td>
                  <td className="px-5 py-3 text-[var(--rose)]">{row.hits > 0 ? `-${row.hits}` : "0"}</td>
                  <td className="px-5 py-3">{chipLabel(row.chip) ?? "—"}</td>
                  <td className="px-5 py-3 font-semibold text-[var(--rose)]">
                    <FineCell complete={gwComplete} fine={row.fine} kind={row.fineKind} />
                  </td>
                  <td className="px-5 py-3 font-semibold">{row.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  const topSeasonFine = Math.max(0, ...overall.map((row) => row.seasonFine));

  return (
    <section className="panel overflow-hidden rounded-3xl">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <p className="display text-xl text-[var(--foam)] sm:text-2xl">ตาราง GW รวม</p>
          <p className="hidden text-sm text-[var(--muted)] sm:block">แต้ม total คือคะแนนสะสมถึงเกมวีคที่เลือก พร้อมค่าปรับสะสมตามกติกาลีก</p>
        </div>
        <p className="display shrink-0 text-xl text-[var(--rose)] sm:text-2xl">{formatBaht(leagueFineTotal)}</p>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.4rem_2.6rem] items-center gap-1 px-3 py-1 text-[10px] text-[var(--muted)]">
          <span>#</span>
          <span>ทีม</span>
          <span className="text-right">GW</span>
          <span className="text-right">total</span>
        </div>
        {(overall ?? []).map((row) => (
          <article
            key={row.entryId}
            className={`grid grid-cols-[1.75rem_minmax(0,1fr)_2.4rem_2.6rem] items-center gap-1 px-3 py-1.5 ${
              topSeasonFine > 0 && row.seasonFine === topSeasonFine ? "fine-last" : ""
            }`}
          >
            <RankMark rank={row.rank} />
            <div className="flex min-w-0 items-center gap-1.5">
              <ManagerPhoto entryId={row.entryId} name={row.playerName} className="h-7 w-7" />
              <TeamBadge name={row.teamName} badgeUrl={row.badgeUrl} className="h-5 w-5" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-[var(--foam)]">{row.teamName}</p>
                <p className="flex flex-wrap items-center gap-1 text-[10px] leading-tight">
                  <RankDelta delta={row.rankDelta} />
                  <span className={row.hits > 0 ? "font-semibold text-[var(--rose)]" : "text-[var(--muted)]"}>
                    ซื้อ/ขาย {row.hits > 0 ? `-${row.hits}` : "0"}
                  </span>
                  {row.seasonFine > 0 ? (
                    <span
                      className={`rounded-full px-1.5 py-px font-semibold ${
                        topSeasonFine > 0 && row.seasonFine === topSeasonFine
                          ? "bg-[#ffd4d1] text-[#b42318]"
                          : "bg-[#ffe8b8] text-[#9a6700]"
                      }`}
                    >
                      {Math.round(row.seasonFine)}฿
                    </span>
                  ) : null}
                  {row.seasonEndFine > 0 ? (
                    <span className="rounded-full bg-[#ffd4d1] px-1.5 py-px font-semibold text-[#b42318]">
                      {seasonEndFineLabel(row.seasonEndKind)} {Math.round(row.seasonEndFine)}฿
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
            <p className="text-right text-sm font-semibold leading-none">{row.gwPoints}</p>
            <p className="text-right text-base font-semibold leading-none text-[var(--gold-ink)]">{row.total}</p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr className="border-b border-[var(--line)]">
              <th className="px-5 py-3 font-medium">อันดับ</th>
              <th className="px-5 py-3 font-medium">ขึ้น/ลง</th>
              <th className="px-5 py-3 font-medium">ทีม</th>
              <th className="px-5 py-3 font-medium">แต้ม GW</th>
              <th className="px-5 py-3 font-medium">ซื้อ/ขาย</th>
              <th className="px-5 py-3 font-medium">ค่าปรับสะสม</th>
              <th className="px-5 py-3 font-medium">อันดับโลก</th>
              <th className="px-5 py-3 font-medium">แต้ม total</th>
            </tr>
          </thead>
          <tbody>
            {(overall ?? []).map((row) => (
              <tr
                key={row.entryId}
                className={`border-b border-[var(--line)] last:border-0 ${
                  topSeasonFine > 0 && row.seasonFine === topSeasonFine ? "fine-last" : ""
                }`}
              >
                <td className="px-5 py-3">
                  <RankMark rank={row.rank} className="sm:h-8 sm:w-8 sm:text-base" />
                </td>
                <td className="px-5 py-3">
                  <RankDelta delta={row.rankDelta} />
                </td>
                <td className="px-5 py-3">
                  <ManagerCell
                    entryId={row.entryId}
                    playerName={row.playerName}
                    teamName={row.teamName}
                    badgeUrl={row.badgeUrl}
                  />
                </td>
                <td className="px-5 py-3">{row.gwPoints}</td>
                <td className="px-5 py-3 text-[var(--rose)]">{row.hits > 0 ? `-${row.hits}` : "0"}</td>
                <td className="px-5 py-3 font-semibold text-[var(--rose)]">
                  {row.seasonFine > 0 ? formatBaht(row.seasonFine) : "—"}
                  {row.seasonEndFine > 0 ? (
                    <p className="text-xs font-medium text-[var(--rose)]">
                      {seasonEndFineLabel(row.seasonEndKind)} {formatBaht(row.seasonEndFine)}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">{row.overallRank ? formatRank(row.overallRank) : "—"}</td>
                <td className="px-5 py-3 text-lg font-semibold text-[var(--gold-ink)]">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FineCell({ complete, fine, kind }: { complete: boolean; fine: number; kind: FineKind }) {
  const role = fineRoleLabel(kind);
  if (fine <= 0 || !kind || !role) {
    return <span>—</span>;
  }

  const prefix = complete ? "ปรับ" : "โอกาสโดนปรับ";
  const tone = kind === "second" ? "text-[#9a6700]" : "text-[var(--rose)]";

  return (
    <span className={tone}>
      {role} · {prefix} {formatBaht(fine)}
    </span>
  );
}

function MobileWeeklyMeta({ row, complete }: { row: WeeklyRow; complete: boolean }) {
  const chip = chipLabel(row.chip);
  const role = fineRoleLabel(row.fineKind);
  const last = row.fineKind === "last" || row.fineKind === "bottom";

  return (
    <p className="flex flex-wrap items-center gap-1 text-[10px] leading-tight">
      <span className={row.hits > 0 ? "font-semibold text-[var(--rose)]" : "text-[var(--muted)]"}>
        ซื้อ/ขาย {row.hits > 0 ? `-${row.hits}` : "0"}
      </span>
      {chip ? (
        <span className="rounded-full bg-[#fff3c4] px-1.5 py-px font-semibold text-[#7a5a00]">{chip}</span>
      ) : null}
      {row.fine > 0 && role ? (
        <span
          className={`rounded-full px-1.5 py-px font-semibold ${
            last ? "bg-[#ffd4d1] text-[#b42318]" : "bg-[#ffe8b8] text-[#9a6700]"
          }`}
        >
          {role} {complete ? `${Math.round(row.fine)}฿` : `โอกาส ${Math.round(row.fine)}฿`}
        </span>
      ) : null}
    </p>
  );
}

function RankDelta({ delta }: { delta: number }) {
  if (delta > 0) {
    return <span className="shrink-0 font-semibold text-[var(--mint)]">▲ {delta}</span>;
  }

  if (delta < 0) {
    return <span className="shrink-0 font-semibold text-[var(--rose)]">▼ {Math.abs(delta)}</span>;
  }

  return <span className="shrink-0 text-[var(--muted)]">—</span>;
}
