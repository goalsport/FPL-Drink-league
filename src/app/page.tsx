import { Dashboard } from "@/components/Dashboard";
import { getLeagueDashboard } from "@/lib/fpl";
import { AVAILABLE_LEAGUES, findLeague } from "@/lib/leagues";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ league?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentLeague = findLeague(resolvedParams?.league);
  const data = await getLeagueDashboard(currentLeague.id);

  return (
    <Dashboard
      key={currentLeague.id}
      data={data}
      leagues={AVAILABLE_LEAGUES}
      currentLeagueId={currentLeague.id}
    />
  );
}

