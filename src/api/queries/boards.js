import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBoard,
  deleteBoard,
  getBoard,
  listBoards,
  updateBoard,
} from "../domain/boards";

const boardsKey = ["boards"];
const boardKey = (id) => ["board", id];

const useBoards = () =>
  useQuery({
    queryKey: boardsKey,
    queryFn: listBoards,
  });

const useBoard = (id) =>
  useQuery({
    queryKey: boardKey(id),
    queryFn: () => getBoard(id),
    enabled: Boolean(id),
  });

const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKey });
    },
  });
};

const useUpdateBoard = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateBoard(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKey(id) });
      queryClient.invalidateQueries({ queryKey: boardsKey });
    },
  });
};

const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKey });
    },
  });
};

export { useBoards, useBoard, useCreateBoard, useUpdateBoard, useDeleteBoard };
