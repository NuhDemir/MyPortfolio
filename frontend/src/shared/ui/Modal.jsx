import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PatternBackground, useModalAnimation } from "@shared";
import { overlayVariants, panelSlideDown } from "@shared/hooks/useModalAnimation";
import "@shared/design-system/components/Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  const { panelRef } = useModalAnimation(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={panelRef}
            className="modal-container"
            variants={panelSlideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PatternBackground variant="naiveSketch" opacity={0.06} />

            <div className="modal-header">
              <h2>{title}</h2>
              <button
                onClick={onClose}
                className="modal-close-button"
                aria-label="Kapat"
              >
                <X size={22} />
              </button>
            </div>

            <div className="modal-content">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
