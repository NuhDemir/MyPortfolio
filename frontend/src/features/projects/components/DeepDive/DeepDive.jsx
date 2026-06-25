import Reveal from "@shared/ui/Reveal/Reveal.jsx";
import CodeSnippet from "@shared/ui/CodeSnippet/CodeSnippet.jsx";
import "./DeepDive.css";

const DeepDive = ({ project }) => {
  const cs = project?.caseStudy || {};
  const challenges = Array.isArray(cs?.challenges) ? cs.challenges : [];
  const code = cs?.highlightCode || {};

  return (
    <section className="ddive" aria-label="Teknik detay">
      <Reveal className="ddive__head" as="header">
        <h2>Deep Dive</h2>
        <p>Teknik detaylar ve cozulen zorluklar.</p>
      </Reveal>

      <div className="ddive__grid">
        <Reveal className="ddive__card" as="article">
          <h3>Challenge</h3>
          {challenges.length > 0 ? (
            <ul className="ddive__list">
              {challenges.slice(0, 4).map((c, i) => (
                <li key={i}>
                  <strong>{c.title}</strong>
                  {c.description && <span> — {c.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ddive__empty">Challenge henuz eklenmemis.</p>
          )}
        </Reveal>

        <Reveal className="ddive__card ddive__card--wide" as="article">
          <h3>Code Snippet</h3>
          <CodeSnippet
            language={code.language || "js"}
            fileName={code.fileName || "highlight"}
            code={code.codeSnippet || ""}
          />
          {!code.codeSnippet && (
            <p className="ddive__empty">Kod parcasi eklenince burada gorunur.</p>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default DeepDive;
