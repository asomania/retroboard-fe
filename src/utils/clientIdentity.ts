const CLIENT_USER_ID_KEY = "retro_user_id";
const LEGACY_USER_KEY = "user";
const PREFERRED_DISPLAY_NAME_KEY = "retro_preferred_display_name";

type BoardLike = {
  createdByUserId?: string | null;
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

const createBoardDisplayNameKey = (boardId: string): string =>
  `board:${boardId}:display_name`;
const createCardCreatorVisibilityKey = (boardId: string): string =>
  `board:${boardId}:show_card_creator_name`;

const getClientUserId = (): string | null => {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(CLIENT_USER_ID_KEY);
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
};

const getOrCreateClientUserId = (): string => {
  const existing = getClientUserId();
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `retro-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

  const storage = getStorage();
  storage?.setItem(CLIENT_USER_ID_KEY, generated);
  return generated;
};

const getBoardDisplayName = (boardId: string): string => {
  if (!boardId) return "";
  const storage = getStorage();
  if (!storage) return "";

  const scoped = storage.getItem(createBoardDisplayNameKey(boardId))?.trim();
  if (scoped) return scoped;

  const legacy = storage.getItem(LEGACY_USER_KEY)?.trim();
  return legacy || "";
};

const getPreferredDisplayName = (): string => {
  const storage = getStorage();
  if (!storage) return "";

  const preferred = storage.getItem(PREFERRED_DISPLAY_NAME_KEY)?.trim();
  if (preferred) return preferred;

  const legacy = storage.getItem(LEGACY_USER_KEY)?.trim();
  return legacy || "";
};

const setPreferredDisplayName = (name: string): string => {
  const trimmedName = name.trim();
  const storage = getStorage();
  if (!storage) return "";

  if (!trimmedName) {
    storage.removeItem(PREFERRED_DISPLAY_NAME_KEY);
    return "";
  }

  storage.setItem(PREFERRED_DISPLAY_NAME_KEY, trimmedName);
  return trimmedName;
};

const setBoardDisplayName = (boardId: string, name: string): string => {
  if (!boardId) return "";
  const trimmedName = name.trim();
  const storage = getStorage();
  if (!storage || !trimmedName) return "";

  storage.setItem(createBoardDisplayNameKey(boardId), trimmedName);
  storage.setItem(PREFERRED_DISPLAY_NAME_KEY, trimmedName);
  return trimmedName;
};

const getBoardCardCreatorVisibility = (boardId: string): boolean => {
  if (!boardId) return true;
  const storage = getStorage();
  if (!storage) return true;

  const raw = storage.getItem(createCardCreatorVisibilityKey(boardId));
  if (raw === "0") return false;
  return true;
};

const setBoardCardCreatorVisibility = (
  boardId: string,
  visible: boolean,
): boolean => {
  if (!boardId) return visible;
  const storage = getStorage();
  if (!storage) return visible;

  storage.setItem(createCardCreatorVisibilityKey(boardId), visible ? "1" : "0");
  return visible;
};

const isBoardOwner = (
  board: BoardLike | null | undefined,
  clientUserId: string | null | undefined,
): boolean => {
  if (!board?.createdByUserId || !clientUserId) return false;
  return board.createdByUserId === clientUserId;
};

export {
  getClientUserId,
  getOrCreateClientUserId,
  getBoardDisplayName,
  getPreferredDisplayName,
  setPreferredDisplayName,
  setBoardDisplayName,
  getBoardCardCreatorVisibility,
  setBoardCardCreatorVisibility,
  isBoardOwner,
};
