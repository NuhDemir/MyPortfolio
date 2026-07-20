/**
 * BlogContentRenderer
 *
 * Replaces dangerouslySetInnerHTML with ReactMarkdown so that
 * interactive components (Chart, Mermaid, Quiz, CodePlayground, Tabs, Before/After)
 * can be embedded inside blog content via fenced-code-block syntax.
 *
 * Usage patterns in Markdown:
 *
 * ```chart
 * {"type":"bar","title":"Başlık","data":[{"ay":"Oca","satış":120}]}
 * ```
 *
 * ```mermaid
 * graph TD; A-->B; B-->C
 * ```
 *
 * ```quiz
 * {"question":"Soru?","options":["A","B"],"answer":0,"explanation":"Açıklama"}
 * ```
 *
 * ```js:live
 * console.log("Hello World")
 * ```
 *
 * ```tabs
 * {"tabs":[{"label":"JS","language":"js","content":"const x = 1;"},{"label":"Python","language":"py","content":"x = 1"}]}
 * ```
 *
 * ![before-after](https://before.jpg|https://after.jpg)   ← Before/After slider
 */
import React, { lazy, Suspense, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CodeBlock as PremiumCodeBlock } from "../../../../shared/components/ui/CodeBlock/CodeBlock.jsx";

const BlogChart         = lazy(() => import("./BlogChart.jsx"));
const BlogQuiz          = lazy(() => import("../../../../shared/components/ui/Quiz/Quiz.jsx"));
const BlogCodePlayground= lazy(() => import("./BlogCodePlayground.jsx"));
const BlogTabs          = lazy(() => import("./BlogTabs.jsx"));
const BeforeAfterSlider = lazy(() => import("./BeforeAfterSlider.jsx"));

const Fallback = () => (
  <div style={{ padding: "1rem", opacity: 0.4, fontSize: "0.85rem" }}>Yükleniyor...</div>
);

// ── Code block dispatcher ────────────────────────────────────────────────────
const CodeBlock = memo(({ node, inline, className, children, ...props }) => {
  // Safely extract string from children to avoid [object Object]
  const extractText = (child) => {
    if (typeof child === 'string') return child;
    if (typeof child === 'number') return String(child);
    if (Array.isArray(child)) return child.map(extractText).join('');
    if (child && child.props && child.props.children) return extractText(child.props.children);
    return '';
  };
  const raw = extractText(children).replace(/\n$/, "");
  const lang = (className || "").replace("language-", "").toLowerCase().trim();
  const metaString = node?.data?.meta || "";

  // Treat as inline if explicitly inline, OR if it's a very short single-line snippet (<= 3 words)
  const wordCount = raw.trim() ? raw.trim().split(/\s+/).length : 0;
  const isShortSnippet = !raw.includes('\n') && wordCount <= 3;

  if (inline || isShortSnippet) {
    return <code className="blog-inline-code" {...props}>{children}</code>;
  }

  // ── Chart ──────────────────────────────────────────────────────────────
  if (lang === "chart") {
    return (
      <Suspense fallback={<Fallback />}>
        <BlogChart chartData={raw} />
      </Suspense>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────
  if (lang === "quiz") {
    return (
      <Suspense fallback={<Fallback />}>
        <BlogQuiz quizData={raw} />
      </Suspense>
    );
  }

  // ── Tabs ───────────────────────────────────────────────────────────────
  if (lang === "tabs") {
    return (
      <Suspense fallback={<Fallback />}>
        <BlogTabs tabsData={raw} />
      </Suspense>
    );
  }

  // ── Live Playground: js:live | jsx:live | javascript:live ─────────────
  if (lang.endsWith(":live") || lang === "live") {
    const actualLang = lang.replace(":live", "") || "javascript";
    return (
      <Suspense fallback={<Fallback />}>
        <BlogCodePlayground code={raw} language={actualLang} />
      </Suspense>
    );
  }

  // ── Default Premium syntax-highlighted code block ────────────────────────
  return (
    <PremiumCodeBlock 
      rawCode={raw} 
      language={lang} 
      metaString={metaString} 
    />
  );
});

CodeBlock.displayName = "CodeBlock";

// ── Image dispatcher (Before/After) ─────────────────────────────────────────
const BlogImage = memo(({ src, alt, ...props }) => {
  // Before/After syntax: ![before-after](url1|url2)
  if (src && src.includes("|") && alt?.toLowerCase().includes("before-after")) {
    const [beforeSrc, afterSrc] = src.split("|");
    const [beforeLabel, afterLabel] = (alt.replace(/before-after/i, "").trim().split("|").map(s => s.trim()));
    return (
      <Suspense fallback={<Fallback />}>
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeLabel={beforeLabel || "Önce"}
          afterLabel={afterLabel || "Sonra"}
        />
      </Suspense>
    );
  }
  // Normal image
  return <img src={src} alt={alt || ""} className="blog-md-img" loading="lazy" {...props} />;
});

BlogImage.displayName = "BlogImage";

// ── Custom component map ─────────────────────────────────────────────────────
const COMPONENTS = {
  pre: ({ children }) => <>{children}</>,
  code: CodeBlock,
  img: BlogImage,
  // Wrap table in a scroll div for mobile
  table: ({ children, ...props }) => (
    <div className="blog-table-wrap">
      <table className="blog-md-table" {...props}>{children}</table>
    </div>
  ),
  // Open external links in new tab
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
};

// ── Main renderer ────────────────────────────────────────────────────────────
const BlogContentRenderer = memo(({ content }) => {
  if (!content) return null;
  return (
    <div className="blog-detail__content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

BlogContentRenderer.displayName = "BlogContentRenderer";
export default BlogContentRenderer;
