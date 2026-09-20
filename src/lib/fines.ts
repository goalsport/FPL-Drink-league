import { findLeague } from "./leagues";
import type { FineKind, SeasonEndKind } from "./types";

export const LAST_PLACE_FINE = 50;
export const SECOND_LAST_FINE = 30;
export const PAKDEE_FINE = 50;
export const SEASON_END_GW = 38;
export const SEASON_END_FINES: Record<number, number> = {
  7: 500,
  6: 300,
  5: 200,
};

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
 * - ช่องบ๊วย 50 บาท, ช่องรองบ๊วย 30 บาท
 * - กลุ่มแต้มต่ำสุดกินช่องจากท้ายตามจำนวนคน แล้วหารกัน
 *   เช่น เสมอบ๊วย 2 คน = กินทั้ง 50+30 หารคนละ 40 ไม่ดันคนบนให้เป็นรองบ๊วย
 */
export function assignDrinkLeagueFines(
  rows: { entryId: number; rank: number; played: boolean; points?: number }[],
): Map<number, FineShare> {
  const result = new Map<number, FineShare>();
  const played = rows.filter((row) => row.played);

  for (const row of rows) {
    result.set(row.entryId, ZERO_FINE);
  }

  const uniquePoints = [...new Set(played.map((row) => row.points ?? 0))].sort((a, b) => a - b);
  if (played.length === 0 || uniquePoints.length <= 1) {
    return result;
  }

  const pots = [LAST_PLACE_FINE, SECOND_LAST_FINE];
  let consumed = 0;

  for (const points of uniquePoints) {
    if (consumed >= pots.length) break;

    const group = played.filter((row) => (row.points ?? 0) === points);
    const take = pots.slice(consumed, consumed + group.length);
    const pot = take.reduce((sum, value) => sum + value, 0);
    const amount = sharePot(pot, group.length);
    const kind: FineKind = take.includes(LAST_PLACE_FINE) ? "last" : "second";

    for (const row of group) {
      result.set(row.entryId, {
        amount,
        kind,
        sharedWith: group.length,
        pot,
      });
    }

    consumed += group.length;
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

export type SeasonEndShare = {
  amount: number;
  kind: SeasonEndKind;
};

/**
 * ค่าปรับจบลีก (ครบ 38 GW) ตามอันดับรวม:
 * - อันดับ 7 ปรับ 500 บาท
 * - อันดับ 6 ปรับ 300 บาท
 * - อันดับ 5 ปรับ 200 บาท
 */
export function assignSeasonEndFines(
  rows: { entryId: number; rank: number; played: boolean }[],
): Map<number, SeasonEndShare> {
  const result = new Map<number, SeasonEndShare>();

  for (const row of rows) {
    const amount = SEASON_END_FINES[row.rank] ?? 0;
    const kind = row.rank === 5 || row.rank === 6 || row.rank === 7 ? row.rank : null;
    result.set(row.entryId, { amount, kind });
  }

  return result;
}

