"use client";

import { addCollection, Icon } from "@iconify/react";
import vehicleIcons from "@/lib/vehicle-icons.json";
import type { VehicleId } from "@/lib/vehicles";
import { VEHICLE_FACE_RIGHT, VEHICLE_ICONS } from "@/lib/vehicles";

addCollection(vehicleIcons);

type RaceVehicleSvgProps = {
  id: VehicleId;
  last?: boolean;
};

export function RaceVehicleSvg({ id, last = false }: RaceVehicleSvgProps) {
  return (
    <span className={`race-vehicle ${last ? "is-last" : ""} ${VEHICLE_FACE_RIGHT[id] ? "is-flipped" : ""}`}>
      <Icon icon={VEHICLE_ICONS[id]} className="race-car-svg" aria-hidden />
    </span>
  );
}
