import { Dispatch, SetStateAction, useState } from "react";

export type UseLocalStorage<T> = [T, Dispatch<SetStateAction<T>>];

export default function useLocalStorage<T>(
  key: string,
  initialValue: SetStateAction<T>
): UseLocalStorage<T> {
  const saveToLocalStorage = (valueToStore: T) => {
    try {
      if (typeof valueToStore === "string") {
        localStorage.setItem(key, valueToStore);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      console.warn(`Could not save ${key} to localStorage`);
    }
  };

  const getValue = (value: T, initOrCb: SetStateAction<T>): T => {
    if (initOrCb instanceof Function) {
      const newValue = initOrCb(value);
      saveToLocalStorage(newValue);
      return newValue;
    }

    return value ?? initOrCb;
  };

  const setValue = (value: SetStateAction<T>) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    saveToLocalStorage(valueToStore);
  };

  const [storedValue, setStoredValue] = useState<T>(() => {
    let result: T | null;
    const item = localStorage.getItem(key);

    if (item === null) {
      return getValue(null, initialValue);
    }

    try {
      const parsed = JSON.parse(item);
      if (!parsed) {
        throw new Error("Empty value");
      }

      result = parsed;
    } catch {
      result = item as unknown as T;
    }

    return getValue(result, initialValue);
  });

  return [storedValue, setValue];
}
