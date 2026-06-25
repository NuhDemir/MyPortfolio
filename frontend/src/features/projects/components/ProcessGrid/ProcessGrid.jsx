import Reveal from "@shared/ui/Reveal/Reveal.jsx";
import BeforeAfterSlider from "@shared/ui/BeforeAfterSlider/BeforeAfterSlider.jsx";
import "./ProcessGrid.css";

const ProcessGrid = ({ project, onLightbox }) => {
  const visuals = project?.visuals || {};
  const cs = project?.caseStudy || {};
  const beforeSrc = visuals.beforeImageUrl || cs.beforeImageUrl || "";
  const afterSrc = visuals.afterImageUrl || cs.afterImageUrl || "";
  const archUrl = visuals.architectureDiagramUrl || cs.architectureDiagramUrl || "";
  const wireUrl = visuals.wireframeUrl || cs.wireframeUrl || "";
  const title = project?.title || "";

  return (
    <section className="procg" aria-label="Surec ve kanit">
      <Reveal className="procg__head" as="header">
        <h2>Process</h2>
        <p>Sadece sonuc degil, nasil dusundugunu goster.</p>
      </Reveal>

      <div className="procg__grid">
        <Reveal className="procg__card" as="article">
          <h3>Before / After</h3>
          {beforeSrc && afterSrc ? (
            <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} />
          ) : (
            <p className="procg__empty">Gorsel eklenince slider aktif olur.</p>
          )}
        </Reveal>

        <Reveal className="procg__card" as="article">
          <h3>Architecture Diagram</h3>
          {archUrl ? (
            <button type="button" className="procg__media-btn" onClick={() => onLightbox({ url: archUrl, alt: `${title} mimari diyagram` })}>
              <img src={archUrl} alt={`${title} mimari`} loading="lazy" />
              <span className="procg__media-label">Full-screen incele</span>
            </button>
          ) : (
            <p className="procg__empty">Mimari diyagram eklenince gorunur.</p>
          )}
        </Reveal>

        <Reveal className="procg__card" as="article">
          <h3>User Flow / Wireframe</h3>
          {wireUrl ? (
            <button type="button" className="procg__media-btn" onClick={() => onLightbox({ url: wireUrl, alt: `${title} wireframe` })}>
              <img src={wireUrl} alt={`${title} wireframe`} loading="lazy" />
              <span className="procg__media-label">Full-screen incele</span>
            </button>
          ) : (
            <p className="procg__empty">Wireframe eklenince gorunur.</p>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default ProcessGrid;
