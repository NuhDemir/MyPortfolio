import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@core";
import { Check, Copy } from "lucide-react";
import "./CodeSnippet.css";

const CodeSnippet = ({ language = "js", fileName = "highlight", code }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(String(code)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [code]);

  if (!code) return null;

  const isDark = theme === "dark";
  const syntaxStyle = isDark ? oneDark : oneLight;

  return (
    <div className="cs" aria-label="Kod parcasi">
      <div className="cs__bar">
        <div className="cs__dots">
          <span className="cs__dot cs__dot--red" />
          <span className="cs__dot cs__dot--yellow" />
          <span className="cs__dot cs__dot--green" />
        </div>
        <span className="cs__file">{fileName}</span>
        <button
          type="button"
          className="cs__copy"
          onClick={handleCopy}
          aria-label={copied ? "Kopyalandi" : "Kodu kopyala"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Kopyalandi" : "Kopyala"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={syntaxStyle}
        customStyle={{
          margin: 0,
          padding: "var(--ds-space-6) var(--ds-space-4)",
          background: "transparent",
          fontSize: "0.82rem",
          lineHeight: 1.7,
          borderRadius: 0,
        }}
        showLineNumbers
        wrapLongLines
      >
        {String(code)}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeSnippet;
