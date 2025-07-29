import React, { useState, useEffect } from "react";
import useLoadingAnimation from "../../hooks/useLoadingAnimation";
import "./style/SocialLinks.css";

const SocialLinkSplash = ({ show, message = "Yükleniyor..." }) => {
  const splashRef = useLoadingAnimation(show);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    if (show) {
      setTypedMessage(""); // Mesajı sıfırla
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypedMessage((prev) => prev + message.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50); // Daktilo hızı
      return () => clearInterval(typingInterval);
    }
  }, [show, message]);

  if (!show) {
    return null;
  }

  return (
    <div className="splash-overlay-v2" ref={splashRef}>
      <div className="splash-content-v2">
        <div className="splash-terminal-header">
          <span>COMMAND PROMPT</span>
          <div className="splash-terminal-buttons">
            <span /> <span /> <span />
          </div>
        </div>
        <div className="splash-terminal-body">
          <span className="splash-prompt">C:</span>
          <span className="splash-typed-message">{typedMessage}</span>
          <span className="splash-cursor">_</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLinkSplash;
