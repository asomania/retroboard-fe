import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Modal from "../../Modal.jsx";

export const Route = createLazyFileRoute("/board/$boardID")({
  component: BoardDetailRoute,
});

function BoardDetailRoute() {
  const { boardID } = Route.useParams();
  const [users, setUsers] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [cardDrafts, setCardDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const { data, error, isLoading } = useQuery({
    queryKey: ["board", boardID],
    queryFn: async () => {
      const res = await fetch(`/boards/${boardID}`);
      if (!res.ok) throw new Error(`Failed to load board ${boardID}`);
      return res.json();
    },
  });

  useEffect(() => {
    setBoardData(data);
  }, [data]);

  const columns = buildColumns(boardData);

  const handleAddCard = (columnId) => {
    const text = (cardDrafts[columnId] || "").trim();
    if (!text || !boardData) return;
    const nextCard = {
      id: `new-${Date.now()}`,
      text,
      votes: 0,
      comments: [],
    };
    setBoardData((prev) =>
      prev
        ? {
            ...prev,
            columns: prev.columns.map((col) =>
              col.id === columnId
                ? { ...col, cards: [...(col.cards || []), nextCard] }
                : col
            ),
          }
        : prev
    );
    setCardDrafts((prev) => ({ ...prev, [columnId]: "" }));
  };

  const handleAddComment = (columnId, cardId) => {
    const text = (commentDrafts[cardId] || "").trim();
    if (!text || !boardData) return;
    const nextComment = {
      id: `cm-${Date.now()}`,
      author: "Sen",
      text,
      createdAt: "Şimdi",
    };
    setBoardData((prev) =>
      prev
        ? {
            ...prev,
            columns: prev.columns.map((col) => {
              if (col.id !== columnId) return col;
              return {
                ...col,
                cards: (col.cards || []).map((card) =>
                  card.id === cardId
                    ? {
                        ...card,
                        comments: [...(card.comments || []), nextComment],
                      }
                    : card
                ),
              };
            }),
          }
        : prev
    );
    setCommentDrafts((prev) => ({ ...prev, [cardId]: "" }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Board
            </p>
            <p className="text-2xl font-bold text-white">#{boardID}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            {isLoading && <span className="text-emerald-300">Yükleniyor…</span>}
            {error && (
              <span className="rounded-full border border-red-400/50 bg-red-500/10 px-3 py-1 text-red-200">
                Hata: {error.message}
              </span>
            )}
            {data && !isLoading && !error && (
              <button className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                Board hazır
              </button>
            )}
            <button
              onClick={() => setUsers(true)}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 hover:text-white"
            >
              <UserIcon />
              Katılımcılar
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">
                {data?.participants?.length ?? 0}
              </span>
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex min-h-[320px] flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    {column.tagline}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {column.title}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  {column.items.length}
                </span>
              </header>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80 shadow-inner">
                <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/60">
                  Kart ekle
                </p>
                <div className="flex gap-2">
                  <input
                    value={cardDrafts[column.id] ?? ""}
                    onChange={(e) =>
                      setCardDrafts((prev) => ({
                        ...prev,
                        [column.id]: e.target.value,
                      }))
                    }
                    placeholder="Başlık ya da not yaz"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddCard(column.id)}
                    className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
                    disabled={!cardDrafts[column.id]?.trim() || !boardData}
                  >
                    Ekle
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {column.items.length === 0 && (
                  <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
                    Henüz kart yok
                  </p>
                )}
                {column.items.map((item, idx) => (
                  <article
                    key={item.id || `${column.id}-${idx}`}
                    className="space-y-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                  >
                    <p className="leading-relaxed">
                      {item.text || item.title || "Kart"}
                    </p>
                    {item.votes !== undefined && (
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                          <span className="h-2 w-2 rounded-full bg-amber-300" />
                          {item.votes} oy
                        </span>
                      </div>
                    )}

                    {Array.isArray(item.comments) && item.comments.length > 0 ? (
                      <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] uppercase text-white/80">
                            {item.comments.length}
                          </span>
                          Yorumlar
                        </div>
                        <div className="space-y-2">
                          {item.comments.map((comment) => (
                            <CommentItem key={comment.id} entry={comment} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-white/60">
                        Henüz yorum yok. İlk notu ekleyen ol.
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        value={commentDrafts[item.id] ?? ""}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Yorum ekle"
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(column.id, item.id)}
                        className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
                        disabled={!commentDrafts[item.id]?.trim() || !boardData}
                      >
                        Gönder
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {boardData && (
          <section className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Ham veri
            </p>
            <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100/90">
              {JSON.stringify(boardData, null, 2)}
            </pre>
          </section>
        )}
      </main>
      {users ? (
        <Modal>
          <div className="w-[420px] max-w-full rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                  Katılımcılar
                </p>
                <p className="text-lg font-semibold text-white">
                  {data?.name || `Board #${boardID}`}
                </p>
              </div>
              <button
                onClick={() => setUsers(false)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/15"
              >
                Kapat
              </button>
            </header>
            <div className="space-y-2">
              {(data?.participants ?? []).map((person) => (
                <div
                  key={person}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-semibold uppercase">
                    {person.slice(0, 2)}
                  </div>
                  <p className="font-medium">{person}</p>
                </div>
              ))}
              {!data?.participants?.length && (
                <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
                  Henüz katılımcı yok.
                </p>
              )}
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function buildColumns(data) {
  const defaults = [
    { id: "keep", title: "Öne çıkanlar", tagline: "Kutla", items: [] },
    { id: "problem", title: "Sorular", tagline: "Öğren", items: [] },
    { id: "action", title: "Denenecek", tagline: "Harekete geç", items: [] },
  ];

  if (Array.isArray(data?.columns) && data.columns.length) {
    return data.columns.slice(0, 3).map((col, idx) => ({
      id: col.id || `col-${idx}`,
      title: col.title || defaults[idx]?.title || `Sütun ${idx + 1}`,
      tagline: defaults[idx]?.tagline || "Kartlar",
      items: Array.isArray(col.cards) ? col.cards : [],
    }));
  }

  return defaults;
}

function CommentItem({ entry }) {
  return (
    <div
      className="space-y-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.08em] text-white/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] uppercase text-white/80">
            {(entry.author || "Anonim").slice(0, 2)}
          </span>
          <span>{entry.author || "Anonim"}</span>
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
          {entry.createdAt || "Şimdi"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-white/90">{entry.text}</p>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 12a3 3 0 1 0-2.988-2.7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87"
      />
    </svg>
  );
}
