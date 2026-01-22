/**
 * @param {object} props
 * @param {string} props.message
 * @returns {JSX.Element}
 */
const LoadingState = ({ message }) => {
  return <span className="text-emerald-300">{message}</span>;
};

export default LoadingState;
