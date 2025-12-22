import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout")({
  component: Layout,
});

function Layout() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(236,72,153,0.16),transparent_28%),radial-gradient(circle_at_35%_80%,rgba(94,234,212,0.2),transparent_26%)]" />
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-500 text-sm font-black text-slate-950 shadow-lg shadow-rose-500/30">
              {/* Logo placeholder - replace with your mark */}
              RB
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-200/70">
                Retro Board
              </p>
              <p className="text-lg font-semibold leading-tight text-white">
                Akış tahtan burada
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/80 shadow-sm md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Canlı güncellemeler açık</span>
            </div>
            <Link
              to="/board"
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:border-white/40 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Boardu aç
            </Link>
            <button
              type="button"
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              Yeni board
            </button>
          </div>
        </header>

        <main className="relative flex flex-1 flex-col gap-6">
          <section className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
