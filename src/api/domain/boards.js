import { request } from "../client";

const listBoards = () => request("/boards");
const getBoard = (id) => request(`/boards/${id}`);
const createBoard = (payload) =>
  request("/boards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
const updateBoard = (id, payload) =>
  request(`/boards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
const deleteBoard = (id) =>
  request(`/boards/${id}`, {
    method: "DELETE",
  });

export { listBoards, getBoard, createBoard, updateBoard, deleteBoard };
