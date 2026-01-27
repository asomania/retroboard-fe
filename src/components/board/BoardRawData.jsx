/**
 * @param {object} props
 * @param {any} props.data
 * @returns {JSX.Element | null}
 */
const BoardRawData = ({ data }) => {
  if (!data) return null;

  return (
    <section className="mt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">
        Ham veri
      </p>
      <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100/90">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
};

export default BoardRawData;
