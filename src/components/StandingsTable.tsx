"use client";

import { ManagerPhoto } from "@/components/ManagerPhoto";
import { TeamBadge } from "@/components/TeamBadge";
import { chipLabel, formatBaht, formatRank } from "@/lib/format";
import type { FineKind, OverallRow, ViewMode, WeeklyRow } from "@/lib/types";

type StandingsTableProps = {
  mode: ViewMode;
  weekly: WeeklyRow[];
  overall: OverallRow[];
  gwComplete?: boolean;
};

function RankBadge({ rank }: { rank: number }) {
  const tone =
    rank === 1
      ? "bg-[#e3a008] text-[#3d2a00]"
      : rank === 2
        ? "bg-[#c5d0d8] text-[#24303a]"
        : rank === 3
          ? "bg-[#e0a06a] text-[#3a2210]"
          : "bg-[#e7f4ea] text-[var(--foam)]";

  return <span className={`display inline-flex h-8 w-8 items-center justify-center rounded-full text-lg ${tone}`}>{rank}</span>;
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
    <div className="flex items-center gap-3">
      <ManagerPhoto entryId={entryId} name={playerName} className="h-12 w-12" />
      <TeamBadge name={teamName} badgeUrl={badgeUrl} className="h-8 w-8" />
      <div>
        <p className="font-semibold text-[var(--foam)]">{playerName}</p>
        <p className="text-sm text-[var(--muted)]">{teamName}</p>
      </div>
    </div>
  );
}

export function StandingsTable({ mode, weekly, overall, gwComplete = false }: StandingsTableProps) {
  if (mode === "weekly") {
    return (
      <section className="panel weekly-featured overflow-hidden rounded-3xl">
        <div className="border-b border-[var(--line)] bg-[#fff8e8] px-5 py-4">
          <p className="display text-3xl text-[var(--foam)]">ตารางคะแนน GW</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr className="border-b border-[var(--line)]">
                <th className="px-5 py-3 font-medium">อันดับ</th>
                <th className="px-5 py-3 font-medium">ผู้เล่น</th>
                <th className="px-5 py-3 font-medium">แต้ม GW</th>
                <th className="px-5 py-3 font-medium">แต้ม total</th>
                <th className="px-5 py-3 font-medium">โอน</th>
                <th className="px-5 py-3 font-medium">หัก</th>
                <th className="px-5 py-3 font-medium">ชิป</th>
                <th className="px-5 py-3 font-medium">ค่าปรับ</th>
              </tr>
            </thead>
            <tbody>
              {(weekly ?? []).map((row) => (
                <tr
                  key={row.entryId}
                  className={`border-b border-[var(--line)] last:border-0 ${
                    row.fineKind === "last" ? "fine-last" : row.fineKind === "second" ? "fine-second" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <RankBadge rank={row.rank} />
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
                  <td className="px-5 py-3 font-semibold">{row.totalPoints}</td>
                  <td className="px-5 py-3">{row.transfers}</td>
                  <td className="px-5 py-3 text-[var(--rose)]">{row.hits > 0 ? `-${row.hits}` : "0"}</td>
                  <td className="px-5 py-3">{chipLabel(row.chip) ?? "—"}</td>
                  <td className="px-5 py-3 font-semibold text-[var(--rose)]">
                    <FineCell complete={gwComplete} fine={row.fine} kind={row.fineKind} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="grid gap-3 border-t border-[var(--line)] px-5 py-4 text-sm text-[var(--muted)] md:grid-cols-3">
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

  return (
    <section className="panel overflow-hidden rounded-3xl">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <p className="display text-2xl text-[var(--foam)]">ตาราง GW รวม</p>
        <p className="text-sm text-[var(--muted)]">แต้ม total คือคะแนนสะสมถึงเกมวีคที่เลือก พร้อมค่าปรับสะสมตามกติกาลีก</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr className="border-b border-[var(--line)]">
              <th className="px-5 py-3 font-medium">อันดับ</th>
              <th className="px-5 py-3 font-medium">ขึ้น/ลง</th>
              <th className="px-5 py-3 font-medium">ผู้เล่น</th>
              <th className="px-5 py-3 font-medium">แต้ม total</th>
              <th className="px-5 py-3 font-medium">แต้ม GW</th>
              <th className="px-5 py-3 font-medium">หัก</th>
              <th className="px-5 py-3 font-medium">ค่าปรับสะสม</th>
              <th className="px-5 py-3 font-medium">อันดับโลก</th>
            </tr>
          </thead>
          <tbody>
            {(overall ?? []).map((row) => (
              <tr key={row.entryId} className="border-b border-[var(--line)] last:border-0">
                <td className="px-5 py-3">
                  <RankBadge rank={row.rank} />
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
                <td className="px-5 py-3 text-lg font-semibold text-[var(--gold-ink)]">{row.total}</td>
                <td className="px-5 py-3">{row.gwPoints}</td>
                <td className="px-5 py-3 text-[var(--rose)]">{row.hits > 0 ? `-${row.hits}` : "0"}</td>
                <td className="px-5 py-3 font-semibold text-[var(--rose)]">
                  {row.seasonFine > 0 ? formatBaht(row.seasonFine) : "—"}
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">{row.overallRank ? formatRank(row.overallRank) : "—"}</td>
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
    return <span>{formatBaht(fine)}</span>;
  }

  return <span>โอกาสโดน {kind === "last" ? 50 : 30} บาท</span>;
}

function RankDelta({ delta }: { delta: number }) {
  if (delta > 0) {
    return <span className="font-semibold text-[var(--mint)]">▲ {delta}</span>;
  }

  if (delta < 0) {
    return <span className="font-semibold text-[var(--rose)]">▼ {Math.abs(delta)}</span>;
  }

  return <span className="text-[var(--muted)]">—</span>;
}
