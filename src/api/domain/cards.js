import { request } from "../client";

const listCards = (boardId, columnId) =>
  request(`/cards?${new URLSearchParams({ boardId, columnId })}`);
const createCard = (boardId, columnId, payload) =>
  request("/cards", {
    method: "POST",
    body: JSON.stringify({ ...payload, boardId, columnId }),
  });
const updateCard = (boardId, columnId, cardId, payload) =>
  request(`/cards/${cardId}`, {
    method: "PUT",
    body: JSON.stringify({ ...payload, boardId, columnId }),
  });
const deleteCard = (boardId, columnId, cardId) =>
  request(
    `/cards/${cardId}?${new URLSearchParams({ boardId, columnId })}`,
    {
      method: "DELETE",
    }
  );

export { listCards, createCard, updateCard, deleteCard };
