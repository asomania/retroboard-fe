import { useCallback, useState } from "react";

/**
 * @param {boolean} [initialValue=false]
 * @returns {{
 *   value: boolean,
 *   open: () => void,
 *   close: () => void,
 *   toggle: () => void
 * }}
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const open = useCallback(() => setValue(true), []);
  const close = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return { value, open, close, toggle };
};

export { useToggle };
