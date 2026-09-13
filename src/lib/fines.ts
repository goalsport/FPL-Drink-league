import type { FineKind } from "./types";

export const LAST_PLACE_FINE = 50;
export const SECOND_LAST_FINE = 30;

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

export function assignWeeklyFines(rows: { entryId: number; rank: number; played: boolean }[]): Map<number, FineShare> {
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
