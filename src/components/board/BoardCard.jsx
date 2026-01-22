import AddItemForm from "./AddItemForm.jsx";
import CardCommentSection from "./CardCommentSection.jsx";

/**
 * @param {object} props
 * @param {{ id?: string, text?: string, title?: string, votes?: number, comments?: Array }} props.item
 * @param {string} props.commentDraft
 * @param {(value: string) => void} props.onCommentDraftChange
 * @param {() => void} props.onAddComment
 * @param {boolean} props.disableAdd
 * @returns {JSX.Element}
 */
const BoardCard = ({
  item,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  disableAdd,
}) => {
  return (
    <article className="space-y-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <p className="leading-relaxed">{item.text || item.title || "Kart"}</p>
      {item.votes !== undefined && (
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            {item.votes} oy
          </span>
        </div>
      )}

      <CardCommentSection comments={item.comments} />

      <AddItemForm
        value={commentDraft}
        onChange={onCommentDraftChange}
        onSubmit={onAddComment}
        placeholder="Yorum ekle"
        buttonLabel="Gönder"
        disabled={!commentDraft?.trim() || disableAdd}
        inputClassName="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
        buttonClassName="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
      />
    </article>
  );
};

export default BoardCard;
