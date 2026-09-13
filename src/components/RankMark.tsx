import { rankMark } from "@/lib/format";

const TONE: Record<number, string> = {
  1: "bg-[#ffe08a] text-[#3d2a00]",
  2: "bg-[#e4e9ee] text-[#24303a]",
  3: "bg-[#f0c9a4] text-[#3a2210]",
};

type RankMarkProps = {
  rank: number;
  className?: string;
};

export function RankMark({ rank, className = "" }: RankMarkProps) {
  const tone = TONE[rank] ?? "border border-black/10 bg-white text-[#16331f]";

  return (
    <span
      aria-label={`อันดับ ${rank}`}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] leading-none tabular-nums ${tone} ${className}`}
    >
      <span className="block translate-y-px">{rankMark(rank)}</span>
    </span>
  );
}
