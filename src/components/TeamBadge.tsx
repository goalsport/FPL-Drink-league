import { initials } from "@/lib/format";

type TeamBadgeProps = {
  name: string;
  badgeUrl: string | null;
  className?: string;
};

export function TeamBadge({ name, badgeUrl, className = "h-10 w-10" }: TeamBadgeProps) {
  if (badgeUrl) {
    return (
      <img
        src={badgeUrl}
        alt={name}
        className={`${className} rounded-full border border-[var(--line)] object-cover`}
      />
    );
  }

  return (
    <div
      className={`display flex items-center justify-center rounded-full bg-[#e7f4ea] text-sm text-[var(--mint)] ${className}`}
    >
      {initials(name)}
    </div>
  );
}
