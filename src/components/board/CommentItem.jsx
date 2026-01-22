/**
 * @param {object} props
 * @param {{ author?: string, createdAt?: string, text?: string }} props.entry
 * @returns {JSX.Element}
 */
const CommentItem = ({ entry }) => {
  const authorName = entry.author || "Anonim";

  return (
    <div className="space-y-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.08em] text-white/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] uppercase text-white/80">
            {authorName.slice(0, 2)}
          </span>
          <span>{authorName}</span>
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
          {entry.createdAt || "Şimdi"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-white/90">{entry.text}</p>
    </div>
  );
};

export default CommentItem;
