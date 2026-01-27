import { Send, X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} props.onSubmit
 * @param {() => void} props.onCancel
 * @param {boolean} props.disabled
 * @returns {JSX.Element}
 */
const QuickCommentForm = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  disabled,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
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
    <div className="absolute left-4 right-4 top-full z-10 mt-3 rounded-xl border border-white/10 bg-slate-950/95 p-3 text-xs text-white shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
      <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-white/60">
        Hızlı yorum
      </label>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Yorum ekle"
        aria-label="Hizli yorum alani"
        className="w-full resize-none rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10"
        >
          <X className="h-3 w-3" />
          Vazgeç
        </button>
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
