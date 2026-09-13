"use client";

import { ManagerPhoto } from "@/components/ManagerPhoto";
import { RaceVehicleSvg } from "@/components/RaceVehicle";
import { vehiclesForRace } from "@/lib/vehicles";

type ChartRow = {
  entryId: number;
  playerName: string;
  teamName: string;
  value: number;
  badgeUrl?: string | null;
};

type PointsChartProps = {
  selectedGw: number;
  rows?: ChartRow[];
};

export function PointsChart({ selectedGw, rows = [] }: PointsChartProps) {
  const chartRows = [...(rows ?? [])].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(1, ...chartRows.map((row) => row.value));
  const vehicles = vehiclesForRace(chartRows.length, selectedGw);

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_12px_32px_rgba(28,70,42,0.08)]">
      <div className="race-board">
        {chartRows.map((row, index) => {
          const progress = Math.max(14, (row.value / maxValue) * 86);
          const last = index === chartRows.length - 1;
          const vehicle = vehicles[index] ?? vehicles[0];

          return (
            <div key={row.entryId} className="race-row">
              <div className="race-id">
                <span className="race-rank">{index + 1}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white drop-shadow">{row.teamName}</p>
                  <p className="hidden truncate text-xs text-white/70 sm:block">{vehicle.label}</p>
                </div>
              </div>

              <div className="race-track">
                <div className="race-car-slot" style={{ left: `${progress}%` }}>
                  {index === 0 ? <span className="race-crown">👑</span> : null}
                  <ManagerPhoto entryId={row.entryId} name={row.playerName} className="race-driver-photo h-8 w-8" />
                  <RaceVehicleSvg id={vehicle.id} last={last} />
                  {index === 0 ? <span className="race-spark" aria-hidden /> : null}
                </div>
              </div>

              <div className="race-speed">
                <span>{row.value}</span>
                <small>km/h</small>
              </div>
              <div className="race-finish-line" aria-hidden />
            </div>
          );
        })}
      </div>
    </section>
  );
}
