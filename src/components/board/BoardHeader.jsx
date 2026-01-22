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
        >
          <UserIcon />
          Katılımcılar
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">
            {participantsCount}
          </span>
        </button>
      </div>
    </header>
  );
};

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
    />
    <circle cx="9" cy="7" r="4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 12a3 3 0 1 0-2.988-2.7"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 21v-2a4 4 0 0 0-3-3.87"
    />
  </svg>
);

export default BoardHeader;
