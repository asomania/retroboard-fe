import { Users } from "lucide-react";
import LoadingState from "../common/LoadingState.jsx";
import ErrorState from "../common/ErrorState.jsx";

/**
 * @param {object} props
 * @param {string} props.boardID
 * @param {boolean} props.isLoading
 * @param {Error | null} props.error
 * @param {boolean} props.hasData
 * @param {number} props.participantsCount
 * @param {() => void} props.onOpenParticipants
 * @returns {JSX.Element}
 */
const BoardHeader = ({
  boardID,
  isLoading,
  error,
  hasData,
  participantsCount,
  onOpenParticipants,
}) => {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          Board
        </p>
        <p className="text-2xl font-bold text-white">#{boardID}</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-white/70">
        {isLoading && <LoadingState message="Yükleniyor…" />}
        {error && <ErrorState message={error.message} />}
        {hasData && !isLoading && !error && (
          <button className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
            Board hazır
          </button>
        )}
        <button
          onClick={onOpenParticipants}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 hover:text-white"
          aria-label="Katilimcilari goster"
        >
          <Users className="h-4 w-4" />
          Katılımcılar
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">
            {participantsCount}
          </span>
        </button>
      </div>
    </header>
  );
};

export default BoardHeader;
