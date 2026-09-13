export type ViewMode = "weekly" | "overall";

export type ManagerIdentity = {
  entryId: number;
  teamName: string;
  playerName: string;
  badgeUrl: string | null;
};

export type ManagerGw = {
  event: number;
  points: number;
  totalPoints: number;
  hits: number;
  transfers: number;
  value: number;
  bank: number;
  overallRank: number;
  chip: string | null;
};

export type FineKind = "last" | "second" | null;

export type WeeklyRow = ManagerIdentity & {
  rank: number;
  points: number;
  totalPoints: number;
  hits: number;
  transfers: number;
  chip: string | null;
  played: boolean;
  fine: number;
  fineKind: FineKind;
  fineSharedWith: number;
  finePot: number;
};

export type OverallRow = ManagerIdentity & {
  rank: number;
  rankDelta: number;
  total: number;
  gwPoints: number;
  hits: number;
  overallRank: number;
  played: boolean;
  seasonFine: number;
};

export type WeeklyHighlight = {
  winner: WeeklyRow | null;
  last: WeeklyRow | null;
  biggestHit: WeeklyRow | null;
};

export type OverallHighlight = {
  leader: OverallRow | null;
  last: OverallRow | null;
  climber: OverallRow | null;
  gapToFirst: number;
};

export type RemainingFixture = {
  id: number;
  kickoff: string | null;
  home: string;
  away: string;
  homeShort: string;
  awayShort: string;
  homeLogo: string | null;
  awayLogo: string | null;
  started: boolean;
  minutes: number;
};

export type GwStatus = {
  complete: boolean;
  remaining: RemainingFixture[];
};

export type LeagueDashboard = {
  leagueId: number;
  leagueName: string;
  lastUpdated: string | null;
  currentGw: number;
  maxGw: number;
  managers: ManagerIdentity[];
  weeklyByGw: Record<number, WeeklyRow[]>;
  overallByGw: Record<number, OverallRow[]>;
  weeklyHighlights: Record<number, WeeklyHighlight>;
  overallHighlights: Record<number, OverallHighlight>;
  gwStatus: Record<number, GwStatus>;
};

export type FplLeagueStanding = {
  entry: number;
  entry_name: string;
  player_name: string;
  rank: number;
  last_rank: number;
  event_total: number;
  total: number;
  club_badge_src: string | null;
};

export type FplLeagueResponse = {
  league: {
    id: number;
    name: string;
    start_event: number;
  };
  last_updated_data: string | null;
  standings?: {
    has_next: boolean;
    page: number;
    results?: FplLeagueStanding[];
  };
};

export type FplHistoryEvent = {
  event: number;
  points: number;
  total_points: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
  value: number;
  bank: number;
  overall_rank: number;
};

export type FplChip = {
  name: string;
  event: number;
};

export type FplHistoryResponse = {
  current?: FplHistoryEvent[];
  chips?: FplChip[];
};

export type FplEventStatusResponse = {
  status?: { event: number }[];
};

export type FplFixture = {
  id: number;
  event: number | null;
  finished: boolean;
  finished_provisional: boolean;
  started: boolean | null;
  minutes: number;
  kickoff_time: string | null;
  team_h: number;
  team_a: number;
};
