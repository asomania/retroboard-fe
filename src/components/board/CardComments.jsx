import CommentItem from "./CommentItem.jsx";

/**
 * @param {object} props
 * @param {Array} props.comments
 * @returns {JSX.Element}
 */
const CardComments = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="mt-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-white/60">
        Henüz yorum yok. İlk notu ekleyen ol.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2 text-xs font-semibold text-white">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] uppercase text-white/80">
          {comments.length}
        </span>
        Yorumlar
      </div>
      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} entry={comment} />
        ))}
      </div>
    </div>
  );
};

export default CardComments;
