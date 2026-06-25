import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Input } from "@shared";

export const AboutStatsTab = ({ stats, onUpdate, onAdd, onRemove }) => (
  <div className="abt-tab">
    <div className="abt-tab__header">
      <h3>{stats.length} İstatistik</h3>
      <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={onAdd}>İstatistik Ekle</Button>
    </div>

    <div className="abt-stat-list">
      {stats.map((s, i) => (
        <div key={i} className="abt-stat-card">
          <div className="abt-stat-card__header">
            <span className="abt-stat-card__index">#{i + 1}</span>
            <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={() => onRemove(i)} aria-label="İstatistiği sil">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="form-grid">
            <Field label="Key">
              <Input value={s.key || ""} onChange={(e) => onUpdate(i, "key", e.target.value)} placeholder="projectsCount" />
            </Field>
            <Field label="Etiket">
              <Input value={s.label || ""} onChange={(e) => onUpdate(i, "label", e.target.value)} placeholder="Proje" />
            </Field>
          </div>
          <div className="form-grid">
            <Field label="Değer Kaynağı">
              <select value={s.valueSource || "static"} onChange={(e) => onUpdate(i, "valueSource", e.target.value)} className="form-group select">
                <option value="static">Statik Değer</option>
                <option value="github">GitHub</option>
              </select>
            </Field>
            {s.valueSource === "static" ? (
              <Field label="Statik Değer">
                <Input value={s.staticValue || ""} onChange={(e) => onUpdate(i, "staticValue", e.target.value)} placeholder="42" />
              </Field>
            ) : (
              <Field label="GitHub Alanı">
                <select value={s.githubField || "public_repos"} onChange={(e) => onUpdate(i, "githubField", e.target.value)} className="form-group select">
                  <option value="public_repos">Repo Sayısı</option>
                  <option value="followers">Takipçi</option>
                  <option value="following">Takip Edilen</option>
                  <option value="public_gists">Gist</option>
                </select>
              </Field>
            )}
          </div>
        </div>
      ))}
      {!stats.length && <p className="admin-empty-state">Henüz istatistik eklenmedi.</p>}
    </div>
  </div>
);
