import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import "./style/CodeViewer.css";

const CodeViewer = ({ project }) => {
  if (!project) return null;

  return (
    <motion.div
      key={project.id}
      className="code-viewer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="code-viewer-header">
        <span>{project.fileName || "Örnek Kod"}</span>
      </div>
      <SyntaxHighlighter
        language={project.language || "javascript"}
        style={vscDarkPlus}
        showLineNumbers
      >
        {project.codeSnippet}
      </SyntaxHighlighter>
    </motion.div>
  );
};

export default CodeViewer;
