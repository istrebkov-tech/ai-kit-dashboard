const memoryStorage = new Map<string, string>();

function canUseLocalStorage() {
  if (typeof window === "undefined") return false;

  try {
    const testKey = "__aikit_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function getFallback(key: string) {
  return memoryStorage.has(key) ? memoryStorage.get(key)! : null;
}

export function safeGetItem(key: string) {
  if (!canUseLocalStorage()) return getFallback(key);

  try {
    return window.localStorage.getItem(key);
  } catch {
    return getFallback(key);
  }
}

export function safeSetItem(key: string, value: string) {
  memoryStorage.set(key, value);

  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // no-op fallback for restricted preview/browser environments
  }
}

export function safeRemoveItem(key: string) {
  memoryStorage.delete(key);

  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op fallback for restricted preview/browser environments
  }
}
