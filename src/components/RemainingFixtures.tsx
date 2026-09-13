import type { GwStatus } from "@/lib/types";

type RemainingFixturesProps = {
  selectedGw: number;
  status?: GwStatus;
};

function formatTime(iso: string | null): string {
  if (!iso) return "--:--";

  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

function formatDay(iso: string | null): string {
  if (!iso) return "";

  return new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

function ClubLogo({ src, name }: { src: string | null; name: string }) {
  if (!src) {
    return <span className="display text-lg text-[var(--muted)]">{name.slice(0, 3)}</span>;
  }

  return <img src={src} alt={name} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />;
}

export function RemainingFixtures({ selectedGw, status }: RemainingFixturesProps) {
  const remaining = status?.remaining ?? [];

  if (status?.complete || remaining.length === 0) {
    return null;
  }

  return (
    <section className="panel mt-3 overflow-hidden rounded-3xl sm:mt-4">
      <div className="border-b border-[var(--line)] px-4 py-3 sm:px-5">
        <p className="display text-xl text-[var(--foam)] sm:text-2xl">แมตช์ที่ยังเหลือ GW {selectedGw}</p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {remaining.map((fixture) => (
          <article key={fixture.id} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-5">
            <p className="mb-3 text-center text-xs text-[var(--muted)]">{formatDay(fixture.kickoff)}</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex flex-col items-center gap-2 text-center">
                <ClubLogo src={fixture.homeLogo} name={fixture.homeShort} />
                <p className="text-sm font-semibold text-[var(--foam)]">{fixture.homeShort}</p>
              </div>
              <div className="min-w-[4.5rem] text-center">
                {fixture.started ? (
                  <>
                    <p className="display text-3xl text-[var(--foam)]">
                      {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--rose)]">{fixture.minutes}'</p>
                  </>
                ) : (
                  <p className="display text-2xl text-[var(--foam)]">{formatTime(fixture.kickoff)}</p>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ClubLogo src={fixture.awayLogo} name={fixture.awayShort} />
                <p className="text-sm font-semibold text-[var(--foam)]">{fixture.awayShort}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
