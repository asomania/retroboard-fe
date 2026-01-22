/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} props.onSubmit
 * @param {string} props.placeholder
 * @param {string} props.buttonLabel
 * @param {boolean} [props.disabled]
 * @param {string} [props.inputClassName]
 * @param {string} [props.buttonClassName]
 * @returns {JSX.Element}
 */
const AddItemForm = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  disabled = false,
  inputClassName,
  buttonClassName,
}) => {
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="button"
        onClick={onSubmit}
        className={buttonClassName}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default AddItemForm;
