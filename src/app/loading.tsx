export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
      <div className="panel rounded-3xl px-8 py-10 text-center">
        <p className="display text-3xl text-[var(--gold)]">FPL DASHBOARD</p>
        <p className="mt-2 text-sm text-[var(--muted)]">กำลังดึงคะแนนจาก FPL...</p>
      </div>
    </main>
  );
}
