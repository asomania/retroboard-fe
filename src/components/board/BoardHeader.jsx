import { useState } from "react";
import LoadingState from "../common/LoadingState.jsx";
import ErrorState from "../common/ErrorState.jsx";

/**
 * @param {object} props
 * @param {string} props.boardID
 * @param {string | undefined} props.boardName
 * @param {boolean} props.isLoading
 * @param {Error | null} props.error
 * @param {boolean} props.hasData
 * @returns {JSX.Element}
 */
const BoardHeader = ({ boardID, boardName, isLoading, error, hasData }) => {
  const [copyState, setCopyState] = useState("idle");

  const handleCopyBoardId = async () => {
    try {
      await navigator.clipboard.writeText(boardID);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1200);
    } catch (copyError) {
      console.error(copyError);
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 1200);
    }
  };

  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          Board
        </p>
        <p className="text-2xl font-bold text-white">{boardName || "Untitled"}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-white/70">#{boardID}</p>
          <button
            type="button"
            onClick={handleCopyBoardId}
            title={copyState === "copied" ? "Kopyalandi" : "Board ID kopyala"}
            aria-label={copyState === "copied" ? "Kopyalandi" : "Board ID kopyala"}
            className="rounded-md border border-white/15 bg-white/10 p-1.5 text-white transition hover:bg-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-white/70">
        {isLoading && <LoadingState message="Yükleniyor…" />}
        {error && <ErrorState message={error.message} />}
        {hasData && !isLoading && !error && (
          <button className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
            Board hazır
          </button>
        )}
      </div>
    </header>
  );
};

export default BoardHeader;
