import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCard, deleteCard, listCards, updateCard } from "../domain/cards";

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

const useDeleteCard = (boardId, columnId, cardId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCard(boardId, columnId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsKey(boardId, columnId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

export { useCards, useCreateCard, useUpdateCard, useDeleteCard };
