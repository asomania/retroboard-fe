import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/domain/cards";
import { createComment } from "../api/domain/comments";

const addCardToBoard = (board, columnId, card) => {
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

/**
 * @param {string} boardId
 * @returns {{
 *   createCard: (columnId: string, payload: any) => Promise<any>,
 *   createComment: (columnId: string, cardId: string, payload: any) => Promise<any>,
 *   isCreatingCard: boolean,
 *   isCreatingComment: boolean
 * }}
 */
const useBoardMutations = (boardId) => {
  const queryClient = useQueryClient();
  const boardKey = ["board", boardId];

  const createCardMutation = useMutation({
    mutationFn: ({ columnId, payload }) =>
      createCard(boardId, columnId, payload),
    onMutate: async ({ columnId, payload }) => {
      await queryClient.cancelQueries({ queryKey: boardKey });
      const previous = queryClient.getQueryData(boardKey);
      const optimisticCard = {
        ...payload,
        comments: payload.comments || [],
      };
      queryClient.setQueryData(boardKey, (current) =>
        current ? addCardToBoard(current, columnId, optimisticCard) : current
      );
      return { previous };
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(boardKey, context.previous);
      }
      console.error(mutationError);
    },
    onSuccess: (created, { columnId, payload }) => {
      if (!created) return;
      queryClient.setQueryData(boardKey, (current) => {
        if (!current) return current;
        return updateCardInBoard(current, columnId, payload.id, (card) => ({
          ...card,
          ...created,
          comments: created.comments || card.comments || [],
        }));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKey });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ columnId, cardId, payload }) =>
      createComment(boardId, columnId, cardId, payload),
    onMutate: async ({ columnId, cardId, payload }) => {
      await queryClient.cancelQueries({ queryKey: boardKey });
      const previous = queryClient.getQueryData(boardKey);
      const optimisticComment = { ...payload };
      queryClient.setQueryData(boardKey, (current) =>
        current
          ? updateCardInBoard(current, columnId, cardId, (card) => ({
              ...card,
              comments: [...(card.comments || []), optimisticComment],
            }))
          : current
      );
      return { previous };
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(boardKey, context.previous);
      }
      console.error(mutationError);
    },
    onSuccess: (created, { columnId, cardId, payload }) => {
      if (!created) return;
      queryClient.setQueryData(boardKey, (current) => {
        if (!current) return current;
        return updateCardInBoard(current, columnId, cardId, (card) => ({
          ...card,
          comments: (card.comments || []).map((comment) =>
            comment.id === payload.id ? { ...comment, ...created } : comment
          ),
        }));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKey });
    },
  });

  const createCardRequest = (columnId, payload) =>
    createCardMutation.mutateAsync({ columnId, payload });

  const createCommentRequest = (columnId, cardId, payload) =>
    createCommentMutation.mutateAsync({ columnId, cardId, payload });

  return {
    createCard: createCardRequest,
    createComment: createCommentRequest,
    isCreatingCard: createCardMutation.isPending,
    isCreatingComment: createCommentMutation.isPending,
  };
};

export { useBoardMutations };
