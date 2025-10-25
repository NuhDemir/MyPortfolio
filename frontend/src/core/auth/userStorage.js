const STORAGE_KEY = "userInfo";

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const readStoredUser = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Stored user verisi okunamadı:", error);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const writeStoredUser = (user) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Stored user verisi kaydedilemedi:", error);
  }
};

export const clearStoredUser = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const hasStoredToken = () => {
  const user = readStoredUser();
  return Boolean(user?.token);
};
