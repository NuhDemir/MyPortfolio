import { useState } from "react";
import { Send, X, Check, FileText } from "lucide-react";
import { Button, Field, Input, Textarea } from "@shared";
import { submitContactForm } from "@features/contact/services/contactService";
import "./MessageForm.css";

const initialFormData = { name: "", email: "", message: "" };

const MessageForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");
  const [visible, setVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitContactForm(formData);
      setStatus("success");
      setVisible(false);
      setFormData(initialFormData);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setFormData(initialFormData);
  };

  return (
    <section className="mf">
      {status === "success" ? (
        <div className="mf__success">
          <Check size={40} className="mf__success-icon" />
          <h2 className="mf__success-title">Teşekkürler!</h2>
          <p className="mf__success-text">
            Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
          </p>
          <Button variant="secondary" size="sm" icon={FileText} onClick={reset}>
            Yeni Mesaj Gönder
          </Button>
        </div>
      ) : (
        <>
          <header className="mf__header">
            <h1 className="mf__title">Bana Mesaj Gönderin!</h1>
            <p className="mf__subtitle">
              Fikirlerinizi, sorularınızı veya geri bildirimlerinizi gönderebilirsiniz.
            </p>
            {!visible && (
              <Button
                variant="primary"
                size="lg"
                icon={Send}
                onClick={() => setVisible(true)}
              >
                Mesaj Gönder
              </Button>
            )}
          </header>

          {visible && (
            <div className="mf__form-wrapper">
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={() => setVisible(false)}
                className="mf__close"
              >
                Kapat
              </Button>

              <form onSubmit={handleSubmit} noValidate className="mf__form">
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

                <Field label="Mesajınız">
                  <Textarea
                    name="message"
                    placeholder="Mesajınızı buraya yazın..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </Field>

                {status === "error" && (
                  <p className="mf__error">
                    Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  full
                  icon={Send}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Gönderiliyor..." : "Mesaj Gönder"}
                </Button>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MessageForm;
