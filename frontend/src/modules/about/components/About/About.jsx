import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header.jsx";
import StatCard from "./StatCard.jsx";
import ServiceCard from "./ServiceCard/ServiceCard.jsx";
import Modal from "@shared/ui/Modal.jsx";
import useAboutGsapAnimations from "../../hooks/useAboutGsapAnimation.js";
import {
  cloneDefaultAboutContent,
} from "@modules/about/data/defaultAboutContent.js";
import { getAboutContent } from "@modules/about/services/aboutContentService.js";
import "./style/About.css";

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));

const AboutStarDoodle = () => (
  <svg
    className="about-doodle about-doodle--star"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22 5 L26 17 L39 17 L29 24 L33 37 L22 30 L11 37 L15 24 L5 17 L18 17 Z"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const AboutDotsDoodle = () => (
  <svg
    className="about-doodle about-doodle--dots"
    viewBox="0 0 62 34"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="8"
      cy="10"
      r="5.5"
      fill="var(--color-primary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="30"
      cy="22"
      r="4"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="52"
      cy="12"
      r="6"
      fill="var(--color-secondary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
  </svg>
);

const AboutServiceModalContent = ({ service }) => {
  if (!service) {
    return null;
  }

  const modal = service.modal ?? {};
  const sections = Array.isArray(modal.sections) ? modal.sections : [];

  return (
    <div className="about-modal-content" data-about-modal={service.id ?? "service"}>
      <section className="about-modal-content__panel scribble-card-wrap">
        <div
          className="about-modal-content__panel-fill scribble-card-wrap__fill"
          aria-hidden="true"
        />
        <div className="about-modal-content__panel-body naive-shadow--sm">
          <h3 className="about-modal-content__heading">
            {modal.heading || service.title}
          </h3>
          <p className="about-modal-content__lead">{modal.lead}</p>
        </div>
      </section>

      {sections.map((section, sectionIndex) => (
        <section
          key={`${service.id}-section-${section.title}-${sectionIndex}`}
          className="about-modal-content__section"
        >
          <h4 className="about-modal-content__section-title">{section.title}</h4>
          <ul className="about-modal-content__section-body about-modal-content__list">
            {(section.items ?? []).map((item, itemIndex) => (
              <li
                key={`${service.id}-item-${item.title}-${itemIndex}`}
                className="about-modal-content__item"
              >
                <span className="about-modal-content__item-title">{item.title}</span>
                <span className="about-modal-content__item-body">{item.body}</span>
                {item.linkLabel && item.linkUrl ? (
                  <span className="about-modal-content__item-body">
                    <a
                      className="about-modal-content__inline-link"
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.linkLabel}
                    </a>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {modal.footnote ? (
        <p className="about-modal-content__footnote">
          {modal.footnote}{" "}
          {modal.footnoteLinkLabel && modal.footnoteLinkUrl ? (
            <a
              className="about-modal-content__inline-link"
              href={modal.footnoteLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {modal.footnoteLinkLabel}
            </a>
          ) : null}
        </p>
      ) : null}
    </div>
  );
};

const About = () => {
  const { headerRef, statsContainerRef, servicesContainerRef, animateModalContentLoad } =
    useAboutGsapAnimations();

  const [aboutContent, setAboutContent] = useState(() => cloneDefaultAboutContent());
  const [githubStats, setGithubStats] = useState({});
  const [activeModalId, setActiveModalId] = useState(null);
  const [currentModalService, setCurrentModalService] = useState(null);

  const header = aboutContent?.header ?? {};
  const github = aboutContent?.github ?? {};

  const stats = useMemo(
    () => sortByOrder(Array.isArray(aboutContent?.stats) ? aboutContent.stats : []),
    [aboutContent?.stats],
  );

  const services = useMemo(
    () =>
      sortByOrder(Array.isArray(aboutContent?.services) ? aboutContent.services : []),
    [aboutContent?.services],
  );

  const githubUsername = github.username || "NuhDemir";

  const resolveStatValue = (stat) => {
    if (stat?.valueSource === "github") {
      return githubStats?.[stat.githubField] ?? "...";
    }

    return stat?.staticValue ?? "...";
  };

  useEffect(() => {
    let isMounted = true;

    const loadAboutContent = async () => {
      try {
        const data = await getAboutContent();

        if (!isMounted || !data) {
          return;
        }

        setAboutContent((prev) => ({
          ...prev,
          ...data,
          header: {
            ...(prev.header ?? {}),
            ...(data.header ?? {}),
          },
          github: {
            ...(prev.github ?? {}),
            ...(data.github ?? {}),
          },
          stats: Array.isArray(data.stats) ? data.stats : prev.stats,
          services: Array.isArray(data.services) ? data.services : prev.services,
          seo: {
            ...(prev.seo ?? {}),
            ...(data.seo ?? {}),
          },
        }));
      } catch {
        // Fallback content is already loaded from local defaults.
      }
    };

    loadAboutContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch(`https://api.github.com/users/${githubUsername}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setGithubStats({
          public_repos: data?.public_repos,
          followers: data?.followers,
          following: data?.following,
          public_gists: data?.public_gists,
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setGithubStats({});
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [githubUsername]);

  useEffect(() => {
    if (activeModalId === null) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      const modalContentRoot = document.querySelector(".modal-content");
      animateModalContentLoad(modalContentRoot ?? document);
    }, 120);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [activeModalId, animateModalContentLoad]);

  const openModal = (serviceId) => {
    const service = services.find((entry) => entry.id === serviceId);
    if (service) {
      setCurrentModalService(service);
      setActiveModalId(serviceId);
    }
  };

  const closeModal = () => {
    setActiveModalId(null);
    setCurrentModalService(null);
  };

  return (
    <div className="about-container">
      <div className="about-shell scribble-card-wrap">
        <div className="about-shell__fill scribble-card-wrap__fill" aria-hidden="true" />

        <div className="about-shell__body naive-shadow">
          <div ref={headerRef} className="about-shell__header">
            <Header title={header.title} subtitle={header.subtitle} />
            {header.badge ? (
              <span className="about-shell__tag naive-pill">{header.badge}</span>
            ) : null}
          </div>

          <AboutStarDoodle />
          <AboutDotsDoodle />

          <div className="about-grid">
            <div className="stats-container" ref={statsContainerRef}>
              {stats.map((stat, index) => (
                <StatCard
                  key={`${stat.key ?? stat.label ?? "stat"}-${index}`}
                  value={resolveStatValue(stat)}
                  label={stat.label}
                  actionLabel={stat?.cta?.label}
                  actionHref={stat?.cta?.url}
                  actionAriaLabel={
                    stat?.cta?.label
                      ? `${stat.label} baglantisini ac`
                      : undefined
                  }
                />
              ))}
            </div>

            <div className="services-section" ref={servicesContainerRef}>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.iconUrl}
                  iconBgColor={service.iconBgColor}
                  title={service.title}
                  description={service.description}
                  onLearnMoreClick={() => openModal(service.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={activeModalId !== null}
        onClose={closeModal}
        title={currentModalService?.modal?.heading || currentModalService?.title || ""}
      >
        <AboutServiceModalContent service={currentModalService} />
      </Modal>
    </div>
  );
};

export default About;
