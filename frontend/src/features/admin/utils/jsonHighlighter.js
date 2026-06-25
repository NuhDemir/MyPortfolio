const TOKEN_PATTERNS = [
  { pattern: /("(?:[^"\\]|\\.)*")\s*:/g, className: "json-key" },
  { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, className: "json-string", replace: ': <span class="json-string">$1</span>' },
  { pattern: /:\s*(-?\d+\.?\d*(?:e[+-]?\d+)?)/gi, className: "json-number", replace: ': <span class="json-number">$1</span>' },
  { pattern: /:\s*(true|false)/gi, className: "json-boolean", replace: ': <span class="json-boolean">$1</span>' },
  { pattern: /:\s*(null)/gi, className: "json-null", replace: ': <span class="json-null">$1</span>' },
];

const htmlEscape = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const highlightJson = (text) => {
  if (!text || typeof text !== "string") return "";

  let escaped = htmlEscape(text);

  escaped = escaped.replace(
    /("(?:[^"\\]|\\.)*")\s*:/g,
    '<span class="json-key">$1</span>:',
  );

  escaped = escaped.replace(
    /:\s*("(?:[^"\\]|\\.)*")/g,
    ': <span class="json-string">$1</span>',
  );

  escaped = escaped.replace(
    /:\s*(-?\d+\.?\d*(?:e[+-]?\d+)?)\b/gi,
    ': <span class="json-number">$1</span>',
  );

  escaped = escaped.replace(
    /:\s*(true|false)\b/gi,
    ': <span class="json-boolean">$1</span>',
  );

  escaped = escaped.replace(
    /:\s*(null)\b/gi,
    ': <span class="json-null">$1</span>',
  );

  escaped = escaped.replace(
    /[{}[\]]/g,
    '<span class="json-bracket">$&</span>',
  );

  return escaped;
};

export const formatJson = (text) => {
  if (!text || typeof text !== "string") return "";
  try {
    return JSON.stringify(JSON.parse(text.trim()), null, 2);
  } catch {
    return text;
  }
};

export const isValidJson = (text) => {
  if (!text || typeof text !== "string" || !text.trim()) return false;
  try {
    JSON.parse(text.trim());
    return true;
  } catch {
    return false;
  }
};
