function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Retroboard
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Your board, your flow
        </h1>
        <p className="text-slate-600">
          Start building your retrospective board here. Add columns, cards, and
          votes as you go.
        </p>
      </header>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-slate-600 shadow-sm backdrop-blur">
        <p className="text-center text-base font-medium">
          No content yet. Add your components to get started.
        </p>
      </section>
    </main>
  );
}

export default App;
