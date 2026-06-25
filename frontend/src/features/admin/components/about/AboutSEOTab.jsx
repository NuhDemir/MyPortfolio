import { Field, Input, Textarea } from "@shared";

export const AboutSEOTab = ({ formData, onChange }) => (
  <div className="abt-tab">
    <Field label="SEO Başlık">
      <Input name="seoTitle" value={formData.seoTitle} onChange={onChange} placeholder="Nuh Demir | Hakkımda" />
    </Field>

    <Field label="SEO Açıklama">
      <Textarea name="seoDescription" value={formData.seoDescription} onChange={onChange} rows={3} placeholder="Nuh Demir hakkında sayfası..." />
    </Field>

    <Field label="Anahtar Kelimeler (virgülle ayırın)">
      <Input name="seoKeywords" value={formData.seoKeywords} onChange={onChange} placeholder="about, portfolio, full stack" />
    </Field>
  </div>
);
