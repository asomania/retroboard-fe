import { useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import BoardHeader from "../components/board/BoardHeader.jsx";
import BoardColumn from "../components/board/BoardColumn.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import ParticipantsModal from "../components/modals/ParticipantsModal.jsx";
import { useBoard } from "../hooks/useBoard.js";
import { useBoardMutations } from "../hooks/useBoardMutations.js";
import { useDraftState } from "../hooks/useDraftState.js";
import { buildColumns } from "../utils/boardHelpers.js";
import { createClientId } from "../utils/ids.js";

/**
 * Board detail page composition.
 * @returns {JSX.Element}
 */
const BoardDetailPage = () => {
  const { boardID } = useParams({ from: "/board/$boardID" });
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const { data, error, isLoading } = useBoard(boardID);
  const { createCard, createComment, isCreatingCard, isCreatingComment } =
    useBoardMutations(boardID);
  const { getDraft, setDraft, clearDraft } = useDraftState();

  const columns = useMemo(() => buildColumns(data), [data]);

  const handleAddCard = async (columnId) => {
    const text = getDraft("card", columnId).trim();
    if (!text || !data) return;
    const payload = {
      id: createClientId("card"),
      text,
      votes: 0,
    };
    try {
      await createCard(columnId, payload);
      clearDraft("card", columnId);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleAddComment = async (columnId, cardId) => {
    const text = getDraft("comment", cardId).trim();
    if (!text || !data) return;
    const payload = {
      id: createClientId("comment"),
      author: "Sen",
      text,
      createdAt: new Date().toISOString(),
    };
    try {
      await createComment(columnId, cardId, payload);
      clearDraft("comment", cardId);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        <BoardHeader
          boardID={boardID}
          isLoading={isLoading}
          error={error}
          hasData={Boolean(data)}
          participantsCount={data?.participants?.length ?? 0}
          onOpenParticipants={() => setIsParticipantsOpen(true)}
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cardDraft={getDraft("card", column.id)}
              onCardDraftChange={(value) =>
                setDraft("card", column.id, value)
              }
              onAddCard={() => handleAddCard(column.id)}
              disableAdd={!data || isCreatingCard}
            >
              {column.items.map((item, idx) => (
                <BoardCard
                  key={item.id || `${column.id}-${idx}`}
                  item={item}
                  commentDraft={getDraft("comment", item.id)}
                  onCommentDraftChange={(value) =>
                    setDraft("comment", item.id, value)
                  }
                  onAddComment={() => handleAddComment(column.id, item.id)}
                  disableAdd={!data || isCreatingComment}
                />
              ))}
            </BoardColumn>
          ))}
        </section>

        {data && (
          <section className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Ham veri
            </p>
            <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100/90">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>
        )}
      </main>

      <ParticipantsModal
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        boardName={data?.name}
        boardID={boardID}
        participants={data?.participants ?? []}
      />
    </div>
  );
};

export default BoardDetailPage;
