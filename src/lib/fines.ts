import { findLeague } from "./leagues";
import type { FineKind } from "./types";

export const LAST_PLACE_FINE = 50;
export const SECOND_LAST_FINE = 30;
export const PAKDEE_FINE = 50;

export type FineShare = {
  amount: number;
  kind: FineKind;
  sharedWith: number;
  pot: number;
};

const ZERO_FINE: FineShare = {
  amount: 0,
  kind: null,
  sharedWith: 0,
  pot: 0,
};

function sharePot(pot: number, count: number): number {
  return Number((pot / count).toFixed(2));
}

/**
 * กฎค่าปรับ Drink League:
 * - อันดับบ๊วย ปรับ 50 บาท (ถ้าแต้มเท่ากันหารกัน)
 * - อันดับรองบ๊วย ปรับ 30 บาท (ถ้าแต้มเท่ากันหารกัน)
 */
export function assignDrinkLeagueFines(
  rows: { entryId: number; rank: number; played: boolean }[],
): Map<number, FineShare> {
  const result = new Map<number, FineShare>();
  const played = rows.filter((row) => row.played);
  const ranks = [...new Set(played.map((row) => row.rank))].sort((a, b) => b - a);
  const lastRank = ranks[0];
  const secondRank = ranks[1];

  for (const row of rows) {
    if (!row.played || lastRank === undefined) {
      result.set(row.entryId, ZERO_FINE);
      continue;
    }

    if (row.rank === lastRank) {
      const sharedWith = played.filter((item) => item.rank === lastRank).length;
      result.set(row.entryId, {
        amount: sharePot(LAST_PLACE_FINE, sharedWith),
        kind: "last",
        sharedWith,
        pot: LAST_PLACE_FINE,
      });
      continue;
    }

    if (secondRank !== undefined && row.rank === secondRank) {
      const sharedWith = played.filter((item) => item.rank === secondRank).length;
      result.set(row.entryId, {
        amount: sharePot(SECOND_LAST_FINE, sharedWith),
        kind: "second",
        sharedWith,
        pot: SECOND_LAST_FINE,
      });
      continue;
    }

    result.set(row.entryId, ZERO_FINE);
  }

  return result;
}

/**
 * กฎค่าปรับ PAKDEETHAILAND (Sakon nakhon):
 * - คนที่ได้คะแนน 4 อันดับสุดท้าย ปรับคนละ 50 บาท เท่ากัน
 * - หากมีคนแต้มเท่ากับอันดับที่ 4 จากท้าย จะเพิ่มคนจ่ายเงินเป็น 5 คน หรือ 6 คน ตามคะแนน
 */
export function assignPakdeeFines(
  rows: { entryId: number; rank: number; played: boolean; points?: number }[],
): Map<number, FineShare> {
  const result = new Map<number, FineShare>();
  const played = rows.filter((row) => row.played);

  // ถ้ายังไม่เริ่มแข่ง หรือทุกคนได้แต้มเท่ากันหมด (เช่น 0 แต้มก่อนแข่ง) จะยังไม่มีค่าปรับ
  const uniquePoints = new Set(played.map((row) => row.points ?? 0));
  if (played.length === 0 || uniquePoints.size <= 1) {
    for (const row of rows) {
      result.set(row.entryId, ZERO_FINE);
    }
    return result;
  }

  // เรียงลำดับตามคะแนน GW จากมากไปน้อย
  const sorted = [...played].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  // หาคะแนนที่เป็นเส้นแบ่งของ 4 อันดับสุดท้าย
  const bottomCount = 4;
  const cutoffIndex = Math.max(0, sorted.length - bottomCount);
  const cutoffScore = sorted[cutoffIndex].points ?? 0;

  // ทุกคนที่ได้คะแนนน้อยกว่าหรือเท่ากับ cutoffScore ถือว่าอยู่ในโซน 4 อันดับสุดท้าย (รวมคนที่แต้มเท่า)
  const finedManagers = played.filter((row) => (row.points ?? 0) <= cutoffScore);
  const finedEntryIds = new Set(finedManagers.map((m) => m.entryId));

  for (const row of rows) {
    if (!row.played || !finedEntryIds.has(row.entryId)) {
      result.set(row.entryId, ZERO_FINE);
      continue;
    }

    result.set(row.entryId, {
      amount: PAKDEE_FINE,
      kind: "bottom",
      sharedWith: 1,
      pot: PAKDEE_FINE,
    });
  }

  return result;
}

export function assignWeeklyFines(
  rows: { entryId: number; rank: number; played: boolean; points?: number }[],
  leagueId?: number,
): Map<number, FineShare> {
  const config = findLeague(leagueId);
  if (config.fineRule === "bottom_4_flat_50") {
    return assignPakdeeFines(rows);
  }

  return assignDrinkLeagueFines(rows);
}

