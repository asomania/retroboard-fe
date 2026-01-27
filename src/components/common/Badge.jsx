/**
 * @param {object} props
 * @param {"default" | "vote" | "comment"} [props.variant]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const Badge = ({ variant = "default", children }) => {
  const variants = {
    default: "bg-white/10 text-white/70",
    vote: "bg-white/10 text-white/70",
    comment: "bg-white/10 text-white/70",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
