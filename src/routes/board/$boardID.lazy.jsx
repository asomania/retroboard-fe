import { createLazyFileRoute } from "@tanstack/react-router";
import BoardDetailPage from "../../pages/BoardDetailPage.jsx";

export const Route = createLazyFileRoute("/board/$boardID")({
  component: BoardDetailPage,
});
