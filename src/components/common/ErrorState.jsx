/**
 * @param {object} props
 * @param {string} props.message
 * @returns {JSX.Element}
 */
const ErrorState = ({ message }) => {
  return (
    <span className="rounded-full border border-red-400/50 bg-red-500/10 px-3 py-1 text-red-200">
      Hata: {message}
    </span>
  );
};

export default ErrorState;
