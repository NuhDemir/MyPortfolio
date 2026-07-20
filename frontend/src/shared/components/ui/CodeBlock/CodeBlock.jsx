import React, { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Modal from "../../../ui/Modal.jsx";
import { Expand } from "lucide-react";

import { CodeBlockHeader } from "./CodeBlockHeader.jsx";
import "./CodeBlock.css";

const parseMeta = (meta = "") => {
  const result = {
    highlightLines: [],
    fileName: "",
    isDiff: meta.includes("diff") || meta.includes("diff=true"),
    showLineNumbers: !meta.includes("nolines") // Default show lines
  };
  
  // Extract filename e.g. title="App.jsx" or filename="App.jsx"
  const titleMatch = meta.match(/(?:title|filename)="([^"]+)"/i);
  if (titleMatch) result.fileName = titleMatch[1];
  
  // Extract highlight lines e.g. {1,3-5}
  const linesMatch = meta.match(/\{([\d,-]+)\}/);
  if (linesMatch) {
    const parts = linesMatch[1].split(",");
    parts.forEach(p => {
      if (p.includes("-")) {
        const [start, end] = p.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          if (!isNaN(i)) result.highlightLines.push(i);
        }
      } else {
        const num = Number(p);
        if (!isNaN(num)) result.highlightLines.push(num);
      }
    });
  }
  
  return result;
};

export const CodeBlock = ({ rawCode, language, metaString }) => {
  const [wrapLines, setWrapLines] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { highlightLines, fileName, isDiff, showLineNumbers } = useMemo(() => {
    return parseMeta(metaString);
  }, [metaString]);

  const rawLines = useMemo(() => rawCode.split("\n"), [rawCode]);

  // Auto-detect diff if any line starts with + or - and we are in diff-compatible mode
  const autoDiff = useMemo(() => {
    if (isDiff || language === "diff") return true;
    // Check if at least one line starts with + or - (and has a space or is alone)
    const hasAdd = rawLines.some(l => l.startsWith("+ ") || l === "+");
    const hasSub = rawLines.some(l => l.startsWith("- ") || l === "-");
    return hasAdd || hasSub;
  }, [isDiff, language, rawLines]);

  const isTerminal = ["bash", "shell", "sh", "zsh"].includes(language);

  // Line props for Diff and Highlighting
  const getLineProps = (lineNumber) => {
    let className = "cb-line";
    const lineText = rawLines[lineNumber - 1] || "";

    if (highlightLines.includes(lineNumber)) {
      className += " cb-line--highlighted";
    }

    if (autoDiff) {
      if (lineText.startsWith("+ ") || lineText === "+") {
        className += " cb-line--diff-add";
      } else if (lineText.startsWith("- ") || lineText === "-") {
        className += " cb-line--diff-remove";
      }
    }
    
    return { className };
  };

  const toggleWrap = () => setWrapLines(prev => !prev);

  // Map language to correct syntax highlighter language
  const syntaxLang = autoDiff && language !== "diff" ? "diff" : language || "text";

  return (
    <>
      <div 
        className="cb-text-snippet-wrapper" 
        onClick={() => setIsModalOpen(true)}
      >
        <SyntaxHighlighter
          PreTag="div"
          language={syntaxLang}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: 0, background: "transparent", display: "block" }}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {rawCode}
        </SyntaxHighlighter>
        <div className="cb-snippet-hover-overlay">
          <Expand size={16} /> <span>Kodu İncele</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={fileName ? `Kod Görünümü - ${fileName}` : "Kod Görünümü"}
      >
        <div className={`cb-container cb-container--modal ${isTerminal ? 'cb-terminal' : ''}`}>
          <CodeBlockHeader 
            language={language} 
            fileName={fileName} 
            rawCode={rawCode} 
            wrapLines={wrapLines} 
            onToggleWrap={toggleWrap} 
          />
          <div className="cb-content">
            <SyntaxHighlighter
              language={syntaxLang}
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: 0, background: "transparent" }}
              showLineNumbers={showLineNumbers && !isTerminal}
              wrapLines={true} // Required to apply lineProps
              wrapLongLines={wrapLines}
              lineProps={getLineProps}
              lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", color: "#6e7681", textAlign: "right" }}
            >
              {rawCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CodeBlock;
