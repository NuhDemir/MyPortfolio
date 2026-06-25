import { useEffect } from "react";
import { ContactHero, ContactForm, ContactInfo, ContactComments } from "@features/contact";
import "./ContactPage.css";

const ContactPage = () => {
  useEffect(() => {
    document.title = "İletişim | Nuh Demir";
  }, []);

  return (
    <div className="cp">
      <ContactHero />

      <div className="cp__grid">
        <div className="cp__form">
          <ContactForm />
        </div>

        <div className="cp__side">
          <ContactInfo />
          <ContactComments />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
