import { useEffect, useRef, useState } from "react";
import "./Reveal.css";

const Reveal = ({ as = "div", className = "", threshold = 0.12, children }) => {
  const Component = as;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Reveal;
