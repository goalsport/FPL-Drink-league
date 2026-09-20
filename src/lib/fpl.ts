import { assignSeasonEndFines, assignWeeklyFines, SEASON_END_GW } from "./fines";
import { findLeague } from "./leagues";
import { teamLogo, teamName, teamShort } from "./teams";
import type {
  FplEventStatusResponse,
  FplFixture,
  FplHistoryResponse,
  FplLeagueResponse,
  FplLeagueStanding,
  FplLiveResponse,
  FplPicksResponse,
  FineLedger,
  GwStatus,
  LeagueDashboard,
  ManagerGw,
  ManagerIdentity,
  OverallHighlight,
  OverallRow,
  WeeklyHighlight,
  WeeklyRow,
} from "./types";

const FPL_BASE = "https://fantasy.premierleague.com/api";
export const DEFAULT_LEAGUE_ID = 530685;

async function fplGet<T>(path: string): Promise<T> {
  const response = await fetch(`${FPL_BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "FPL-Drink-League/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`ดึงข้อมูล FPL ไม่สำเร็จ (${path}: ${response.status})`);
  }

  return response.json() as Promise<T>;
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

async function fetchLeagueStandings(leagueId: number): Promise<FplLeagueResponse> {
  const first = await fplGet<FplLeagueResponse>(
    `/leagues-classic/${leagueId}/standings/?page_standings=1`,
  );

  const results = [...asArray(first.standings?.results)];
  let page = 1;
  let hasNext = first.standings?.has_next ?? false;

  while (hasNext) {
    page += 1;
    const next = await fplGet<FplLeagueResponse>(
      `/leagues-classic/${leagueId}/standings/?page_standings=${page}`,
    );
    results.push(...asArray(next.standings?.results));
    hasNext = next.standings?.has_next ?? false;
  }

  return {
    ...first,
    standings: {
      ...first.standings,
      page: first.standings?.page ?? 1,
      results,
      has_next: false,
    },
  };
}

function toIdentity(row: FplLeagueStanding): ManagerIdentity {
  return {
    entryId: row.entry,
    teamName: row.entry_name,
    playerName: row.player_name,
    badgeUrl: row.club_badge_src,
  };
}

function livePointsFromPicks(picks: FplPicksResponse | null | undefined, liveById: Map<number, number>): number {
  return asArray(picks?.picks).reduce((sum, pick) => sum + (liveById.get(pick.element) ?? 0) * (pick.multiplier ?? 0), 0);
}

function applyLiveGw(
  gws: ManagerGw[],
  gw: number,
  picks: FplPicksResponse | null | undefined,
  liveById: Map<number, number>,
): ManagerGw[] {
  const livePoints = livePointsFromPicks(picks, liveById);
  const history = picks?.entry_history;
  const previousTotal = lastKnownTotal(gws, gw - 1)?.totalPoints ?? 0;
  const hits = history?.event_transfers_cost ?? gws.find((row) => row.event === gw)?.hits ?? 0;
  const current: ManagerGw = {
    event: gw,
    points: livePoints,
    totalPoints: history?.total_points ?? previousTotal + livePoints - hits,
    hits,
    transfers: history?.event_transfers ?? gws.find((row) => row.event === gw)?.transfers ?? 0,
    value: history?.value ?? 0,
    bank: history?.bank ?? 0,
    overallRank: history?.overall_rank ?? 0,
    chip: picks?.active_chip ?? gws.find((row) => row.event === gw)?.chip ?? null,
  };

  const withoutCurrent = gws.filter((row) => row.event !== gw);
  return [...withoutCurrent, current].sort((left, right) => left.event - right.event);
}

function toManagerGws(history: FplHistoryResponse | null | undefined): ManagerGw[] {
  const chipsByEvent = new Map(asArray(history?.chips).map((chip) => [chip.event, chip.name]));

  return asArray(history?.current).map((event) => ({
    event: event.event,
    points: event.points,
    totalPoints: event.total_points,
    hits: event.event_transfers_cost,
    transfers: event.event_transfers,
    value: event.value,
    bank: event.bank,
    overallRank: event.overall_rank,
    chip: chipsByEvent.get(event.event) ?? null,
  }));
}

function lastKnownTotal(gws: ManagerGw[], gw: number): ManagerGw | undefined {
  return [...gws].filter((row) => row.event <= gw).at(-1);
}

function buildWeekly(managers: { identity: ManagerIdentity; gws: ManagerGw[] }[], gw: number): WeeklyRow[] {
  const rows = managers
    .map(({ identity, gws }) => {
      const row = gws.find((item) => item.event === gw);
      const points = row?.points ?? 0;

      return {
        ...identity,
        rank: 0,
        points,
        totalPoints: row?.totalPoints ?? lastKnownTotal(gws, gw)?.totalPoints ?? 0,
        hits: row?.hits ?? 0,
        transfers: row?.transfers ?? 0,
        chip: row?.chip ?? null,
        played: Boolean(row),
        fine: 0,
        fineKind: null,
        fineSharedWith: 0,
        finePot: 0,
      };
    })
    .sort((a, b) => b.points - a.points);

  let lastRank = 0;
  let lastPoints: number | null = null;

  return rows.map((row, index) => {
    const rank = lastPoints === row.points ? lastRank : index + 1;
    lastRank = rank;
    lastPoints = row.points;
    return { ...row, rank };
  });
}

function buildGwStatus(fixtures: FplFixture[], gw: number): GwStatus {
  const gwFixtures = fixtures.filter((fixture) => fixture.event === gw);
  const remaining = gwFixtures
    .filter((fixture) => !fixture.finished && !fixture.finished_provisional)
    .map((fixture) => ({
      id: fixture.id,
      kickoff: fixture.kickoff_time,
      home: teamName(fixture.team_h),
      away: teamName(fixture.team_a),
      homeShort: teamShort(fixture.team_h),
      awayShort: teamShort(fixture.team_a),
      homeLogo: teamLogo(fixture.team_h),
      awayLogo: teamLogo(fixture.team_a),
      started: Boolean(fixture.started),
      minutes: fixture.minutes,
      homeScore: fixture.team_h_score,
      awayScore: fixture.team_a_score,
    }))
    .sort((a, b) => (a.kickoff ?? "").localeCompare(b.kickoff ?? ""));

  return {
    complete: gwFixtures.length > 0 && remaining.length === 0 && gwFixtures.every((fixture) => fixture.finished),
    remaining,
  };
}

function applyWeeklyFines(rows: WeeklyRow[], leagueId?: number): WeeklyRow[] {
  const fines = assignWeeklyFines(rows, leagueId);
  return rows.map((row) => {
    const fine = fines.get(row.entryId);
    return {
      ...row,
      fine: fine?.amount ?? 0,
      fineKind: fine?.kind ?? null,
      fineSharedWith: fine?.sharedWith ?? 0,
      finePot: fine?.pot ?? 0,
    };
  });
}

function buildOverall(
  managers: { identity: ManagerIdentity; gws: ManagerGw[] }[],
  gw: number,
): OverallRow[] {
  return managers
    .map(({ identity, gws }) => {
      const row = gws.find((item) => item.event === gw);
      const last = lastKnownTotal(gws, gw);

      return {
        ...identity,
        rank: 0,
        rankDelta: 0,
        total: last?.totalPoints ?? 0,
        gwPoints: row?.points ?? 0,
        hits: row?.hits ?? 0,
        overallRank: last?.overallRank ?? 0,
        played: Boolean(row),
        seasonFine: 0,
        seasonEndFine: 0,
        seasonEndKind: null,
      };
    })
    .sort((a, b) => b.total - a.total)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function applyRankDelta(byGw: Record<number, OverallRow[]>, maxGw: number) {
  for (let gw = 1; gw <= maxGw; gw += 1) {
    for (const row of byGw[gw]) {
      if (gw === 1) {
        row.rankDelta = 0;
        continue;
      }

      const previous = byGw[gw - 1].find((item) => item.entryId === row.entryId);
      row.rankDelta = previous ? previous.rank - row.rank : 0;
    }
  }
}

function weeklyHighlight(rows: WeeklyRow[]): WeeklyHighlight {
  const played = rows.filter((row) => row.played);
  const biggestHit = [...played].sort((a, b) => b.hits - a.hits || a.points - b.points)[0];

  return {
    winner: played[0] ?? null,
    last: played.at(-1) ?? null,
    biggestHit: biggestHit && biggestHit.hits > 0 ? biggestHit : null,
  };
}

function overallHighlight(rows: OverallRow[]): OverallHighlight {
  const played = rows.filter((row) => row.played || row.total > 0);
  const climber = [...played].sort((a, b) => b.rankDelta - a.rankDelta)[0];

  return {
    leader: played[0] ?? null,
    last: played.at(-1) ?? null,
    climber: climber && climber.rankDelta > 0 ? climber : null,
    gapToFirst: played.length > 1 ? played[0].total - played[1].total : 0,
  };
}

export async function getLeagueDashboard(leagueId = DEFAULT_LEAGUE_ID): Promise<LeagueDashboard> {
  const [league, eventStatus, fixtures] = await Promise.all([
    fetchLeagueStandings(leagueId),
    fplGet<FplEventStatusResponse>("/event-status/"),
    fplGet<FplFixture[]>("/fixtures/"),
  ]);

  const identities = asArray(league.standings?.results).map(toIdentity);
  const histories = await Promise.all(
    identities.map((manager) => fplGet<FplHistoryResponse>(`/entry/${manager.entryId}/history/`)),
  );

  const currentFromStatus = asArray(eventStatus?.status)[0]?.event;
  const maxFromHistory = Math.max(
    0,
    ...histories.flatMap((history) => asArray(history?.current).map((row) => row.event)),
  );
  const currentGw = currentFromStatus ?? maxFromHistory ?? 1;
  const maxGw = Math.max(currentGw, maxFromHistory, 1);

  const [live, pickRows] = await Promise.all([
    fplGet<FplLiveResponse>(`/event/${currentGw}/live/`),
    Promise.all(identities.map((manager) => fplGet<FplPicksResponse>(`/entry/${manager.entryId}/event/${currentGw}/picks/`))),
  ]);

  const liveById = new Map(
    asArray(live?.elements).map((element) => [element.id, element.stats?.total_points ?? 0] as const),
  );

  const managers = identities.map((identity, index) => ({
    identity,
    gws: applyLiveGw(toManagerGws(histories[index]), currentGw, pickRows[index], liveById),
  }));

  const weeklyByGw: Record<number, WeeklyRow[]> = {};
  const overallByGw: Record<number, OverallRow[]> = {};
  const weeklyHighlights: Record<number, WeeklyHighlight> = {};
  const overallHighlights: Record<number, OverallHighlight> = {};
  const gwStatus: Record<number, GwStatus> = {};

  for (let gw = 1; gw <= maxGw; gw += 1) {
    const status = buildGwStatus(asArray(fixtures), gw);
    gwStatus[gw] = status;
    const weekly = buildWeekly(managers, gw);
    weeklyByGw[gw] = applyWeeklyFines(weekly, leagueId);
    overallByGw[gw] = buildOverall(managers, gw);
    weeklyHighlights[gw] = weeklyHighlight(weeklyByGw[gw]);
  }

  applyRankDelta(overallByGw, maxGw);

  for (let gw = 1; gw <= maxGw; gw += 1) {
    for (const row of overallByGw[gw]) {
      row.seasonFine = Array.from({ length: gw }, (_, index) => {
        const weekly = weeklyByGw[index + 1].find((item) => item.entryId === row.entryId);
        return gwStatus[index + 1]?.complete ? weekly?.fine ?? 0 : 0;
      }).reduce((sum, amount) => sum + amount, 0);
    }
    overallHighlights[gw] = overallHighlight(overallByGw[gw]);
  }

  const leagueConfig = findLeague(leagueId);
  if (leagueConfig.seasonEndFine && gwStatus[SEASON_END_GW]?.complete) {
    const endFines = assignSeasonEndFines(overallByGw[SEASON_END_GW] ?? []);
    for (let gw = SEASON_END_GW; gw <= maxGw; gw += 1) {
      for (const row of overallByGw[gw] ?? []) {
        const extra = endFines.get(row.entryId);
        row.seasonEndFine = extra?.amount ?? 0;
        row.seasonEndKind = extra?.kind ?? null;
        row.seasonFine += row.seasonEndFine;
      }
    }
  }

  const latestOverall = overallByGw[maxGw] ?? [];
  const completedGws = Object.values(gwStatus).filter((status) => status.complete).length;
  const fineLedger: FineLedger = {
    completedGws,
    leagueTotal: latestOverall.reduce((sum, row) => sum + row.seasonFine, 0),
    rows: [...latestOverall]
      .map((row) => ({
        entryId: row.entryId,
        teamName: row.teamName,
        playerName: row.playerName,
        badgeUrl: row.badgeUrl,
        total: row.seasonFine,
      }))
      .sort((a, b) => b.total - a.total || a.teamName.localeCompare(b.teamName)),
  };

  return {
    leagueId: league.league.id,
    leagueName: league.league.name,
    lastUpdated: league.last_updated_data,
    currentGw,
    maxGw,
    managers: identities,
    weeklyByGw,
    overallByGw,
    weeklyHighlights,
    overallHighlights,
    gwStatus,
    fineLedger,
  };
}
