export type FineRule = "drink_league" | "bottom_4_flat_50";

export type LeagueConfig = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  fineRule: FineRule;
  fineDescription: string;
};

export const DEFAULT_LEAGUE_ID = 530685;

export const AVAILABLE_LEAGUES: LeagueConfig[] = [
  {
    id: 530685,
    name: "DRINK LEAGUE",
    slug: "drink-league",
    icon: "🍺",
    description: "Drink League ประจำกลุ่ม",
    fineRule: "drink_league",
    fineDescription: "อันดับบ๊วย 50 บาท · รองบ๊วย 30 บาท (หารแต้มเท่า)",
  },
  {
    id: 1129447,
    name: "PAKDEETHAILAND",
    slug: "pakdeethailand",
    icon: "⚽",
    description: "PAKDEETHAILAND (Sakon nakhon)",
    fineRule: "bottom_4_flat_50",
    fineDescription: "4 อันดับสุดท้าย (หรือแต้มเท่า) ปรับคนละ 50 บาท",
  },
];

export function findLeague(query?: string | number | null): LeagueConfig {
  if (!query) {
    const envLeagueId = Number(process.env.LEAGUE_ID);
    if (envLeagueId) {
      const foundInEnv = AVAILABLE_LEAGUES.find((l) => l.id === envLeagueId);
      if (foundInEnv) return foundInEnv;
      return {
        id: envLeagueId,
        name: `LEAGUE ${envLeagueId}`,
        slug: String(envLeagueId),
        icon: "🏆",
        fineRule: "drink_league",
        fineDescription: "อันดับบ๊วย 50 บาท · รองบ๊วย 30 บาท (หารแต้มเท่า)",
      };
    }
    return AVAILABLE_LEAGUES[0];
  }

  const queryStr = String(query).trim().toLowerCase();
  const queryNum = Number(query);

  const matched = AVAILABLE_LEAGUES.find(
    (l) =>
      (!Number.isNaN(queryNum) && l.id === queryNum) ||
      l.slug.toLowerCase() === queryStr ||
      l.name.toLowerCase() === queryStr,
  );

  if (matched) return matched;

  if (!Number.isNaN(queryNum) && queryNum > 0) {
    return {
      id: queryNum,
      name: `LEAGUE ${queryNum}`,
      slug: String(queryNum),
      icon: "🏆",
      fineRule: "drink_league",
      fineDescription: "อันดับบ๊วย 50 บาท · รองบ๊วย 30 บาท (หารแต้มเท่า)",
    };
  }

  return AVAILABLE_LEAGUES[0];
}
