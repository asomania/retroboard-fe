import { useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import BoardHeader from "../components/board/BoardHeader.jsx";
import BoardColumn from "../components/board/BoardColumn.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import BoardRawData from "../components/board/BoardRawData.jsx";
import AddCardModal from "../components/modals/AddCardModal.jsx";
import { useDeleteCard } from "../api/queries/cards.js";
import { useBoard } from "../hooks/useBoard.js";
import { useBoardMutations } from "../hooks/useBoardMutations.js";
import { useDraftState } from "../hooks/useDraftState.js";
import { useBoardStream } from "../hooks/useBoardStream.js";
import { useToggle } from "../hooks/useToggle.js";
import { buildColumns } from "../utils/boardHelpers.js";
import { createClientId } from "../utils/ids.js";
import UserSignModal from "../components/modals/UserSignModal.jsx";
/**
 * Board detail page composition.
 * @returns {JSX.Element}
 */
const BoardDetailPage = () => {
  const { boardID } = useParams({ from: "/board/$boardID" });
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const [dropColumnId, setDropColumnId] = useState(null);
  const addCardModal = useToggle(false);
  const {
    value: isUserSignOpen,
    open: openUserSignModal,
    close: closeUserSignModal,
  } = useToggle(false);
  const { data, error, isLoading } = useBoard(boardID);
  const { deleteCard } = useDeleteCard(boardID);
  const {
    createCard,
    createComment,
    likeCard,
    moveCard,
    isCreatingCard,
    isCreatingComment,
    isLikingCard,
    isMovingCard,
  } = useBoardMutations(boardID);
  const { getDraft, setDraft, clearDraft } = useDraftState();
  useBoardStream(boardID);

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
    const author = localStorage.getItem("user")?.trim() || "Sen";
    const payload = {
      id: createClientId("comment"),
      author,
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

  const handleLikeCard = async (
    columnId,
    cardId,
    currentVotes,
    currentText,
  ) => {
    if (!data) return;
    const nextVotes = typeof currentVotes === "number" ? currentVotes + 1 : 1;
    try {
      await likeCard(columnId, cardId, { text: currentText, votes: nextVotes });
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
  const handleDeleteCard = async (columnId, cardId) => {
    if (!data) return;
    await deleteCard(columnId, cardId);
    if (columnId === activeColumnId) {
      setActiveColumnId(null);
    }
  };

  const handleCardDragStart = (event, fromColumnId, item) => {
    event.dataTransfer.effectAllowed = "move";
    setDraggingCard({ fromColumnId, item });
  };

  const handleColumnDragOver = (event, columnId) => {
    if (!draggingCard) return;
    event.preventDefault();
    if (dropColumnId !== columnId) {
      setDropColumnId(columnId);
    }
  };

  const handleColumnDrop = async (event, toColumnId) => {
    event.preventDefault();
    if (!draggingCard) return;
    const { fromColumnId, item } = draggingCard;

    setDropColumnId(null);
    setDraggingCard(null);

    if (fromColumnId === toColumnId) return;

    try {
      await moveCard(fromColumnId, toColumnId, item);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleCardDragEnd = () => {
    setDropColumnId(null);
    setDraggingCard(null);
  };

  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      openUserSignModal();
    }
  }, [openUserSignModal]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <UserSignModal
        isOpen={isUserSignOpen}
        onClose={closeUserSignModal}
      />

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        <BoardHeader
          boardID={boardID}
          boardName={data?.name}
          isLoading={isLoading}
          error={error}
          hasData={Boolean(data)}
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onOpenAddCard={() => openAddCardModal(column.id)}
              isAddDisabled={!data || isCreatingCard}
              onCardDragOver={(event) => handleColumnDragOver(event, column.id)}
              onCardDrop={(event) => handleColumnDrop(event, column.id)}
              isDropActive={
                Boolean(draggingCard) &&
                dropColumnId === column.id &&
                draggingCard?.fromColumnId !== column.id
              }
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
                  onDelete={() => handleDeleteCard(column.id, item.id)}
                  isDraggable={Boolean(data) && !isMovingCard}
                  onDragStart={(event) =>
                    handleCardDragStart(event, column.id, item)
                  }
                  onDragEnd={handleCardDragEnd}
                  isDragging={draggingCard?.item?.id === item.id}
                  onLike={
                    !data || isLikingCard
                      ? undefined
                      : () =>
                          handleLikeCard(
                            column.id,
                            item.id,
                            item.votes,
                            item.text,
                          )
                  }
                />
              ))}
            </BoardColumn>
          ))}
        </section>

        <BoardRawData data={data} />
      </main>

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
