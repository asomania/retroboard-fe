import { Plus } from "lucide-react";
import Badge from "../common/Badge.jsx";

/**
 * @param {object} props
 * @param {{ id: string, title: string, tagline: string, items: Array }} props.column
 * @param {() => void} props.onOpenAddCard
 * @param {boolean} [props.isAddDisabled]
 * @param {(event: React.DragEvent<HTMLDivElement>) => void} [props.onCardDragOver]
 * @param {(event: React.DragEvent<HTMLDivElement>) => void} [props.onCardDrop]
 * @param {boolean} [props.isDropActive]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const BoardColumn = ({
  column,
  onOpenAddCard,
  isAddDisabled = false,
  onCardDragOver,
  onCardDrop,
  isDropActive = false,
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
        <div className="flex items-center gap-2">
          <Badge>{column.items.length}</Badge>
          <button
            type="button"
            onClick={onOpenAddCard}
            disabled={isAddDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Kart ekle"
          >
            <Plus className="h-4 w-4" />
            Kart ekle
          </button>
        </div>
      </header>

      <div
        className={`flex flex-1 flex-col gap-2 rounded-xl p-1 transition ${
          isDropActive ? "bg-emerald-300/10 ring-1 ring-emerald-200/40" : ""
        }`}
        onDragOver={onCardDragOver}
        onDrop={onCardDrop}
      >
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
