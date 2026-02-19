import { ChevronDown, ChevronUp, Heart, Trash2 } from "lucide-react";
import CardComments from "./CardComments.jsx";
import QuickCommentForm from "./QuickCommentForm.jsx";
import Badge from "../common/Badge.jsx";
import { useToggle } from "../../hooks/useToggle.js";

/**
 * @param {object} props
 * @param {{ id?: string, text?: string, title?: string, votes?: number, comments?: Array, createdByName?: string, createdByDisplayName?: string }} props.item
 * @param {string} props.commentDraft
 * @param {(value: string) => void} props.onCommentDraftChange
 * @param {() => void} props.onAddComment
 * @param {boolean} props.disableAdd
 * @param {boolean} [props.showCreatorName]
 * @param {() => void} [props.onLike]
 * @param {() => void} [props.onDelete]
 * @param {boolean} [props.isDraggable]
 * @param {(event: React.DragEvent<HTMLElement>) => void} [props.onDragStart]
 * @param {(event: React.DragEvent<HTMLElement>) => void} [props.onDragEnd]
 * @param {boolean} [props.isDragging]
 * @returns {JSX.Element}
 */
const BoardCard = ({
  item,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  disableAdd,
  onLike,
  onDelete,
  showCreatorName = true,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  isDragging = false,
}) => {
  const comments = Array.isArray(item.comments) ? item.comments : [];
  const creatorName = item.createdByName || item.createdByDisplayName || "";
  const { value: isCommentsOpen, toggle: toggleComments } = useToggle(false);

  const handleSubmitComment = async () => {
    if (disableAdd) return;
    await onAddComment();
  };

  return (
    <article
      className={`group relative space-y-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] hover:border-white/20 hover:bg-white/15 ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <p className="text-base font-medium leading-relaxed">
        {item.text || item.title || "Kart"}
      </p>
      {showCreatorName && creatorName && (
        <p className="text-xs text-white/60">Oluşturan: {creatorName}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-2 transition hover:text-white"
          aria-expanded={isCommentsOpen}
          aria-label={isCommentsOpen ? "Yorumlari gizle" : "Yorumlari goster"}
        >
          {comments.length} yorum
          {isCommentsOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        <IconButton icon={Trash2} onClick={onDelete} disabled={!onDelete} />
        <IconButton
          label="Beğen"
          icon={Heart}
          onClick={onLike}
          disabled={!onLike}
          showLabel={false}
          value={item.votes}
        />
      </div>

      {isCommentsOpen && (
        <>
          <QuickCommentForm
            value={commentDraft}
            onChange={onCommentDraftChange}
            onSubmit={handleSubmitComment}
            disabled={!commentDraft?.trim() || disableAdd}
          />
          <CardComments comments={comments} />
        </>
      )}
    </article>
  );
};

const IconButton = ({
  label,
  icon: Icon,
  onClick,
  disabled,
  showLabel = true,
  value,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Icon className="h-3.5 w-3.5" />
    {value !== undefined && value !== null && (
      <span className="font-medium text-white">{value}</span>
    )}
    {showLabel && label}
  </button>
);

export default BoardCard;
