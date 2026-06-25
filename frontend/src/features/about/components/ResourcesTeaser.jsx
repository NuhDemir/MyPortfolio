import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useResources } from "../../resources/hooks/useResources.js";
import ResourceCard from "../../resources/components/Resources/ResourceCard.jsx";

export const ResourcesTeaser = () => {
  const { resources, loading } = useResources({ featured: "true" });

  const featured = resources.filter((r) => r.isFeatured).slice(0, 3);
  const display = featured.length >= 3 ? featured : resources.slice(0, 3);

  if (!loading && display.length === 0) return null;

  return (
    <section className="about3__resources">
      <div className="about3__resources-header">
        <h2 className="about3__resources-title">Kaynaklar</h2>
        <Link to="/kaynaklar" className="about3__resources-link">
          Tum kaynaklar <ArrowRight size={16} />
        </Link>
      </div>
      <p className="about3__resources-subtitle">
        Yazilim gelistirme ve mimari uzerine sectigim kaynaklar.
      </p>
      <div className="about3__resources-grid">
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="about3__resources-skeleton" />
            ))
          : display.map((r) => (
              <ResourceCard key={r.id || r.slug} resource={r} />
            ))}
      </div>
    </section>
  );
};

export default ResourcesTeaser;
