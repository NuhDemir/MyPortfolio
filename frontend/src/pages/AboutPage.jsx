import { useEffect, useMemo } from "react";
import {
  useAboutData,
  useAboutAnimations,
  Stats,
  Bio,
  Skills,
  Services,
  ResourcesTeaser,
  Timeline,
  CTA,
} from "@features/about";
import { LoadingSpinner } from "@shared";
import "@features/about/styles/about.css";

const AboutPage = () => {
  const { content, github, loading } = useAboutData();
  const { statsRef, bioRef, skillsRef } = useAboutAnimations();

  useEffect(() => { document.title = "Hakkımda | Nuh Demir"; }, []);

  const header = useMemo(() => content?.header || {}, [content]);
  const stats = useMemo(() => (content?.stats || []).map((s) => ({ value: s.value || "--", label: s.label, link: s.cta?.url })), [content]);
  const paragraphs = useMemo(() => (content?.seo?.description ? [content.seo.description] : []), [content]);

  if (loading) {
    return (
      <div className="about3">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="about3">
      <section className="about3__section">
        <div className="about3__intro">
      <div ref={bioRef}>
          <Bio paragraphs={paragraphs} />
        </div>
          <div className="about3__avatar">
            <img src="/me/nuhdemir.png" alt="Nuh Demir" />
          </div>
        </div>
        <div ref={statsRef}>
          <Stats stats={stats} github={github} />
        </div>
      </section>



      <section className="about3__section">
        <div ref={skillsRef}>
          <Skills />
        </div>
      </section>

      <section className="about3__section">
        <Services />
      </section>

      <section className="about3__section">
        <ResourcesTeaser />
      </section>

      <section className="about3__section">
        <Timeline />
      </section>

      <section className="about3__section">
        <CTA />
      </section>
    </div>
  );
};

export default AboutPage;
