import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Link2, X } from "lucide-react";
import { Button, Field, Input, Textarea } from "@shared";

const ServiceCard = ({ service, index, onUpdate, onRemove, onAddTech, onRemoveTech, onAddLink, onRemoveLink }) => {
  const [expanded, setExpanded] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  return (
    <div className="abt-svc-card">
      <div className="abt-svc-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="abt-svc-card__title-row">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="abt-svc-card__title">{service.title || "Yeni Servis"}</span>
          <span className="abt-svc-card__id">{service.id}</span>
        </div>
        <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={(e) => { e.stopPropagation(); onRemove(index); }} aria-label="Servisi sil">
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="abt-svc-card__body">
          <div className="form-grid">
            <Field label="ID">
              <Input value={service.id} onChange={(e) => onUpdate(index, "id", e.target.value)} placeholder="frontend" />
            </Field>
            <Field label="Başlık">
              <Input value={service.title} onChange={(e) => onUpdate(index, "title", e.target.value)} placeholder="Frontend Mimarisi" />
            </Field>
          </div>

          <Field label="Problem">
            <Textarea value={service.problem || ""} onChange={(e) => onUpdate(index, "problem", e.target.value)} rows={2} placeholder="Çözülmesi gereken problem..." />
          </Field>

          <Field label="Çözüm">
            <Textarea value={service.solution || service.desc || ""} onChange={(e) => onUpdate(index, "solution", e.target.value)} rows={2} placeholder="Uygulanan çözüm..." />
          </Field>

          <div className="form-grid">
            <Field label="Görsel URL">
              <Input value={service.image || ""} onChange={(e) => onUpdate(index, "image", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Açıklama (kısa)">
              <Input value={service.description || ""} onChange={(e) => onUpdate(index, "description", e.target.value)} placeholder="Kısa açıklama..." />
            </Field>
          </div>

          <div className="abt-svc-card__section">
            <h4 className="abt-svc-card__section-title">Teknolojiler</h4>
            <div className="abt-svc-card__pills">
              {(service.tech || []).map((t, i) => (
                <span key={i} className="abt-svc-card__pill">
                  {t}
                  <button type="button" onClick={() => onRemoveTech(index, i)} aria-label={`${t} kaldır`}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="abt-svc-card__add-row">
              <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Yeni teknoloji ekle..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTech(index, newTech); setNewTech(""); } }} />
              <Button type="button" variant="secondary" size="sm" onClick={() => { onAddTech(index, newTech); setNewTech(""); }}>Ekle</Button>
            </div>
          </div>

          <div className="abt-svc-card__section">
            <h4 className="abt-svc-card__section-title">Linkler</h4>
            <ul className="abt-svc-card__links">
              {(service.links || []).map((l, i) => (
                <li key={i} className="abt-svc-card__link-item">
                  <Link2 size={12} />
                  <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  <button type="button" onClick={() => onRemoveLink(index, i)} aria-label={`${l.label} kaldır`}><X size={12} /></button>
                </li>
              ))}
            </ul>
            <div className="abt-svc-card__add-row abt-svc-card__add-row--dual">
              <Input value={newLink.label} onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))} placeholder="Etiket" />
              <Input value={newLink.url} onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))} placeholder="URL" />
              <Button type="button" variant="secondary" size="sm" onClick={() => { onAddLink(index, newLink); setNewLink({ label: "", url: "" }); }}>Ekle</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AboutServicesTab = ({ services, onUpdate, onAdd, onRemove, onAddTech, onRemoveTech, onAddLink, onRemoveLink }) => (
  <div className="abt-tab">
    <div className="abt-tab__header">
      <h3>{services.length} Servis</h3>
      <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={onAdd}>Servis Ekle</Button>
    </div>

    <div className="abt-svc-list">
      {services.map((s, i) => (
        <ServiceCard
          key={i}
          service={s}
          index={i}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onAddTech={onAddTech}
          onRemoveTech={onRemoveTech}
          onAddLink={onAddLink}
          onRemoveLink={onRemoveLink}
        />
      ))}
      {!services.length && <p className="admin-empty-state">Henüz servis eklenmedi.</p>}
    </div>
  </div>
);
