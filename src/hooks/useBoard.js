import { useBoard as useBoardQuery } from "../api/queries/boards";

/**
 * @param {string} boardId
 * @returns {{ data: any, error: Error | null, isLoading: boolean }}
 */
const useBoard = (boardId) => {
  return useBoardQuery(boardId);
};

export { useBoard };
