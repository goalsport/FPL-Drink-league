export const FPL_TEAMS: Record<number, { name: string; short: string; code: number }> = {
  1: { name: "Arsenal", short: "ARS", code: 3 },
  2: { name: "Aston Villa", short: "AVL", code: 7 },
  3: { name: "Bournemouth", short: "BOU", code: 91 },
  4: { name: "Brentford", short: "BRE", code: 94 },
  5: { name: "Brighton", short: "BHA", code: 36 },
  6: { name: "Chelsea", short: "CHE", code: 8 },
  7: { name: "Coventry City", short: "COV", code: 9 },
  8: { name: "Crystal Palace", short: "CRY", code: 31 },
  9: { name: "Everton", short: "EVE", code: 11 },
  10: { name: "Fulham", short: "FUL", code: 54 },
  11: { name: "Hull City", short: "HUL", code: 88 },
  12: { name: "Ipswich Town", short: "IPS", code: 40 },
  13: { name: "Leeds", short: "LEE", code: 2 },
  14: { name: "Liverpool", short: "LIV", code: 14 },
  15: { name: "Man City", short: "MCI", code: 43 },
  16: { name: "Man Utd", short: "MUN", code: 1 },
  17: { name: "Newcastle", short: "NEW", code: 4 },
  18: { name: "Nott'm Forest", short: "NFO", code: 17 },
  19: { name: "Spurs", short: "TOT", code: 6 },
  20: { name: "Sunderland", short: "SUN", code: 56 },
};

export function teamName(id: number): string {
  return FPL_TEAMS[id]?.name ?? `Team ${id}`;
}

export function teamShort(id: number): string {
  return FPL_TEAMS[id]?.short ?? `${id}`;
}

export function teamLogo(id: number): string | null {
  const code = FPL_TEAMS[id]?.code;
  if (!code) return null;
  return `https://resources.premierleague.com/premierleague/badges/70/t${code}.png`;
}
