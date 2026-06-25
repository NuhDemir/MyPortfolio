import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@shared/design-system/components/Button";

export const CTA = () => (
  <section className="about3__cta">
    <p className="about3__cta-text">Birlikte çalışalım</p>
    <Button
      as={Link}
      to="/iletisim"
      variant="primary"
      size="lg"
      icon={ArrowRight}
      iconPosition="end"
    >
      İletişime Geç
    </Button>
  </section>
);
