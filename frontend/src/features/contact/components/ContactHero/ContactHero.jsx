import { motion } from "framer-motion";
import { useScrollReveal } from "@shared";
import "./ContactHero.css";

export const ContactHero = () => {
  const rev = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });

  return (
    <motion.section className="cth" {...rev}>
      <h1 className="cth__title">İletişim</h1>
      <p className="cth__subtitle">
        Projeleriniz veya iş birliği fırsatları için benimle iletişime geçin.
      </p>
    </motion.section>
  );
};
