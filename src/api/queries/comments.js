import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, listComments } from "../domain/comments";

const commentsKey = (boardId, columnId, cardId) => [
  "boards",
  boardId,
  "columns",
  columnId,
  "cards",
  cardId,
  "comments",
];

const useComments = (boardId, columnId, cardId) =>
  useQuery({
    queryKey: commentsKey(boardId, columnId, cardId),
    queryFn: () => listComments(boardId, columnId, cardId),
    enabled: Boolean(boardId && columnId && cardId),
  });

const useCreateComment = (boardId, columnId, cardId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createComment(boardId, columnId, cardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsKey(boardId, columnId, cardId),
      });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

const useDeleteComment = (boardId, columnId, cardId, commentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(boardId, columnId, cardId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsKey(boardId, columnId, cardId),
      });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

export { useComments, useCreateComment, useDeleteComment };
