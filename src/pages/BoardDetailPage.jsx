import { useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import BoardHeader from "../components/board/BoardHeader.jsx";
import BoardColumn from "../components/board/BoardColumn.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import BoardRawData from "../components/board/BoardRawData.jsx";
import AddCardModal from "../components/modals/AddCardModal.jsx";
import ParticipantsModal from "../components/modals/ParticipantsModal.jsx";
import { useBoard } from "../hooks/useBoard.js";
import { useBoardMutations } from "../hooks/useBoardMutations.js";
import { useDraftState } from "../hooks/useDraftState.js";
import { useToggle } from "../hooks/useToggle.js";
import { buildColumns } from "../utils/boardHelpers.js";
import { createClientId } from "../utils/ids.js";

/**
 * Board detail page composition.
 * @returns {JSX.Element}
 */
const BoardDetailPage = () => {
  const { boardID } = useParams({ from: "/board/$boardID" });
  const [activeColumnId, setActiveColumnId] = useState(null);
  const participantsModal = useToggle(false);
  const addCardModal = useToggle(false);
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
      if (columnId === activeColumnId) {
        addCardModal.close();
        setActiveColumnId(null);
      }
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

  const openAddCardModal = (columnId) => {
    setActiveColumnId(columnId);
    addCardModal.open();
  };

  const closeAddCardModal = () => {
    if (activeColumnId) {
      clearDraft("card", activeColumnId);
    }
    setActiveColumnId(null);
    addCardModal.close();
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
          onOpenParticipants={participantsModal.open}
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onOpenAddCard={() => openAddCardModal(column.id)}
              isAddDisabled={!data || isCreatingCard}
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

        <BoardRawData data={data} />
      </main>

      <ParticipantsModal
        isOpen={participantsModal.value}
        onClose={participantsModal.close}
        boardName={data?.name}
        boardID={boardID}
        participants={data?.participants ?? []}
      />
      <AddCardModal
        isOpen={addCardModal.value}
        columnId={activeColumnId}
        value={activeColumnId ? getDraft("card", activeColumnId) : ""}
        onChange={(value) =>
          activeColumnId && setDraft("card", activeColumnId, value)
        }
        onAdd={handleAddCard}
        onClose={closeAddCardModal}
        isSubmitting={isCreatingCard}
      />
    </div>
  );
};

export default BoardDetailPage;
