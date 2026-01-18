import { request } from "../client";

const listComments = (boardId, columnId, cardId) =>
  request(
    `/comments?${new URLSearchParams({ boardId, columnId, cardId })}`
  );
const createComment = (boardId, columnId, cardId, payload) =>
  request("/comments", {
    method: "POST",
    body: JSON.stringify({ ...payload, boardId, columnId, cardId }),
  });
const deleteComment = (boardId, columnId, cardId, commentId) =>
  request(
    `/comments/${commentId}?${new URLSearchParams({
      boardId,
      columnId,
      cardId,
    })}`,
    {
      method: "DELETE",
    }
  );

export { listComments, createComment, deleteComment };
