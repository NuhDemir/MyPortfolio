import { useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@shared";
import { ContactHero, ContactForm, ContactInfo, ContactComments } from "@features/contact";
import "./ContactPage.css";

const ContactPage = () => {
  useEffect(() => {
    document.title = "İletişim | Nuh Demir";
  }, []);

  const rev = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });

  return (
    <div className="cp">
      <ContactHero />

      <motion.div className="cp__grid" {...rev}>
        <div className="cp__form">
          <ContactForm />
        </div>

        <div className="cp__side">
          <ContactInfo />
          <ContactComments />
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
