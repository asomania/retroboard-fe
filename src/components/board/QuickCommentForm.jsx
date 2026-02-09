import { Send, X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} props.onSubmit
 * @param {() => void} [props.onCancel]
 * @param {boolean} props.disabled
 * @param {boolean} [props.showCancel]
 * @returns {JSX.Element}
 */
const QuickCommentForm = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  disabled,
  showCancel = true,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!onCancel) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="mt-3 rounded-xl border border-white/20 bg-slate-900/60 p-3 text-xs text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm">
      <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-white/75">
        Hızlı yorum
      </label>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Yorum ekle"
        aria-label="Hizli yorum alani"
        className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-emerald-300/70 focus:bg-white/15 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        {showCancel && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10"
          >
            <X className="h-3 w-3" />
            Vazgeç
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
        >
          <Send className="h-3 w-3" />
          Gönder
        </button>
      </div>
    </div>
  );
};

export default QuickCommentForm;
