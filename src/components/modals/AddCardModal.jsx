import { Check, Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import Modal from "../../Modal.jsx";

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {string | null} props.columnId
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {(columnId: string) => void} props.onAdd
 * @param {() => void} props.onClose
 * @param {boolean} props.isSubmitting
 * @returns {JSX.Element | null}
 */
const AddCardModal = ({
  isOpen,
  columnId,
  value,
  onChange,
  onAdd,
  onClose,
  isSubmitting,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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

  if (!isOpen || !columnId) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(columnId);
  };

  return (
    <Modal>
      <div
        className="w-[480px] max-w-full rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        role="dialog"
        aria-modal="true"
        aria-label="Kart ekleme"
      >
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs uppercase text-white/70">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                Kart ekle
              </p>
              <p className="text-lg font-semibold text-white">
                Yeni kart oluştur
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 p-2 text-white/80 transition hover:bg-white/15"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-white/70">
            Kart metni
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Başlık ya da not yaz"
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
            />
          </label>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
            >
              <X className="h-3 w-3" />
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!value.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
            >
              {isSubmitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCardModal;
