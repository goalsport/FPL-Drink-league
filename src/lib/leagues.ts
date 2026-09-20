export type FineRule = "drink_league" | "bottom_4_flat_50";

export type LeagueConfig = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  fineRule: FineRule;
  fineDescription: string;
  fineTieDescription?: string;
  fineSecondTieDescription?: string;
  seasonEndFine?: boolean;
  seasonEndFineDescription?: string;
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
    fineDescription: "บ๊วยคนเดียว 50฿ · รองบ๊วยคนเดียว 30฿",
    fineTieDescription: "ถ้าบ๊วยเสมอกัน 2 คนขึ้นไป รวม 80฿ (50+30) แล้วหารกัน เช่น 2 คนคนละ 40฿ คนถัดไปไม่โดนปรับรองบ๊วย",
    fineSecondTieDescription: "ถ้าบ๊วยคนเดียว แต่รองบ๊วยเสมอกัน ให้บ๊วยจ่าย 50฿ ที่เหลือหารเฉพาะ 30฿ เช่น 2 คนคนละ 15฿",
    seasonEndFine: true,
    seasonEndFineDescription: "ครบ 38 GW: อันดับ 7 = 500฿ · อันดับ 6 = 300฿ · อันดับ 5 = 200฿",
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
        fineDescription: "บ๊วยคนเดียว 50฿ · รองบ๊วยคนเดียว 30฿",
        fineTieDescription: "ถ้าบ๊วยเสมอกัน 2 คนขึ้นไป รวม 80฿ (50+30) แล้วหารกัน เช่น 2 คนคนละ 40฿ คนถัดไปไม่โดนปรับรองบ๊วย",
        fineSecondTieDescription: "ถ้าบ๊วยคนเดียว แต่รองบ๊วยเสมอกัน ให้บ๊วยจ่าย 50฿ ที่เหลือหารเฉพาะ 30฿ เช่น 2 คนคนละ 15฿",
        seasonEndFine: true,
        seasonEndFineDescription: "ครบ 38 GW: อันดับ 7 = 500฿ · อันดับ 6 = 300฿ · อันดับ 5 = 200฿",
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
      fineDescription: "บ๊วยคนเดียว 50฿ · รองบ๊วยคนเดียว 30฿",
      fineTieDescription: "ถ้าบ๊วยเสมอกัน 2 คนขึ้นไป รวม 80฿ (50+30) แล้วหารกัน เช่น 2 คนคนละ 40฿ คนถัดไปไม่โดนปรับรองบ๊วย",
      fineSecondTieDescription: "ถ้าบ๊วยคนเดียว แต่รองบ๊วยเสมอกัน ให้บ๊วยจ่าย 50฿ ที่เหลือหารเฉพาะ 30฿ เช่น 2 คนคนละ 15฿",
      seasonEndFine: true,
      seasonEndFineDescription: "ครบ 38 GW: อันดับ 7 = 500฿ · อันดับ 6 = 300฿ · อันดับ 5 = 200฿",
    };
  }

  return AVAILABLE_LEAGUES[0];
}
