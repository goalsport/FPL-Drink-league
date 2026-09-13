export type VehicleId =
  | "rocket"
  | "jet"
  | "plane"
  | "heli"
  | "ufo"
  | "moto"
  | "car"
  | "boat"
  | "train"
  | "scooter"
  | "bike"
  | "skateboard"
  | "skate"
  | "sail"
  | "kickscooter"
  | "cart";

export type RaceVehicle = {
  id: VehicleId;
  label: string;
  speed: number;
  photoX: number;
  photoY: number;
};

export const VEHICLE_POOL: RaceVehicle[] = [
  { id: "rocket", label: "จรวด", speed: 16, photoX: 30, photoY: -2 },
  { id: "jet", label: "เจ็ต", speed: 15, photoX: 40, photoY: 0 },
  { id: "plane", label: "เครื่องบิน", speed: 14, photoX: 38, photoY: -2 },
  { id: "heli", label: "เฮลิคอปเตอร์", speed: 13, photoX: 26, photoY: 4 },
  { id: "ufo", label: "จานบิน", speed: 12, photoX: 36, photoY: -2 },
  { id: "moto", label: "มอเตอร์ไซค์", speed: 11, photoX: 32, photoY: -8 },
  { id: "car", label: "รถแข่ง", speed: 10, photoX: 36, photoY: -2 },
  { id: "boat", label: "เรือเร็ว", speed: 9, photoX: 40, photoY: 2 },
  { id: "train", label: "รถไฟ", speed: 8, photoX: 28, photoY: 0 },
  { id: "scooter", label: "สกู๊ตเตอร์", speed: 7, photoX: 38, photoY: -8 },
  { id: "bike", label: "จักรยาน", speed: 6, photoX: 38, photoY: -10 },
  { id: "skateboard", label: "สเก็ตบอร์ด", speed: 5, photoX: 36, photoY: -12 },
  { id: "skate", label: "สเก็ต", speed: 4, photoX: 34, photoY: -10 },
  { id: "sail", label: "เรือใบ", speed: 3, photoX: 22, photoY: 2 },
  { id: "kickscooter", label: "สกู๊ตเตอร์ขาไถ", speed: 2, photoX: 36, photoY: -12 },
  { id: "cart", label: "รถเข็น", speed: 1, photoX: 30, photoY: -6 },
];

export const VEHICLE_ICONS: Record<VehicleId, string> = {
  rocket: "fluent-emoji:rocket",
  jet: "fluent-emoji:small-airplane",
  plane: "fluent-emoji:airplane",
  heli: "fluent-emoji:helicopter",
  ufo: "fluent-emoji:flying-saucer",
  moto: "fluent-emoji:motorcycle",
  car: "fluent-emoji:racing-car",
  boat: "fluent-emoji:speedboat",
  train: "fluent-emoji:locomotive",
  scooter: "fluent-emoji:motor-scooter",
  bike: "fluent-emoji:bicycle",
  skateboard: "fluent-emoji:skateboard",
  skate: "fluent-emoji:roller-skate",
  sail: "fluent-emoji:sailboat",
  kickscooter: "fluent-emoji:kick-scooter",
  cart: "fluent-emoji:shopping-cart",
};

export const VEHICLE_FACE_RIGHT: Record<VehicleId, boolean> = {
  rocket: false,
  jet: false,
  plane: false,
  heli: false,
  ufo: false,
  moto: true,
  car: true,
  boat: false,
  train: true,
  scooter: true,
  bike: true,
  skateboard: true,
  skate: true,
  sail: false,
  kickscooter: true,
  cart: false,
};

function seededRandom(seed: number) {
  let value = seed + 0x6d2b79f5;
  return () => {
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number): T[] {
  const next = seededRandom(seed);
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }

  return copy;
}

export function vehiclesForRace(count: number, gw: number): RaceVehicle[] {
  return shuffle(VEHICLE_POOL, gw * 31 + 5)
    .slice(0, Math.max(count, 1))
    .sort((left, right) => right.speed - left.speed);
}
