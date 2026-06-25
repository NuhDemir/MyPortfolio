import React from "react";
import ResourceCard from "./ResourceCard.jsx";
import "./ResourceGrid.css";

const ResourceGrid = React.memo(({ resources, loading }) => {
  if (loading) {
    return (
      <div className="res-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="res-card-skeleton">
            <div className="res-skeleton-cover" />
            <div className="res-skeleton-body">
              <div className="res-skeleton-line w-75" />
              <div className="res-skeleton-line w-50" />
              <div className="res-skeleton-line w-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!resources.length) {
    return (
      <div className="res-grid-empty">
        <p>Henuz kaynak eklenmemis.</p>
      </div>
    );
  }

  return (
    <div className="res-grid">
      {resources.map((r) => (
        <ResourceCard key={r.id || r.slug} resource={r} />
      ))}
    </div>
  );
});

export default ResourceGrid;
