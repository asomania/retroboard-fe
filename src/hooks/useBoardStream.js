import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const moveCardInBoard = (board, cardId, fromColumnId, toColumnId) => {
  if (!board || fromColumnId === toColumnId) return board;

  let movedCard = null;
  const columns = board.columns.map((column) => {
    if (column.id === fromColumnId) {
      const remainingCards = (column.cards || []).filter((card) => {
        if (card.id === cardId) {
          movedCard = card;
          return false;
        }
        return true;
      });
      return { ...column, cards: remainingCards };
    }
    return column;
  });

  if (!movedCard) return board;

  return {
    ...board,
    columns: columns.map((column) =>
      column.id === toColumnId
        ? { ...column, cards: [...(column.cards || []), movedCard] }
        : column
    ),
  };
};

const addCardToBoard = (board, columnId, card) => {
  if (!board) return board;
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: [...(column.cards || []), card] }
        : column
    ),
  };
};

const updateCardInBoard = (board, columnId, cardId, updater) => {
  if (!board) return board;
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            cards: (column.cards || []).map((card) =>
              card.id === cardId ? updater(card) : card
            ),
          }
        : column
    ),
  };
};

const removeCardFromBoard = (board, columnId, cardId) => {
  if (!board) return board;
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            cards: (column.cards || []).filter((card) => card.id !== cardId),
          }
        : column
    ),
  };
};

const updateCardVotesInBoard = (board, cardId, votes) => {
  if (!board) return board;

  let updated = false;
  const columns = board.columns.map((column) => {
    const cards = (column.cards || []).map((card) => {
      if (card.id !== cardId) return card;
      updated = true;
      return { ...card, votes };
    });
    return { ...column, cards };
  });

  return updated ? { ...board, columns } : board;
};

const addCommentToBoard = (board, columnId, cardId, comment) => {
  return updateCardInBoard(board, columnId, cardId, (card) => ({
    ...card,
    comments: [...(card.comments || []), comment],
  }));
};

const removeCommentFromBoard = (board, columnId, cardId, commentId) => {
  return updateCardInBoard(board, columnId, cardId, (card) => ({
    ...card,
    comments: (card.comments || []).filter((comment) => comment.id !== commentId),
  }));
};

const parseEventData = (event) => {
  if (!event?.data) return null;
  try {
    return JSON.parse(event.data);
  } catch (error) {
    console.error("Failed to parse SSE event", error);
    return null;
  }
};

/**
 * @param {string} boardId
 */
const useBoardStream = (boardId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return undefined;

    const source = new EventSource(`/api/boards/${boardId}/stream`);

    const applyEvent = (type, handler) => {
      source.addEventListener(type, (event) => {
        const payload = parseEventData(event);
        if (!payload) return;
        const data = payload.data ?? payload;
        handler(data);
      });
    };

    applyEvent("card.created", (data) => {
      const { cardId, columnId, text, votes } = data || {};
      if (!cardId || !columnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        addCardToBoard(current, columnId, {
          id: cardId,
          text,
          votes: typeof votes === "number" ? votes : 0,
          comments: [],
        })
      );
    });

    applyEvent("card.updated", (data) => {
      const { cardId, columnId, text, votes } = data || {};
      if (!cardId || !columnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        updateCardInBoard(current, columnId, cardId, (card) => ({
          ...card,
          ...(text !== undefined ? { text } : {}),
          ...(typeof votes === "number" ? { votes } : {}),
        }))
      );
    });

    source.addEventListener("card.moved", (event) => {
      const payload = parseEventData(event);
      const { cardId, fromColumnId, toColumnId } = payload?.data ?? {};
      if (!cardId || !fromColumnId || !toColumnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        moveCardInBoard(current, cardId, fromColumnId, toColumnId)
      );
    });

    applyEvent("card.liked", (data) => {
      const { cardId, votes } = data || {};
      if (!cardId || typeof votes !== "number") return;
      queryClient.setQueryData(["board", boardId], (current) =>
        updateCardVotesInBoard(current, cardId, votes)
      );
    });

    applyEvent("card.deleted", (data) => {
      const { cardId, columnId } = data || {};
      if (!cardId || !columnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        removeCardFromBoard(current, columnId, cardId)
      );
    });

    applyEvent("comment.created", (data) => {
      const { commentId, cardId, columnId, author, text, createdAt } =
        data || {};
      if (!commentId || !cardId || !columnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        addCommentToBoard(current, columnId, cardId, {
          id: commentId,
          author,
          text,
          createdAt,
        })
      );
    });

    applyEvent("comment.deleted", (data) => {
      const { commentId, cardId, columnId } = data || {};
      if (!commentId || !cardId || !columnId) return;
      queryClient.setQueryData(["board", boardId], (current) =>
        removeCommentFromBoard(current, columnId, cardId, commentId)
      );
    });

    source.onerror = (error) => {
      console.error("SSE connection error", error);
    };

    return () => {
      source.close();
    };
  }, [boardId, queryClient]);
};

export { useBoardStream };
