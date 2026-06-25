import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@shared";
import { useResources } from "../hooks/useResources.js";
import ResourceGrid from "../components/Resources/ResourceGrid.jsx";
import ResourceFilters from "../components/Resources/ResourceFilters.jsx";
import "../styles/resources.css";

const ResourcesPage = () => {
  const { resources, loading, filters, setFilters } = useResources();

  useEffect(() => {
    document.title = "Kaynaklar | Nuh Demir";
  }, []);

  const rev = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });

  return (
    <div className="res-page">
      <motion.section className="res-page__section" {...rev}>
        <div className="res-page__header">
          <h1 className="res-page__title">Kaynaklar</h1>
          <p className="res-page__subtitle">
            Yazilim gelistirme, mimari ve urun tasarimi uzerine sectigim kaynaklar.
          </p>
        </div>

        <motion.div {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 })}>
          <ResourceFilters filters={filters} onChange={setFilters} />
        </motion.div>

        <motion.div {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.2 })}>
          <ResourceGrid resources={resources} loading={loading} />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ResourcesPage;
