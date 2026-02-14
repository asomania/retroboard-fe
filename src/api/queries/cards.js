import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCard,
  deleteCard as deleteCardApi,
  listCards,
  updateCard,
} from "../domain/cards";

const cardsKey = (boardId, columnId) => [
  "boards",
  boardId,
  "columns",
  columnId,
  "cards",
];

const useCards = (boardId, columnId) =>
  useQuery({
    queryKey: cardsKey(boardId, columnId),
    queryFn: () => listCards(boardId, columnId),
    enabled: Boolean(boardId && columnId),
  });

const useCreateCard = (boardId, columnId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createCard(boardId, columnId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsKey(boardId, columnId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

const useUpdateCard = (boardId, columnId, cardId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateCard(boardId, columnId, cardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsKey(boardId, columnId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

const useDeleteCard = (boardId) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ columnId, cardId }) =>
      deleteCardApi(boardId, columnId, cardId),
    onSuccess: (_deleted, { columnId }) => {
      queryClient.invalidateQueries({ queryKey: cardsKey(boardId, columnId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });

  const deleteCard = (columnId, cardId) =>
    mutation.mutateAsync({ columnId, cardId });

  return { ...mutation, deleteCard };
};

export { useCards, useCreateCard, useUpdateCard, useDeleteCard };
