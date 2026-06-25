import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button, Field, Input, Textarea } from "@shared";
import { useContactForm } from "../../hooks/useContactForm";
import "./ContactForm.css";

export const ContactForm = () => {
  const { formData, status, handleChange, handleSubmit, reset } =
    useContactForm();

  if (status === "success") {
    return (
      <div className="cf cf--success">
        <CheckCircle2 size={48} className="cf__success-icon" />
        <h3 className="cf__success-title">Teşekkürler!</h3>
        <p className="cf__success-text">
          Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.
        </p>
        <Button variant="secondary" size="sm" onClick={reset}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={handleSubmit} noValidate>
      <Field label="İsim">
        <Input
          type="text"
          name="name"
          placeholder="Adınız"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Field>

      <Field label="E-posta">
        <Input
          type="email"
          name="email"
          placeholder="ornek@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Field>

      <Field label="Mesaj">
        <Textarea
          name="message"
          placeholder="Mesajınızı buraya yazın..."
          value={formData.message}
          onChange={handleChange}
          rows={6}
          required
        />
      </Field>

      {status === "error" && (
        <p className="cf__error">
          Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        full
        icon={status === "submitting" ? Loader2 : Send}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
    </form>
  );
};
