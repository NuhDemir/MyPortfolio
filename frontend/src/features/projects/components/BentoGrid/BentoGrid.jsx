import Reveal from "@shared/ui/Reveal/Reveal.jsx";
import "./BentoGrid.css";

const BentoGrid = ({ project }) => {
  const cs = project?.caseStudy || {};
  const problem = cs?.problem?.description;
  const solution = cs?.solution?.description;
  const metrics = Array.isArray(cs?.metrics) ? cs.metrics : [];
  const highlights = Array.isArray(cs?.highlights) ? cs.highlights : [];

  return (
    <section className="bentog" aria-label="Case study ogeti">
      <Reveal className="bentog__card" as="article">
        <h2>Problem</h2>
        <p>{problem || "Proje baglami ve cozulen problem hakkinda bilgi."}</p>
      </Reveal>

      <Reveal className="bentog__card" as="article">
        <h2>Cozum</h2>
        <p>{solution || "Uygulanan cozum ve mimari yaklasim."}</p>
      </Reveal>

      <Reveal className="bentog__card bentog__card--metrics" as="article">
        <h2>Istatistik</h2>
        {metrics.length > 0 ? (
          <div className="bentog__metrics">
            {metrics.slice(0, 6).map((m, i) => (
              <div key={i} className="bentog__metric">
                <span className="bentog__metric-label">{m.label}</span>
                <span className="bentog__metric-value">{m.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Henuz metrik eklenmedi.</p>
        )}
      </Reveal>

      <Reveal className="bentog__card bentog__card--highlights" as="article">
        <h2>Highlights</h2>
        <ul className="bentog__list">
          {highlights.length > 0
            ? highlights.slice(0, 6).map((h, i) => <li key={i}>{h}</li>)
            : (
              <>
                <li>Gercek zamanli akis ve state yonetimi</li>
                <li>Olceklenebilir API tasarimi</li>
                <li>Performans ve UX optimizasyonlari</li>
              </>
            )}
        </ul>
      </Reveal>
    </section>
  );
};

export default BentoGrid;
