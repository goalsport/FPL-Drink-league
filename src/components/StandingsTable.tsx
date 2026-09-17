"use client";

import { ManagerPhoto } from "@/components/ManagerPhoto";
import { RankMark } from "@/components/RankMark";
import { TeamBadge } from "@/components/TeamBadge";
import { chipLabel, formatBaht, formatRank } from "@/lib/format";
import type { FineKind, OverallRow, ViewMode, WeeklyRow } from "@/lib/types";

type StandingsTableProps = {
  mode: ViewMode;
  weekly: WeeklyRow[];
  overall: OverallRow[];
  gwComplete?: boolean;
};


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

export function StandingsTable({ mode, weekly, overall, gwComplete = false }: StandingsTableProps) {
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
              className={`grid grid-cols-[1.75rem_minmax(0,1fr)_2.4rem_2.6rem] items-center gap-1 px-3 py-1.5 ${
                row.fineKind === "last" || row.fineKind === "bottom"
                  ? "fine-last"
                  : row.fineKind === "second"
                    ? "fine-second"
                    : ""
              }`}
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
                <th className="px-5 py-3 font-medium">หัก</th>
                <th className="px-5 py-3 font-medium">ชิป</th>
                <th className="px-5 py-3 font-medium">ค่าปรับ</th>
                <th className="px-5 py-3 font-medium">แต้ม total</th>
              </tr>
            </thead>
            <tbody>
              {(weekly ?? []).map((row) => (
                <tr
                  key={row.entryId}
                  className={`border-b border-[var(--line)] last:border-0 ${
                    row.fineKind === "last" || row.fineKind === "bottom"
                      ? "fine-last"
                      : row.fineKind === "second"
                        ? "fine-second"
                        : ""
                  }`}
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

        <dl className="hidden gap-3 border-t border-[var(--line)] px-5 py-4 text-sm text-[var(--muted)] md:grid md:grid-cols-3">
          <div>
            <dt className="font-semibold text-[var(--foam)]">แต้ม GW</dt>
            <dd>คะแนนเฉพาะเกมวีคนั้น ใช้จัดอันดับและคิดค่าปรับ</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--foam)]">แต้ม total</dt>
            <dd>คะแนนสะสมรวมทุก GW จนถึงวีคนี้ ตาม FPL</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--foam)]">หัก</dt>
            <dd>แต้มที่โดนตัดจากการซื้อขายนักเตะเกินฟรีทรานสเฟอร์</dd>
          </div>
        </dl>
      </section>
    );
  }

  const topSeasonFine = Math.max(0, ...overall.map((row) => row.seasonFine));

  return (
    <section className="panel overflow-hidden rounded-3xl">
      <div className="border-b border-[var(--line)] px-4 py-3 sm:px-5 sm:py-4">
        <p className="display text-xl text-[var(--foam)] sm:text-2xl">ตาราง GW รวม</p>
        <p className="text-sm text-[var(--muted)]">แต้ม total คือคะแนนสะสมถึงเกมวีคที่เลือก พร้อมค่าปรับสะสมตามกติกาลีก</p>
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
                    หัก {row.hits > 0 ? `-${row.hits}` : "0"}
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
              <th className="px-5 py-3 font-medium">หัก</th>
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
  if (fine <= 0 || !kind) {
    return <span>—</span>;
  }

  if (complete) {
    return <span>ปรับ {formatBaht(fine)}</span>;
  }

  return <span>โอกาสโดนปรับ {formatBaht(fine)}</span>;
}

function MobileWeeklyMeta({ row, complete }: { row: WeeklyRow; complete: boolean }) {
  const chip = chipLabel(row.chip);

  return (
    <p className="flex flex-wrap items-center gap-1 text-[10px] leading-tight">
      <span className={row.hits > 0 ? "font-semibold text-[var(--rose)]" : "text-[var(--muted)]"}>
        หัก {row.hits > 0 ? `-${row.hits}` : "0"}
      </span>
      {chip ? (
        <span className="rounded-full bg-[#fff3c4] px-1.5 py-px font-semibold text-[#7a5a00]">{chip}</span>
      ) : null}
      {row.fine > 0 ? (
        <span
          className={`rounded-full px-1.5 py-px font-semibold ${
            row.fineKind === "last" || row.fineKind === "bottom"
              ? "bg-[#ffd4d1] text-[#b42318]"
              : "bg-[#ffe8b8] text-[#9a6700]"
          }`}
        >
          {complete ? `ปรับ ${Math.round(row.fine)}฿` : `โอกาสโดนปรับ ${Math.round(row.fine)}฿`}
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
