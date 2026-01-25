const TOAST_EVENT = "admin:toast";

export const showAdminToast = (message, options = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const detail = {
    message: String(message ?? ""),
    type: options.type || "info", // info | success | error
    durationMs:
      typeof options.durationMs === "number" ? options.durationMs : 2600,
  };

  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
};

export const addAdminToastListener = (handler) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const wrapped = (event) => handler?.(event?.detail);
  window.addEventListener(TOAST_EVENT, wrapped);

  return () => window.removeEventListener(TOAST_EVENT, wrapped);
};
