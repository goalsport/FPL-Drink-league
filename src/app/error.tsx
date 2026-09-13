"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
      <div className="panel rounded-3xl px-8 py-10 text-center">
        <p className="display text-3xl text-[var(--gold)]">ดึงข้อมูลไม่สำเร็จ</p>
        <p className="mt-3 text-sm text-[var(--muted)]">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-semibold text-[#3d2a00]"
        >
          ลองอีกครั้ง
        </button>
      </div>
    </main>
  );
}
