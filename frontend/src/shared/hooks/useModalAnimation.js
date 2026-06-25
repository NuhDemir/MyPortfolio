import { useEffect, useCallback, useRef } from "react";

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0, 0, 0, 1] } },
};

export const panelSlideDown = {
  hidden: { opacity: 0, y: -80, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.97,
    transition: { duration: 0.25, ease: [0.4, 0, 0, 1] },
  },
};

export const useModalAnimation = (isOpen, onClose) => {
  const panelRef = useRef(null);

  const handleClickOutside = useCallback(
    (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  return { panelRef };
};
