import { useState, useCallback, useRef, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep a ref to the latest value for the callback
  const storedValueRef = useRef(storedValue);
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    try {
      // Use ref for latest value when using function form
      const valueToStore = value instanceof Function ? value(storedValueRef.current) : value;
      setStoredValue(valueToStore);
      storedValueRef.current = valueToStore;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Clear specific key
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storedValueRef.current = initialValue;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
