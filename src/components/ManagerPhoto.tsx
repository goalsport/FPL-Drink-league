"use client";

import { useState } from "react";
import { initials } from "@/lib/format";
import { managerPhotoCandidates } from "@/lib/photos";

type ManagerPhotoProps = {
  entryId: number;
  name: string;
  className?: string;
};

export function ManagerPhoto({ entryId, name, className = "h-16 w-16" }: ManagerPhotoProps) {
  const candidates = managerPhotoCandidates(entryId);
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  if (!src) {
    return <Initials name={name} className={className} />;
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} rounded-full border-2 border-white object-cover shadow-sm`}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}

function Initials({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={`display flex items-center justify-center rounded-full border-2 border-white bg-[#e7f4ea] text-[0.65rem] text-[var(--mint)] shadow-sm sm:text-lg ${className}`}
    >
      {initials(name)}
    </div>
  );
}
