import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
import { LoadingSpinner, useScrollReveal } from "@shared";
import "@features/about/styles/about.css";

const Section = ({ children, variant = "fadeUp", delay = 0, ...props }) => {
  const rev = useScrollReveal({ variant, delay, threshold: 0.08 });
  return <motion.section className="about3__section" {...rev} {...props}>{children}</motion.section>;
};

const AboutPage = () => {
  const { content, github, loading } = useAboutData();
  const { statsRef, bioRef, skillsRef } = useAboutAnimations();

  useEffect(() => { document.title = "Hakkımda | Nuh Demir"; }, []);

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
      <Section delay={0}>
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
      </Section>

      <Section delay={0.1}>
        <div ref={skillsRef}>
          <Skills />
        </div>
      </Section>

      <Section delay={0.15}>
        <Services />
      </Section>

      <Section delay={0.2}>
        <ResourcesTeaser />
      </Section>

      <Section delay={0.25}>
        <Timeline />
      </Section>

      <Section delay={0.3}>
        <CTA />
      </Section>
    </div>
  );
};

export default AboutPage;
