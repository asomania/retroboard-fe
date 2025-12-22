import http from "http";
import { mockBoards } from "./mockBoards.js";

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  const url = req.url;

  if (url === "/boards") {
    return res.end(JSON.stringify(mockBoards));
  }

  if (url.startsWith("/boards/")) {
    const id = url.split("/")[2];

    const board = mockBoards.find((item) => item.id === id);
    return res.end(JSON.stringify(board));
  }
});

server.listen(3000);
