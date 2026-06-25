import { Field, Input, Textarea } from "@shared";

export const AboutGeneralTab = ({ formData, onChange }) => (
  <div className="abt-tab">
    <div className="form-grid">
      <Field label="Badge">
        <Input name="badge" value={formData.badge} onChange={onChange} placeholder="About" />
      </Field>
      <Field label="Başlık">
        <Input name="title" value={formData.title} onChange={onChange} required />
      </Field>
    </div>

    <Field label="Alt Başlık">
      <Textarea name="subtitle" value={formData.subtitle} onChange={onChange} rows={3} />
    </Field>

    <div className="form-grid">
      <Field label="GitHub Kullanıcı Adı">
        <Input name="githubUsername" value={formData.githubUsername} onChange={onChange} required />
      </Field>
      <Field label="GitHub Profil URL">
        <Input name="githubProfileUrl" type="url" value={formData.githubProfileUrl} onChange={onChange} required />
      </Field>
    </div>

    <label className="checkbox-group" htmlFor="isActive">
      <input id="isActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={onChange} />
      <span>About Sayfası Aktif</span>
      <span className="checkbox-group__state">{formData.isActive ? "Yayında" : "Pasif"}</span>
    </label>
  </div>
);
