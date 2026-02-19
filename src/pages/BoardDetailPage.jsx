import { useEffect, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import BoardHeader from "../components/board/BoardHeader.jsx";
import BoardColumn from "../components/board/BoardColumn.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import BoardRawData from "../components/board/BoardRawData.jsx";
import AddCardModal from "../components/modals/AddCardModal.jsx";
import UserSignModal from "../components/modals/UserSignModal.jsx";
import { useDeleteCard } from "../api/queries/cards.js";
import { setRequestHandlers } from "../api/client.js";
import { useBoard } from "../hooks/useBoard.js";
import { useBoardIdentity } from "../hooks/useBoardIdentity";
import { useBoardMutations } from "../hooks/useBoardMutations.js";
import { useDraftState } from "../hooks/useDraftState.js";
import { useBoardStream } from "../hooks/useBoardStream.js";
import { useToggle } from "../hooks/useToggle.js";
import { buildColumns } from "../utils/boardHelpers.js";
import { createClientId } from "../utils/ids.js";
import {
  getBoardCardCreatorVisibility,
  isBoardOwner,
  setBoardCardCreatorVisibility,
} from "../utils/clientIdentity";

const OWNER_FORBIDDEN_MESSAGE =
  "Bu board ayarlarını sadece oluşturan kişi değiştirebilir.";
const getLikedCardsStorageKey = (boardID) => `retroboard:liked-cards:${boardID}`;

/**
 * Board detail page composition.
 * @returns {JSX.Element}
 */
const BoardDetailPage = () => {
  const { boardID } = useParams({ from: "/board/$boardID" });
  const queryClient = useQueryClient();
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const [dropColumnId, setDropColumnId] = useState(null);
  const [likedCardIds, setLikedCardIds] = useState(() => new Set());
  const [showCardCreatorName, setShowCardCreatorName] = useState(() =>
    getBoardCardCreatorVisibility(boardID),
  );
  const settingsPanel = useToggle(false);
  const [pageMessage, setPageMessage] = useState("");
  const [forbiddenMessage, setForbiddenMessage] = useState("");
  const addCardModal = useToggle(false);
  const {
    value: isUserSignOpen,
    open: openUserSignModal,
    close: closeUserSignModal,
  } = useToggle(false);
  const { data, error, isLoading } = useBoard(boardID);
  const { deleteCard } = useDeleteCard(boardID);
  const { clientUserId, displayName, saveIdentity } = useBoardIdentity(boardID);
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
  const canManageBoard = useMemo(
    () => isBoardOwner(data, clientUserId),
    [clientUserId, data],
  );

  const handleSaveIdentity = (name) => {
    const result = saveIdentity(name);
    if (!result) return null;

    queryClient.invalidateQueries({ queryKey: ["board", boardID] });
    setPageMessage("");
    setForbiddenMessage("");
    return result;
  };

  const handleAddCard = async (columnId) => {
    const text = getDraft("card", columnId).trim();
    if (!text || !data) return;
    const payload = {
      id: createClientId("card"),
      text,
      votes: 0,
      createdByName: displayName?.trim() || "Sen",
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
    const author = displayName?.trim() || "Sen";
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
    if (!data || !cardId || likedCardIds.has(cardId)) return;
    const nextVotes = typeof currentVotes === "number" ? currentVotes + 1 : 1;
    try {
      await likeCard(columnId, cardId, { text: currentText, votes: nextVotes });
      setLikedCardIds((prev) => {
        if (prev.has(cardId)) return prev;
        const next = new Set(prev);
        next.add(cardId);
        const storageKey = getLikedCardsStorageKey(boardID);
        localStorage.setItem(storageKey, JSON.stringify([...next]));
        return next;
      });
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleCreatorVisibilityToggle = () => {
    const next = !showCardCreatorName;
    setShowCardCreatorName(setBoardCardCreatorVisibility(boardID, next));
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
    setRequestHandlers({
      onUnauthorized: () => {
        setPageMessage("Kullanıcı kimliği eksik. Lütfen tekrar giriş yap.");
        openUserSignModal();
      },
      onForbidden: () => {
        setForbiddenMessage(OWNER_FORBIDDEN_MESSAGE);
      },
    });

    return () => {
      setRequestHandlers({
        onUnauthorized: null,
        onForbidden: null,
      });
    };
  }, [openUserSignModal]);

  useEffect(() => {
    if (!boardID) return;
    if (!clientUserId || !displayName) {
      openUserSignModal();
    }
  }, [boardID, clientUserId, displayName, openUserSignModal]);

  useEffect(() => {
    if (!boardID) return;
    const storageKey = getLikedCardsStorageKey(boardID);
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setLikedCardIds(
        new Set(Array.isArray(parsed) ? parsed.filter(Boolean) : []),
      );
    } catch {
      setLikedCardIds(new Set());
    }
  }, [boardID]);

  useEffect(() => {
    if (!boardID) return;
    setShowCardCreatorName(getBoardCardCreatorVisibility(boardID));
  }, [boardID]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <UserSignModal
        boardId={boardID}
        isOpen={isUserSignOpen}
        onClose={closeUserSignModal}
        onSaveIdentity={handleSaveIdentity}
      />

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        <BoardHeader
          boardID={boardID}
          boardName={data?.name}
          isLoading={isLoading}
          error={error}
          hasData={Boolean(data)}
        />

        {forbiddenMessage && (
          <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {forbiddenMessage}
          </p>
        )}

        {pageMessage && (
          <p className="mt-4 rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            {pageMessage}
          </p>
        )}

        {canManageBoard && data ? (
          <section className="mt-6">
            <button
              type="button"
              onClick={settingsPanel.toggle}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15"
              aria-expanded={settingsPanel.value}
              aria-label="Board ayarlarını aç"
            >
              <Settings className="h-4 w-4" />
              Ayarlar
              {settingsPanel.value ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {settingsPanel.value && (
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <label className="flex items-center gap-3 text-sm text-white/85">
                  <input
                    type="checkbox"
                    checked={showCardCreatorName}
                    onChange={handleCreatorVisibilityToggle}
                  />
                  Kartı oluşturan kişi adını göster
                </label>
              </div>
            )}
          </section>
        ) : null}

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
                  showCreatorName={showCardCreatorName}
                  isDraggable={Boolean(data) && !isMovingCard}
                  onDragStart={(event) =>
                    handleCardDragStart(event, column.id, item)
                  }
                  onDragEnd={handleCardDragEnd}
                  isDragging={draggingCard?.item?.id === item.id}
                  onLike={
                    !data || isLikingCard || !item.id || likedCardIds.has(item.id)
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
