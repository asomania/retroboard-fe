import { Loader2 } from "lucide-react";

/**
 * @param {object} props
 * @param {string} props.message
 * @returns {JSX.Element}
 */
const LoadingState = ({ message }) => {
  return (
    <span className="inline-flex items-center gap-2 text-emerald-300">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
    </span>
  );
};

export default LoadingState;
