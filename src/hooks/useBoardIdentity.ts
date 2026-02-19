import { useCallback, useState } from "react";
import {
  getBoardDisplayName,
  getClientUserId,
  getOrCreateClientUserId,
  setBoardDisplayName,
} from "../utils/clientIdentity";

type SaveIdentityResult = {
  clientUserId: string;
  displayName: string;
};

const useBoardIdentity = (boardId: string) => {
  const [clientUserId, setClientUserId] = useState<string | null>(() =>
    getClientUserId(),
  );
  const [displayName, setDisplayNameState] = useState<string>(() =>
    getBoardDisplayName(boardId),
  );

  const refreshIdentity = useCallback(() => {
    setClientUserId(getClientUserId());
    setDisplayNameState(getBoardDisplayName(boardId));
  }, [boardId]);

  const saveIdentity = useCallback(
    (name: string): SaveIdentityResult | null => {
      const trimmed = name.trim();
      if (!trimmed || !boardId) return null;

      const id = getOrCreateClientUserId();
      const savedName = setBoardDisplayName(boardId, trimmed);
      if (!savedName) return null;

      setClientUserId(id);
      setDisplayNameState(savedName);

      return { clientUserId: id, displayName: savedName };
    },
    [boardId],
  );

  return {
    clientUserId,
    displayName,
    refreshIdentity,
    saveIdentity,
  };
};

export { useBoardIdentity };
