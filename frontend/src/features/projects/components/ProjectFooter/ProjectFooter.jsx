import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Reveal from "@shared/ui/Reveal/Reveal.jsx";
import { getProjectTitle, getProjectTagline, getProjectRouteParam } from "../../utils/projectFormatters.js";
import "./ProjectFooter.css";

const ProjectFooter = ({ project, nextProject, prevProject }) => {
  return (
    <footer className="pfoot">
      <Reveal className="pfoot__cta" as="div">
        <h2>Bu projeyi begendiniz mi?</h2>
        <p>Benzer bir proje icin birlikte calisalim.</p>
        <div className="pfoot__cta-actions">
          <Link to="/" className="pfoot__link pfoot__link--ghost">Ana Sayfa</Link>
          <a href="/#contact-section" className="pfoot__link pfoot__link--primary">Iletisime gec</a>
        </div>
      </Reveal>

      <div className="pfoot__nav">
        {prevProject && (
          <Reveal className="pfoot__nav-item" as="div">
            <Link
              className="pfoot__nav-card"
              to={`/projects/${getProjectRouteParam(prevProject)}`}
            >
              <ArrowLeft size={14} />
              <div>
                <span className="pfoot__nav-label">Previous</span>
                <span className="pfoot__nav-title">{getProjectTitle(prevProject)}</span>
              </div>
            </Link>
          </Reveal>
        )}

        {nextProject && (
          <Reveal className="pfoot__nav-item" as="div">
            <Link
              className="pfoot__nav-card pfoot__nav-card--next"
              to={`/projects/${getProjectRouteParam(nextProject)}`}
            >
              <div>
                <span className="pfoot__nav-label">Next</span>
                <span className="pfoot__nav-title">{getProjectTitle(nextProject)}</span>
              </div>
              <ArrowRight size={14} />
            </Link>
          </Reveal>
        )}
      </div>
    </footer>
  );
};

export default ProjectFooter;
