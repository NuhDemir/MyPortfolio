import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeSnippet.css";

const CodeSnippet = ({ language = "js", fileName = "highlight", code }) => {
  if (!code) return null;

  return (
    <div className="code-snip" aria-label="Kod parcasi">
      <div className="code-snip__head">
        <span className="code-snip__file">{fileName}</span>
        <span className="code-snip__lang">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "0.9rem",
          background: "transparent",
          fontSize: "0.92rem",
          lineHeight: 1.6,
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
