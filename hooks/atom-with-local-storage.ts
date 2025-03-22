import { atomWithStorage } from "jotai/utils";

// Re-export atomWithStorage from jotai/utils with a custom name
// This maintains compatibility with existing codebase
export const atomWithLocalStorage = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(key, initialValue, {
    // Use SSR-compatible storage
    getItem: (key, initialValue) => {
      // When running on the server, return initialValue
      if (typeof window === "undefined") {
        return initialValue;
      }
      // When on the client, try to get the value from localStorage
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue === null ? initialValue : JSON.parse(storedValue);
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return initialValue;
      }
    },
    setItem: (key, value) => {
      // Only attempt to use localStorage on the client
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.warn(`Error writing localStorage key "${key}":`, error);
        }
      }
    },
    removeItem: (key) => {
      // Only attempt to use localStorage on the client
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Error removing localStorage key "${key}":`, error);
        }
      }
    },
  });
