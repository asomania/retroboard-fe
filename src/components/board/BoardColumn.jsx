import AddItemForm from "./AddItemForm.jsx";

/**
 * @param {object} props
 * @param {{ id: string, title: string, tagline: string, items: Array }} props.column
 * @param {string} props.cardDraft
 * @param {(value: string) => void} props.onCardDraftChange
 * @param {() => void} props.onAddCard
 * @param {boolean} props.disableAdd
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const BoardColumn = ({
  column,
  cardDraft,
  onCardDraftChange,
  onAddCard,
  disableAdd,
  children,
}) => {
  const hasItems = column.items.length > 0;

  return (
    <div className="flex min-h-[320px] flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.35)] backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            {column.tagline}
          </p>
          <p className="text-lg font-semibold text-white">{column.title}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {column.items.length}
        </span>
      </header>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80 shadow-inner">
        <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/60">
          Kart ekle
        </p>
        <AddItemForm
          value={cardDraft}
          onChange={onCardDraftChange}
          onSubmit={onAddCard}
          placeholder="Başlık ya da not yaz"
          buttonLabel="Ekle"
          disabled={!cardDraft?.trim() || disableAdd}
          inputClassName="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
          buttonClassName="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {!hasItems && (
          <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
            Henüz kart yok
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default BoardColumn;
