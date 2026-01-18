import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumn,
  deleteColumn,
  listColumns,
  updateColumn,
} from "../domain/columns";

const columnsKey = (boardId) => ["boards", boardId, "columns"];

const useColumns = (boardId) =>
  useQuery({
    queryKey: columnsKey(boardId),
    queryFn: () => listColumns(boardId),
    enabled: Boolean(boardId),
  });

const useCreateColumn = (boardId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createColumn(boardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnsKey(boardId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

const useUpdateColumn = (boardId, columnId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateColumn(boardId, columnId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnsKey(boardId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

const useDeleteColumn = (boardId, columnId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteColumn(boardId, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnsKey(boardId) });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

export { useColumns, useCreateColumn, useUpdateColumn, useDeleteColumn };
