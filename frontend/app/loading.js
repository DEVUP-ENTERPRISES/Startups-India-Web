export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="w-full max-w-3xl px-6 space-y-4 animate-pulse" aria-hidden="true">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="h-32 rounded-lg bg-slate-200" />
          <div className="h-32 rounded-lg bg-slate-200" />
          <div className="h-32 rounded-lg bg-slate-200" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
