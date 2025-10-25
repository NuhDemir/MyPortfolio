import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const defaultSanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "pre",
    "code",
    "blockquote",
    "a",
    "p",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "br",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    pre: ["class"],
    code: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowVulnerableTags: false,
};

export const convertMarkdownToHtml = (markdownContent, options = {}) => {
  if (!markdownContent) {
    return "";
  }

  const html = marked(markdownContent, { mangle: false, headerIds: false });
  return sanitizeHtml(html, { ...defaultSanitizeOptions, ...options });
};

export default convertMarkdownToHtml;
