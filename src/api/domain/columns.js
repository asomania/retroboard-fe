import { request } from "../client";

const listColumns = (boardId) =>
  request(`/columns?${new URLSearchParams({ boardId })}`);
const createColumn = (boardId, payload) =>
  request("/columns", {
    method: "POST",
    body: JSON.stringify({ ...payload, boardId }),
  });
const updateColumn = (boardId, columnId, payload) =>
  request(`/columns/${columnId}`, {
    method: "PUT",
    body: JSON.stringify({ ...payload, boardId }),
  });
const deleteColumn = (boardId, columnId) =>
  request(`/columns/${columnId}?${new URLSearchParams({ boardId })}`, {
    method: "DELETE",
  });

export { listColumns, createColumn, updateColumn, deleteColumn };
