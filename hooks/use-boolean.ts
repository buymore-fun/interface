import { useState, useCallback } from "react";

/**
 * A custom hook that provides boolean state with toggle, on, and off functions.
 *
 * @param initialValue - The initial boolean value (defaults to false)
 * @returns An object containing the boolean value and functions to manipulate it
 */
export function useBoolean(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return {
    value,
    setValue,
    toggle,
    setTrue,
    setFalse,
  };
}

export default useBoolean;
