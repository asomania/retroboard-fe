import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  MessageCircle,
  MessageSquare,
  Trash2,
} from "lucide-react";
import CardComments from "./CardComments.jsx";
import QuickCommentForm from "./QuickCommentForm.jsx";
import Badge from "../common/Badge.jsx";
import { useToggle } from "../../hooks/useToggle.js";

/**
 * @param {object} props
 * @param {{ id?: string, text?: string, title?: string, votes?: number, comments?: Array }} props.item
 * @param {string} props.commentDraft
 * @param {(value: string) => void} props.onCommentDraftChange
 * @param {() => void} props.onAddComment
 * @param {boolean} props.disableAdd
 * @param {() => void} [props.onView]
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 * @returns {JSX.Element}
 */
const BoardCard = ({
  item,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  disableAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  const comments = Array.isArray(item.comments) ? item.comments : [];
  const {
    value: isCommentsOpen,
    toggle: toggleComments,
  } = useToggle(false);
  const {
    value: isQuickCommentOpen,
    toggle: toggleQuickComment,
    close: closeQuickComment,
  } = useToggle(false);

  const handleSubmitComment = async () => {
    if (disableAdd) return;
    await onAddComment();
    closeQuickComment();
  };

  return (
    <article className="group relative space-y-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] hover:border-white/20 hover:bg-white/15">
      <p className="text-base font-medium leading-relaxed">
        {item.text || item.title || "Kart"}
      </p>
      {item.votes !== undefined && (
        <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
          <Badge variant="vote">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            {item.votes} oy
          </Badge>
          <Badge variant="comment">
            <MessageSquare className="h-3 w-3" />
            {comments.length}
          </Badge>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-2 transition hover:text-white"
          aria-expanded={isCommentsOpen}
          aria-label={isCommentsOpen ? "Yorumlari gizle" : "Yorumlari goster"}
        >
          <MessageSquare className="h-4 w-4" />
          {comments.length} yorum
          {isCommentsOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleQuickComment}
          className="flex items-center gap-1 transition hover:text-white"
          aria-label="Hizli yorum ekle"
        >
          <MessageCircle className="h-4 w-4" />
          Yorum yap
        </button>
      </div>

      {isCommentsOpen && <CardComments comments={comments} />}

      {isQuickCommentOpen && (
        <QuickCommentForm
          value={commentDraft}
          onChange={onCommentDraftChange}
          onSubmit={handleSubmitComment}
          onCancel={closeQuickComment}
          disabled={!commentDraft?.trim() || disableAdd}
        />
      )}

      <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <IconButton
          label="Detay"
          icon={Eye}
          onClick={onView}
          disabled={!onView}
        />
        <IconButton
          label="Düzenle"
          icon={Edit}
          onClick={onEdit}
          disabled={!onEdit}
        />
        <IconButton
          label="Sil"
          icon={Trash2}
          onClick={onDelete}
          disabled={!onDelete}
        />
      </div>
    </article>
  );
};

const IconButton = ({ label, icon: Icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Icon className="h-4 w-4" />
  </button>
);

export default BoardCard;
