import { useCallback, useState } from "react";

/**
 * @returns {{
 *   cardDrafts: Record<string, string>,
 *   commentDrafts: Record<string, string>,
 *   getDraft: (type: "card" | "comment", key: string) => string,
 *   setDraft: (type: "card" | "comment", key: string, value: string) => void,
 *   clearDraft: (type: "card" | "comment", key: string) => void
 * }}
 */
const useDraftState = () => {
  const [cardDrafts, setCardDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const getDraft = useCallback(
    (type, key) => {
      if (type === "card") return cardDrafts[key] ?? "";
      if (type === "comment") return commentDrafts[key] ?? "";
      return "";
    },
    [cardDrafts, commentDrafts]
  );

  const setDraft = useCallback((type, key, value) => {
    if (type === "card") {
      setCardDrafts((prev) => ({ ...prev, [key]: value }));
      return;
    }
    if (type === "comment") {
      setCommentDrafts((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  const clearDraft = useCallback(
    (type, key) => {
      setDraft(type, key, "");
    },
    [setDraft]
  );

  return { cardDrafts, commentDrafts, getDraft, setDraft, clearDraft };
};

export { useDraftState };
