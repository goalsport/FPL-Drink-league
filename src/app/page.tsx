import { Dashboard } from "@/components/Dashboard";
import { DEFAULT_LEAGUE_ID, getLeagueDashboard } from "@/lib/fpl";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const leagueId = Number(process.env.LEAGUE_ID ?? DEFAULT_LEAGUE_ID);
  const data = await getLeagueDashboard(leagueId);

  return <Dashboard data={data} />;
}
