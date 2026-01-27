import { Users, X } from "lucide-react";
import { useEffect } from "react";
import Modal from "../../Modal.jsx";

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string | undefined} props.boardName
 * @param {string} props.boardID
 * @param {Array<string>} props.participants
 * @returns {JSX.Element | null}
 */
const ParticipantsModal = ({
  isOpen,
  onClose,
  boardName,
  boardID,
  participants,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Modal>
      <div
        className="w-[420px] max-w-full rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        role="dialog"
        aria-modal="true"
        aria-label="Katilimcilar"
      >
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs uppercase text-white/70">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                Katılımcılar
              </p>
              <p className="text-lg font-semibold text-white">
                {boardName || `Board #${boardID}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 p-2 text-white/80 transition hover:bg-white/15"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="space-y-2">
          {participants.map((person) => (
            <div
              key={person}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-semibold uppercase">
                {person.slice(0, 2)}
              </div>
              <p className="font-medium">{person}</p>
            </div>
          ))}
          {!participants.length && (
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
              Henüz katılımcı yok.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ParticipantsModal;
