import React, { useEffect } from "react";
import { useResources } from "../hooks/useResources.js";
import ResourceGrid from "../components/Resources/ResourceGrid.jsx";
import ResourceFilters from "../components/Resources/ResourceFilters.jsx";
import "../styles/resources.css";

const ResourcesPage = () => {
  const { resources, loading, filters, setFilters } = useResources();

  useEffect(() => {
    document.title = "Kaynaklar | Nuh Demir";
  }, []);

  return (
    <div className="res-page">
      <section className="res-page__section">
        <div className="res-page__header">
          <h1 className="res-page__title">Kaynaklar</h1>
          <p className="res-page__subtitle">
            Yazilim gelistirme, mimari ve urun tasarimi uzerine sectigim kaynaklar.
          </p>
        </div>

        <ResourceFilters filters={filters} onChange={setFilters} />

        <ResourceGrid resources={resources} loading={loading} />
      </section>
    </div>
  );
};

export default ResourcesPage;
