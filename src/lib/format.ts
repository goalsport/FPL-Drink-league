export const CHIP_LABELS: Record<string, string> = {
  wildcard: "Wildcard",
  freehit: "Free Hit",
  bboost: "Bench Boost",
  "3xc": "Triple Captain",
  manager: "Manager",
};

export function chipLabel(chip: string | null): string | null {
  if (!chip) return null;
  return CHIP_LABELS[chip] ?? chip;
}

export function formatUpdated(iso: string | null): string {
  if (!iso) return "ยังไม่มีเวลาอัปเดต";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

export function formatRank(rank: number): string {
  return rank.toLocaleString("th-TH");
}

export function rankMark(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function formatBaht(amount: number): string {
  return `${amount.toLocaleString("th-TH", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })} บาท`;
}
