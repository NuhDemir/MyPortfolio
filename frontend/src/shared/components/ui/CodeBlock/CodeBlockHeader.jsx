import React, { useState } from "react";
import { Check, Copy, WrapText } from "lucide-react";

export const CodeBlockHeader = ({ language, fileName, rawCode, wrapLines, onToggleWrap }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="cb-header">
      <div className="cb-header-left">
        <div className="cb-traffic-lights">
          <span className="cb-mac-close"></span>
          <span className="cb-mac-min"></span>
          <span className="cb-mac-max"></span>
        </div>
        {language && <span className="cb-lang-badge">{language}</span>}
        {fileName && <span className="cb-filename">{fileName}</span>}
      </div>
      <div className="cb-header-right">
        <button 
          className="cb-btn" 
          onClick={onToggleWrap} 
          title={wrapLines ? "Kaydırmayı Kapat" : "Satırları Kaydır"}
          style={{ color: wrapLines ? '#10b981' : '#a0a0a0' }}
        >
          <WrapText size={16} />
        </button>
        <button 
          className={`cb-btn ${copied ? "cb-btn--active" : ""}`} 
          onClick={handleCopy}
          title="Kodu Kopyala"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
